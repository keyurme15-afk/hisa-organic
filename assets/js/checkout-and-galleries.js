(function(){const drawer=document.getElementById('drawer'),form=document.getElementById('hisaCheckoutStep'),next=document.getElementById('hisaProceedCheckout'),back=document.getElementById('hisaBackToCart');if(!drawer||!form||!next||!back)return;function stage(checkout){drawer.classList.toggle('hisa-checkout-mode',checkout);form.hidden=!checkout;form.style.display=checkout?'block':'none';next.style.display=checkout?'none':'block';drawer.scrollTop=0;}next.addEventListener('click',()=>stage(true));back.addEventListener('click',()=>stage(false));document.addEventListener('click',function(e){if(e.target.closest('[onclick*="openCart"],[onclick*="closeCart"]')){if(e.target.closest('[onclick*="openCart"]'))stage(false);}});window.hisaCartStage=stage;stage(false);})();
;

/* hisaGlobalSearchLogic */

(function(){'use strict';
const input=document.getElementById('hisaSearchInput'),results=document.getElementById('hisaSearchResults'),clear=document.getElementById('hisaSearchClear');if(!input||!results)return;
const items=[];
function add(list,kind,category){if(!Array.isArray(list))return;list.forEach((name,index)=>items.push({name:String(name)+(kind==='herbal'?' Powder':kind==='fragrance'?' Fragrance':''),raw:String(name),kind,index,category}));}
try{add(names,'soap','Soap Bases')}catch(e){}
try{add(fragranceNames,'fragrance','Fragrances')}catch(e){}
try{add(hisaCollections.herbal,'herbal','Herbal Powders');add(hisaCollections.wax,'wax','Waxes');add(hisaCollections.cream,'cream','Creams & Lotions')}catch(e){}
add(['Transparent Shampoo','Pearly Shampoo','Transparent Face Wash','Pearly Face Wash','Transparent Body Wash','Pearly Body Wash'],'liquid','Liquid Products');
function norm(t){return String(t).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function render(){const q=norm(input.value);results.replaceChildren();results.hidden=!q;if(!q)return;const matches=items.filter(x=>norm(x.name).includes(q)||norm(x.category).includes(q)).slice(0,45);if(!matches.length){const d=document.createElement('div');d.className='hisa-search-empty';d.textContent='No products found. Try a different name.';results.append(d);return}matches.forEach(item=>{const b=document.createElement('button');b.type='button';b.className='hisa-search-result';const title=document.createElement('strong');title.textContent=item.name;const group=document.createElement('small');group.textContent=item.category+'  ›';b.append(title,group);b.addEventListener('click',()=>open(item));results.append(b)})}
function open(item){input.value='';results.hidden=true;results.replaceChildren();try{showCategory(item.kind);if(item.kind==='soap'){openProduct(item.index);return}if(item.kind==='fragrance'){openFragrance(item.index);return}if(item.kind==='liquid'){const cards=[...document.querySelectorAll('#liquidSix button,#liquidSix a,#liquidSix article')];const match=cards.find(el=>norm(el.textContent).includes(norm(item.raw))&&el.getAttribute('onclick'));if(match){match.click();return}}
const cards=[...document.querySelectorAll('#hisaExtraProducts .hisa-extra-card')];const card=cards[item.index];if(card){const target=card.querySelector('h3');if(target){card.scrollIntoView({behavior:'smooth',block:'center'});const clickable=card.querySelector('[onclick*="Detail"], [data-open-detail]');if(clickable)clickable.click();return}}
}catch(e){console.error('Search navigation:',e)}
const target=document.getElementById('categoryInfo')||document.getElementById('categories');if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
}
input.addEventListener('input',render);clear.addEventListener('click',()=>{input.value='';render();input.focus()});input.addEventListener('keydown',e=>{if(e.key==='Escape'){input.value='';render()}else if(e.key==='Enter'){const first=results.querySelector('button');if(first)first.click()}});
})();
;

/* hisa-sticky-cart-script */

(function(){
 const bar=document.getElementById('hisaStickyCart'), label=document.getElementById('hisaStickyName'),action=document.getElementById('hisaStickyAction');
 let target=null;
 function visible(el){if(!el)return false;const st=getComputedStyle(el);return st.display!=='none'&&st.visibility!=='hidden'&&el.getClientRects().length>0}
 function findAction(){
   const wax=document.getElementById('hisaWaxDetail');
   if(wax&&wax.classList.contains('open'))return [...wax.querySelectorAll('button')].find(b=>/add to cart/i.test(b.textContent)&&visible(b));
   const soap=document.getElementById('productDetail');
   if(document.body.dataset.page==='soap-detail'&&visible(soap))return [...soap.querySelectorAll('button')].find(b=>/add to cart/i.test(b.textContent)&&visible(b));
   const fragrance=document.getElementById('fragranceDetail');
   if(document.body.dataset.page==='fragrance-detail'&&visible(fragrance))return [...fragrance.querySelectorAll('button')].find(b=>/add to cart/i.test(b.textContent)&&visible(b));
   // Some herbal/liquid detail screens use dedicated panels.
   const panels=[...document.querySelectorAll('[role="dialog"], [id*="Detail"], [class*="detail-page"]')].filter(el=>el!==bar&&visible(el));
   for(const panel of panels.reverse()){
     if(panel.closest('#drawer')||panel.closest('#hisaStickyCart'))continue;
     const b=[...panel.querySelectorAll('button')].find(x=>/add to cart/i.test(x.textContent)&&visible(x));if(b)return b;
   }
   return null;
 }
 function update(){
   target=findAction();
   const isCheckout=visible(document.getElementById('drawer'))&&document.getElementById('drawer').classList.contains('open');
   const show=!!target&&!isCheckout;
   bar.classList.toggle('is-visible',show);document.body.classList.toggle('hisa-has-sticky',show);
   if(show){let panel=target.closest('#hisaWaxDetail,#productDetail,#fragranceDetail,[role="dialog"]');let h=panel?.querySelector('h1,h2,h3,[id*="Name"]');label.textContent=(h?.textContent||'Selected product').trim().slice(0,85);action.disabled=target.disabled;}
 }
 action.addEventListener('click',function(){if(target&&target.isConnected&&!target.disabled)target.click();setTimeout(update,80)});
 document.addEventListener('click',()=>setTimeout(update,90),true);
 window.addEventListener('popstate',()=>setTimeout(update,90));
 window.addEventListener('hashchange',()=>setTimeout(update,90));
 // Listen for product-detail visibility changes, without continuously polling.
 const mo=new MutationObserver(()=>{if(!bar.isConnected)return;requestAnimationFrame(update)});
 ['productDetail','fragranceDetail','hisaWaxDetail'].forEach(id=>{let el=document.getElementById(id);if(el)mo.observe(el,{attributes:true,attributeFilter:['class','style']})});
 mo.observe(document.body,{attributes:true,attributeFilter:['data-page']});
 setTimeout(update,300);
})();
;

/* hisa-cart-no-auto-open */

(function(){
 let hideTimer;
 window.hisaAddedToast=function(){
  const el=document.getElementById('hisaAddedToast');if(!el)return;
  el.classList.add('visible');clearTimeout(hideTimer);
  hideTimer=setTimeout(()=>el.classList.remove('visible'),2200);
 };
 // Keep View Cart explicitly accessible through the three-dot menu.
 // Adding products never navigates away from the current product page.
})();
;

/* hisa-view-cart-order-checkout-fix */

(function(){
  function review(){
    const source=document.getElementById('cartItems');
    const target=document.getElementById('hisaCheckoutOrderItems');
    const total=document.getElementById('hisaCheckoutOrderTotal');
    if(!target||!total)return;
    // Read the live combined cart so soap, liquid, fragrance, herbal and wax products are included.
    if(source){
      const copy=source.cloneNode(true);
      copy.querySelectorAll('button,input,select,textarea').forEach(el=>el.remove());
      copy.querySelectorAll('[onclick]').forEach(el=>el.removeAttribute('onclick'));
      target.innerHTML=copy.innerHTML;
    }
    const subtotal=document.getElementById('subtotal');
    total.textContent=subtotal?subtotal.textContent:'Review total in My Cart';
  }
  window.hisaViewCartAndOrder=function(){
    if(typeof window.updateCart==='function')try{window.updateCart()}catch(e){}
    if(typeof window.openCart==='function')window.openCart();
    if(typeof window.hisaCartStage==='function')window.hisaCartStage(true);
    review();
  };
  const proceed=document.getElementById('hisaProceedCheckout');
  if(proceed)proceed.addEventListener('click',()=>setTimeout(review,0));
  // Keep order summary current when cart contents are updated.
  const cartItems=document.getElementById('cartItems');
  if(cartItems&&typeof MutationObserver!=='undefined'){
    let queued=false;
    new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;if(document.getElementById('drawer')?.classList.contains('hisa-checkout-mode'))review()})}).observe(cartItems,{childList:true,subtree:true});
  }
})();
;

(function(){
'use strict';
const HISTORY='hisa_repeat_orders_v2';
function read(k,defaultValue){try{return JSON.parse(localStorage.getItem(k)||'null')||defaultValue}catch(e){return defaultValue}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
const safe=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function catalogue(){let out=[];if(typeof products!=='undefined')products.forEach(p=>out.push({key:'soap|'+p.id,name:p.name+' Soap Base',kind:'soap',id:p.id}));if(typeof hisaCollections!=='undefined')Object.entries(hisaCollections).forEach(([kind,names])=>names.forEach((name,i)=>out.push({key:kind+'|'+i,name,kind,id:i})));return out}
window.hisaPlusClose=function(){document.getElementById('hisaPlusPanel').classList.remove('open')};
window.hisaPlusShow=function(which){let content=document.getElementById('hisaPlusContent');const items=catalogue();let html='';
if(which==='repeat'){let history=read(HISTORY,[]);html='<h2>↻ Buy Again</h2><p class="hisaPlusMuted">Recent WhatsApp checkout attempts saved in this browser. An attempt is not a confirmed or paid order.</p>'+(history.length?history.map((o,i)=>'<div class="hisaPlusRow"><div><strong>'+safe(o.date)+'</strong><div class="hisaPlusMuted">'+safe(o.summary)+'</div></div><button class="hisaPrimary" onclick="hisaPlusRepeat('+i+')">Add Items to Cart</button></div>').join(''):'<p>No previous checkout attempts saved yet. Future orders will appear here.</p>')}
else if(which==='bulk'){html='<h2>₹ Mixed Soap Base Bulk Calculator</h2><p>Combine any soap-base varieties. Discount is based on total soap-base weight.</p><label for="hisaBulkKg">Total soap-base weight (kg)</label><input class="hisaPlusInput" id="hisaBulkKg" type="number" min="1" max="10000" step="1" value="25" oninput="hisaPlusBulk()"><div id="hisaBulkResult" style="padding:14px 0;font-weight:600"></div><p class="hisaPlusMuted">Shipping is extra. Other products do not count towards the soap-base tier.</p>'}
else if(which==='policies'){html='<h2>Hisa Organic • Information & Policies</h2><h3>About Us</h3><p>Hisa Organic supplies soap bases and cosmetic-making raw materials for makers and businesses across India.</p><h3>Shipping</h3><p>Shipping is calculated by delivery PIN code and total order weight, rounded up to the next whole kilogram. Final delivery availability and charges are confirmed before payment.</p><h3>Orders & Payments</h3><p>Placing a WhatsApp order sends an enquiry. Payment instructions and order acceptance are confirmed directly by Hisa Organic.</p><h3>Returns & Refunds</h3><p>Please contact Hisa Organic before ordering for the applicable return, damage and refund terms. No automatic return entitlement or timeline is promised here.</p><h3>Privacy</h3><p>Saved addresses and repeat-order history on this demo are stored in your browser. WhatsApp orders are sent through WhatsApp. Do not enter payment card details into this website.</p><h3>Product Specifications</h3><p>Product descriptions are general information, not a certificate of analysis. TFM, pH, purity, ingredients, batch test results, organic certification and shelf life must be confirmed for the specific product and batch before claims are published.</p><p><a href="https://wa.me/918446441401" target="_blank" rel="noopener">Contact Hisa Organic on WhatsApp</a></p>'}
content.innerHTML=html;document.getElementById('hisaPlusPanel').classList.add('open');if(which==='bulk')hisaPlusBulk()};
window.hisaPlusBulk=function(){let el=document.getElementById('hisaBulkKg');if(!el)return;let kg=Number(el.value),out=document.getElementById('hisaBulkResult');if(!Number.isFinite(kg)||kg<1||!Number.isInteger(kg)){out.textContent='Please enter a whole number of kg.';return}let rate=kg>=100?100:kg>=25?105:110;out.innerHTML='<div>Rate: ₹'+rate+'/kg</div><div>Product Total: ₹'+(kg*rate).toLocaleString('en-IN')+'</div><div>Saving vs ₹110/kg: ₹'+(kg*(110-rate)).toLocaleString('en-IN')+'</div>'};
window.hisaPlusAddSoap=function(id){if(typeof addTier==='function')addTier(id,1);else if(typeof add==='function')add(id);hisaPlusClose()};
window.hisaPlusBrowse=function(kind){hisaPlusClose();if(typeof hisaMenuCategory==='function')hisaMenuCategory(kind)};
window.hisaPlusRepeat=function(i){let h=read(HISTORY,[])[i];if(!h)return;let count=0;Object.entries(h.soap||{}).forEach(([id,q])=>{if(typeof cart==='undefined')return;let n=Math.max(0,Number(q)||0);if(!n)return;cart[id]=(cart[id]||0)+n;count++});Object.entries(h.liquid||{}).forEach(([name,q])=>{if(typeof liquidCart==='undefined')return;let n=Math.max(0,Number(q)||0);if(!n)return;liquidCart[name]=(liquidCart[name]||0)+n;count++});Object.entries(h.quote||{}).forEach(([key,q])=>{if(typeof hisaQuoteCart==='undefined')return;hisaQuoteCart[key]=(hisaQuoteCart[key]||0)+Math.max(0,Number(q)||0);count++});if(typeof hisaSaveQuote==='function')hisaSaveQuote();if(typeof updateCart==='function')updateCart();hisaPlusClose();alert(count?'Previous items added to your cart. Please verify availability, prices and quantities.':'No restorable items found.')};
// Save a checkout snapshot before WhatsApp navigation, without claiming the order was sent.
document.addEventListener('click',function(e){let b=e.target.closest('button,input[type=submit],a');if(!b)return;let form=b.closest('form');let signature=(b.textContent||b.value||'')+' '+(b.getAttribute('onclick')||'')+' '+(form?.getAttribute('onsubmit')||'');if(!/sendOrder\(|Place Order on WhatsApp|Send.*WhatsApp|Confirm.*WhatsApp/i.test(signature))return;let soap=typeof cart!=='undefined'?{...cart}:{},liquid=typeof liquidCart!=='undefined'?{...liquidCart}:{},quote=typeof hisaQuoteCart!=='undefined'?{...hisaQuoteCart}:{};let count=Object.keys(soap).length+Object.keys(liquid).length+Object.keys(quote).length;if(!count)return;let list=read(HISTORY,[]);list.unshift({date:new Date().toLocaleDateString('en-IN'),summary:count+' product lines',soap,liquid,quote});save(HISTORY,list.slice(0,8))},true);
})();
;

/* hisa-final-touch-behavior */

(function(){'use strict';
 document.addEventListener('keydown',function(e){
  if(e.key!=='Escape')return;
  var menu=document.getElementById('hisa-menu-panel');
  if(menu&&!menu.hidden&&typeof window.hisaToggleMenu==='function')window.hisaToggleMenu(false);
 });
 var search=document.getElementById('hisaSearchInput');
 if(search)search.setAttribute('enterkeyhint','search');
})();
;

/* hisa-wax-details-only-fix-js */

(function(){
 const root=document.getElementById('hisaExtraProducts');
 const panel=document.getElementById('hisaWaxDetail');
 if(!root||!panel)return;
 const waxNames=new Set(['White Bees Wax — Grade AA','Yellow Bees Wax — Grade AA','White Candle Wax Cube — Grade AA','Raw Wax — Grade A','Soy Wax','Paraffin Wax']);
 function enhance(){
  root.querySelectorAll('.hisa-extra-card').forEach(card=>{
   const name=card.querySelector('h3')?.textContent?.trim();
   if(!waxNames.has(name))return;
   card.classList.add('hisa-wax-clickable');
   if(card.querySelector('.hisa-wax-view-details'))return;
   const btn=document.createElement('button');btn.type='button';btn.className='hisa-wax-view-details';btn.textContent='View Details & Select Pack';
   btn.setAttribute('aria-label','View '+name+' details and select pack');
   btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();card.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));});
   card.appendChild(btn);
  });
 }
 enhance();
 new MutationObserver(enhance).observe(root,{childList:true,subtree:false});
 const add=document.getElementById('hisaWaxAdd');
 if(add&&!document.getElementById('hisaWaxViewCartOrder')){
  const btn=document.createElement('button');btn.type='button';btn.id='hisaWaxViewCartOrder';btn.textContent='View Cart & Order';
  btn.addEventListener('click',function(){
   const back=document.getElementById('hisaWaxBack');
   if(back)back.click();
   setTimeout(function(){if(typeof openCart==='function')openCart();},100);
  });
  add.insertAdjacentElement('afterend',btn);
 }
})();
;

/* hisa-herbal-cart-flow-v2-js */

(function(){
 const root=document.getElementById('hisaExtraProducts');
 const detail=document.getElementById('hisaHerbalDetail');
 if(!root||!detail)return;
 function enhance(){
  root.querySelectorAll('.hisa-extra-card').forEach(card=>{
   if(!card.querySelector('.hisa-herbal-photo'))return;
   card.classList.add('hisa-herbal-detail-card');
   if(card.querySelector('.hisa-herbal-view-details'))return;
   const btn=document.createElement('button');
   btn.type='button';btn.className='hisa-herbal-view-details';
   btn.textContent='View Details & Select Pack';
   btn.addEventListener('click',function(e){
    e.preventDefault();e.stopPropagation();
    const index=Array.prototype.indexOf.call(card.parentNode.children,card);
    if(typeof window.hisaOpenHerbalDetail==='function')window.hisaOpenHerbalDetail(index);
   });
   card.appendChild(btn);
  });
 }
 enhance();
 new MutationObserver(enhance).observe(root,{childList:true,subtree:false});
 const add=detail.querySelector('.hhd-add');
 if(add&&!document.getElementById('hisaHerbalViewCartOrder')){
  const btn=document.createElement('button');btn.type='button';btn.id='hisaHerbalViewCartOrder';
  btn.textContent='View Cart & Order';
  btn.addEventListener('click',function(){
   if(typeof window.hisaHerbalBack==='function')window.hisaHerbalBack();
   setTimeout(function(){if(typeof openCart==='function')openCart();},120);
  });
  add.insertAdjacentElement('afterend',btn);
 }
})();
;

/* hisa-fragrance-liquid-view-cart-js */

(function(){
 function openSharedCart(){
  if(typeof window.openCart==='function'){window.openCart();return;}
  const trigger=document.querySelector('[onclick="openCart()"]');
  if(trigger)trigger.click();
 }
 function makeButton(id){
  const btn=document.createElement('button');btn.type='button';btn.id=id;
  btn.className='hisa-view-cart-secondary';btn.textContent='View Cart & Order';
  btn.setAttribute('aria-label','View all added products in cart and proceed to order');
  btn.addEventListener('click',function(e){
   e.preventDefault();e.stopPropagation();
   if(id==='hisaFragViewCartOrder'&&typeof window.backToFragrances==='function')window.backToFragrances();
   setTimeout(openSharedCart,80);
  });
  return btn;
 }
 function enhance(){
  const frag=document.getElementById('fragranceDetail');
  const fragAdd=document.getElementById('hisaFragDetailCart');
  if(frag&&fragAdd&&!document.getElementById('hisaFragViewCartOrder'))fragAdd.insertAdjacentElement('afterend',makeButton('hisaFragViewCartOrder'));
  document.querySelectorAll('#liquidSix .liquid-six-card').forEach((card,i)=>{
   const add=card.querySelector('.liquid-buy-btn');
   if(add&&!card.querySelector('.hisa-view-cart-secondary'))add.insertAdjacentElement('afterend',makeButton('hisaLiquidViewCartOrder'+i));
  });
 }
 enhance();
 const frag=document.getElementById('fragranceDetail');
 if(frag)new MutationObserver(enhance).observe(frag,{childList:true,subtree:true});
 const liquid=document.getElementById('liquidSix');
 if(liquid)new MutationObserver(enhance).observe(liquid,{childList:true,subtree:false});
})();
;

/* hisa-premium-product-detail-ui */

(function(){
'use strict';
function make(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;}
function trust(parent){if(!parent||parent.querySelector('.hisa-premium-trust'))return;var row=make('div','hisa-premium-trust');['🚚 Shipping calculated at checkout','📦 Pack sizes & pricing shown above','💬 Order assistance on WhatsApp'].forEach(function(t){row.appendChild(make('span','',t));});parent.appendChild(row);}
function viewButton(parent){if(!parent||parent.querySelector('.hisa-premium-secondary'))return;var b=make('button','hisa-premium-secondary','View Cart & Order');b.type='button';b.addEventListener('click',function(){if(typeof window.hisaViewCartAndOrder==='function')window.hisaViewCartAndOrder();else{var candidate=document.querySelector('[onclick*="hisaViewCartAndOrder"]');if(candidate)candidate.click();}});parent.appendChild(b);}
function guide(section,category){if(!section||section.querySelector('.hisa-premium-guide'))return;var wrap=make('section','hisa-premium-guide');wrap.setAttribute('aria-label','Product information');var nav=make('div','hisa-premium-tabs');nav.setAttribute('role','tablist');var body=make('div','');var data=[['Description','Browse the product images and select the available pack size and quantity above. Product availability and final order details are confirmed during checkout.'],['Specifications','Category: '+category+'. Batch-specific ingredients, pH, TFM, shelf life and COA are available only when confirmed for the actual product and batch.'],['How to Use','Follow the product-specific instructions and verify suitability for your intended formulation before commercial use.'],['Shipping & Support','Delivery charges depend on order weight and destination PIN code. Review the shipping amount in checkout and contact Hisa Organic on WhatsApp for assistance.']];
 data.forEach(function(item,i){var id='hisa-premium-'+category.replace(/[^a-z]/gi,'').toLowerCase()+'-'+i;var b=make('button','',item[0]);b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-controls',id);b.setAttribute('aria-selected',i===0?'true':'false');var panel=make('div','hisa-premium-panel');panel.id=id;panel.setAttribute('role','tabpanel');panel.hidden=i!==0;panel.appendChild(make('h3','',item[0]));panel.appendChild(make('p','',item[1]));b.addEventListener('click',function(){Array.from(nav.children).forEach(function(t){t.setAttribute('aria-selected',t===b?'true':'false');});Array.from(body.children).forEach(function(p){p.hidden=p!==panel;});});nav.appendChild(b);body.appendChild(panel);});wrap.appendChild(nav);wrap.appendChild(body);section.appendChild(wrap);}
function init(){var soap=document.getElementById('productDetail');if(soap){var info=soap.querySelector('.detail-info');trust(info);var layout=soap.querySelector('.detail-layout');if(layout)guide(layout.parentElement,'Soap Bases');}
var frag=document.getElementById('fragranceDetail');if(frag){var fInfo=frag.querySelector('.detail-info');trust(fInfo);viewButton(fInfo);var fLayout=frag.querySelector('.detail-layout');if(fLayout)guide(fLayout.parentElement,'Fragrances');}
var herbal=document.getElementById('hisaHerbalDetail');if(herbal){var hi=herbal.querySelector('.hhd-info');trust(hi);viewButton(hi);guide(herbal.querySelector('.hhd-wrap'),'Herbal Powders');}
var wax=document.getElementById('hisaWaxDetail');if(wax){var wi=wax.querySelector('.hisa-wax-purchase');trust(wi);viewButton(wi);guide(wax.querySelector('.hisa-wax-shell'),'Waxes');}
var liquid=document.getElementById('hisaLiquidDetail');if(liquid){var li=liquid.querySelector('.hld-panel');trust(li);viewButton(li);guide(li,'Liquid Products');}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
;

/* hisa-transparent-gallery-script */

(function(){
const secondPhoto="./assets/images/soap-base-gallery-multiple-uses.webp";
const thirdPhoto="./assets/images/soap-base-gallery-features.webp";
const fourthPhoto="./assets/images/soap-base-gallery-melt-and-pour.webp";
let originalPhoto="";
window.hisaSelectTransparentImage=function(index){
 const image=document.getElementById('detailImage');if(!image)return;
 image.src=index===3?fourthPhoto:index===2?thirdPhoto:index===1?secondPhoto:originalPhoto;
 image.alt=index===3?'Melt and Pour Soap Process - four step illustrated guide':index===2?'Our Soap Bases Are - features infographic':index===1?'Perfect For Multiple Uses - soap base applications':'Original soap base product photo';
 for(let i=0;i<4;i++){let b=document.getElementById(['hisaGalleryFirst','hisaGallerySecond','hisaGalleryThird','hisaGalleryFourth'][i]);if(b)b.setAttribute('aria-pressed',String(i===index));}
};
const originalOpen=window.openProduct;
if(typeof originalOpen==='function')window.openProduct=function(id){
 const result=originalOpen.apply(this,arguments);
 const gallery=document.getElementById('hisaTransparentGallery');
 const image=document.getElementById('detailImage');
 if(gallery&&image){
  const isSoapBase=!!(window.products && window.products[id]) || !!(typeof products!=="undefined" && products[id]);
  gallery.hidden=!isSoapBase;
  if(isSoapBase){originalPhoto=image.src;document.getElementById('hisaGalleryFirstImg').src=originalPhoto;document.getElementById('hisaGallerySecondImg').src=secondPhoto;document.getElementById('hisaGalleryThirdImg').src=thirdPhoto;document.getElementById('hisaGalleryFourthImg').src=fourthPhoto;window.hisaSelectTransparentImage(0);}
 }
 return result;
};
})();
;

/* hisa-soap-swipe-navigation */

(function(){
  'use strict';
  const image=document.getElementById('detailImage');
  const gallery=document.getElementById('hisaTransparentGallery');
  if(!image||!gallery)return;
  let startX=0,startY=0,startTime=0,tracking=false,swipedAt=0;
  const buttons=['hisaGalleryFirst','hisaGallerySecond','hisaGalleryThird','hisaGalleryFourth'];
  function activeIndex(){
    const idx=buttons.findIndex(id=>document.getElementById(id)?.getAttribute('aria-pressed')==='true');
    return idx<0?0:idx;
  }
  function enabled(){return !gallery.hidden && gallery.getClientRects().length>0 && typeof window.hisaSelectTransparentImage==='function';}
  image.addEventListener('touchstart',function(e){
    if(!enabled()||e.touches.length!==1){tracking=false;return;}
    startX=e.touches[0].clientX;startY=e.touches[0].clientY;startTime=Date.now();tracking=true;
  },{passive:true});
  image.addEventListener('touchend',function(e){
    if(!tracking||!enabled()||e.changedTouches.length!==1)return;
    tracking=false;
    const dx=e.changedTouches[0].clientX-startX;
    const dy=e.changedTouches[0].clientY-startY;
    if(Math.abs(dx)<38||Math.abs(dx)<Math.abs(dy)*1.2||Date.now()-startTime>1400)return;
    const next=(activeIndex()+(dx<0?1:3))%4;
    window.hisaSelectTransparentImage(next);
    document.getElementById(buttons[next])?.scrollIntoView?.({block:'nearest',inline:'nearest',behavior:'instant'});
    swipedAt=Date.now();
  },{passive:true});
  image.addEventListener('touchcancel',()=>{tracking=false;},{passive:true});
  image.addEventListener('dragstart',e=>e.preventDefault());
  image.addEventListener('click',e=>{if(Date.now()-swipedAt<350){e.preventDefault();e.stopPropagation();}},true);
})();
;

/* hisa-cart-two-step-final-js */

(function(){
 'use strict';
 const drawer=document.getElementById('drawer');
 const next=document.getElementById('hisaProceedCheckout');
 const form=document.getElementById('hisaCheckoutStep');
 if(!drawer||!next||!form)return;
 const title=drawer.querySelector('.drawer-top h2');
 const originalTitle=title?title.innerHTML:'';
 const hint=document.createElement('p');
 hint.className='hisa-cart-step-hint';
 hint.textContent='Step 1 of 2 · Review all selected products and total';
 next.parentNode.insertBefore(hint,next);
 function setStage(address){
  if(typeof window.hisaCartStage==='function')window.hisaCartStage(!!address);
  else {drawer.classList.toggle('hisa-checkout-mode',!!address);form.hidden=!address;form.style.display=address?'block':'none';}
  if(title)title.innerHTML=address?'Delivery Address <small style="font-size:12px"> · Step 2 of 2</small>':originalTitle;
  hint.style.display=address?'none':'block';
  drawer.scrollTop=0;
 }
 function showReview(){
  if(typeof window.updateCart==='function')try{window.updateCart()}catch(e){}
  if(typeof window.openCart==='function')window.openCart();
  setStage(false);
 }
 // Every View Cart & Order button must open the cart first, never the address directly.
 window.hisaViewCartAndOrder=showReview;
 // Preserve normal cart opening from all existing category detail screens.
 if(typeof window.openCart==='function'){
  const original=window.openCart;
  window.openCart=function(){const result=original.apply(this,arguments);setStage(false);return result;};
 }
 // Let the existing Continue and Back buttons handle stage changes; update headings after.
 next.addEventListener('click',()=>queueMicrotask(()=>{if(drawer.classList.contains('hisa-checkout-mode'))setStage(true)}));
 const back=document.getElementById('hisaBackToCart');
 if(back)back.addEventListener('click',()=>queueMicrotask(()=>setStage(false)));
 setStage(false);
})();
;

/* hisa-shampoo-three-photo-v2 */

(function(){
const guides={'Transparent Face Wash':['./assets/images/transparent-face-wash-preparation.webp','./assets/images/transparent-face-wash-features.webp'],'Pearly Face Wash':['./assets/images/pearly-face-wash-preparation.webp','./assets/images/pearly-face-wash-features.webp'], 'Transparent Shampoo':['./assets/images/transparent-shampoo-preparation.webp','./assets/images/transparent-shampoo-features.webp'], 'Pearly Shampoo':['./assets/images/pearly-shampoo-preparation.webp','./assets/images/pearly-shampoo-features.webp'] };

// Body Wash: original card photo followed by matching guide and feature photos.
guides['Transparent Body Wash']=['./assets/images/catalog-image-8e99afbe87.webp','./assets/images/catalog-image-b769d24442.webp'];
guides['Pearly Body Wash']=['./assets/images/catalog-image-f8db854857.webp','./assets/images/catalog-image-65d80b3ca5.webp'];
const gal=document.getElementById('hisaShampooGallery');
const main=document.getElementById('hisaShampooMain');
const thumbs=[document.getElementById('hisaShampooThumb1'),document.getElementById('hisaShampooThumb2'),document.getElementById('hisaShampooThumb3')];
let images=[],index=0;
function show(i){if(!images.length)return;index=(i+images.length)%images.length;main.src=images[index];main.alt=(images.length && (window.hisaCurrentLiquidGalleryName||'').includes('Face Wash')?['Original face wash product photo','Face wash preparation guide','Face wash features guide']:(window.hisaCurrentLiquidGalleryName||'').includes('Body Wash')?['Original body wash product photo','Body wash preparation guide','Body wash features guide']:['Original shampoo product photo','Shampoo preparation guide','Shampoo features guide'])[index];gal.querySelectorAll('.hisa-shampoo-thumbs button').forEach((b,j)=>b.classList.toggle('active',index===j));}
window.hisaSetShampooGallery=function(name){window.hisaCurrentLiquidGalleryName=name;if(!Object.prototype.hasOwnProperty.call(guides,name)){gal.hidden=true;return;}const cards=[...document.querySelectorAll('#liquidSix .liquid-six-card')];const card=cards.find(c=>c.querySelector('h3')?.textContent.trim()===name);const first=card?.querySelector('img')?.src||'';images=[first,...guides[name]];thumbs.forEach((img,i)=>{img.src=images[i];});gal.hidden=false;show(0);};
gal.querySelectorAll('.hisa-shampoo-thumbs button').forEach(b=>b.addEventListener('click',()=>show(Number(b.dataset.index))));
let x=0;main.addEventListener('touchstart',e=>{x=e.touches[0].clientX},{passive:true});main.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-x;if(Math.abs(d)>35)show(index+(d<0?1:-1))},{passive:true});
})();
;

/* hisa-fast-mobile-image-v1 */

(function(){
  function tune(){
    document.querySelectorAll('img').forEach(function(img){
      if(!img.hasAttribute('decoding'))img.decoding='async';
      if(!img.hasAttribute('loading')){
        var r=img.getBoundingClientRect();
        if(r.top>innerHeight*1.4)img.loading='lazy';
      }
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tune,{once:true});else tune();
})();
;
