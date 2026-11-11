/* hisa-single-navigation-controller */

/* Preserve exact scroll position for category and product navigation, including mobile back. */
(function(){
'use strict';
let restoring=false, navigating=false, current={type:'home',y:0};
let restoreToken=0, userMoved=false;
const original={};
const getY=()=>Math.max(0,window.scrollY||document.documentElement.scrollTop||0);
function snapshot(){return {...current,y:getY()};}
function store(){try{history.replaceState({...history.state,hisaOneNav:true,screen:snapshot()},'',location.href);}catch(e){}}
function call(name,...args){if(typeof original[name]==='function')return original[name](...args);}
function go(next,fn){
 if(restoring||navigating)return fn();
 navigating=true;
 try{
  store();
  try{history.pushState({hisaOneNav:true,screen:next},'',location.href);}catch(e){}
  current=next;
  return fn();
 }finally{navigating=false;}
}
function restoreScroll(y){
 const target=Math.max(0,Number(y)||0), token=++restoreToken;
 userMoved=false;
 const apply=()=>{
  if(token!==restoreToken||userMoved)return;
  // Mobile images and product cards can alter document height after rendering.
  // Retry without smooth scrolling to avoid visible jumps.
  const max=Math.max(0,document.documentElement.scrollHeight-innerHeight);
  window.scrollTo(0,Math.min(target,max));
 };
 // Restore promptly; only a few retries for late image/layout changes.
 apply();
 requestAnimationFrame(()=>requestAnimationFrame(apply));
 [100,350,800].forEach(ms=>setTimeout(apply,ms));
}

function show(s){
 if(!s)return;
 restoring=true;
 try{
  if(s.type==='home')call('showHome');
  else if(s.type==='category')call('showCategory',s.kind);
  else if(s.type==='product'){call('showCategory','soap');call('openProduct',s.id);}
  else if(s.type==='fragrance'){call('showCategory','fragrance');call('openFragrance',s.id);}
  else if(s.type==='liquidGroup'){call('showCategory','liquid');call('hisaOpenLiquidGroup',s.group);}
  else if(s.type==='cart'){show(s.parent||{type:'home',y:0});call('openCart');}
  if(s.type!=='cart')call('closeCart');
  current={...s};
  restoreScroll(s.y);
 }finally{setTimeout(()=>{restoring=false;},400);}
}
function wrap(name,make){
 const fn=window[name];if(typeof fn!=='function')return;
 original[name]=fn;
 window[name]=function(...args){return go(make(args),()=>fn.apply(this,args));};
}
function install(){
 try{history.scrollRestoration='manual';}catch(e){}
 wrap('showCategory',a=>({type:'category',kind:a[0],y:0}));
 wrap('openProduct',a=>({type:'product',id:a[0],y:0}));
 wrap('openFragrance',a=>({type:'fragrance',id:a[0],y:0}));
 wrap('showHome',()=>({type:'home',y:0}));
 wrap('openCart',()=>({type:'cart',parent:snapshot(),y:getY()}));
 if(typeof window.closeCart==='function'){
  original.closeCart=window.closeCart;
  window.closeCart=function(...args){
   if(!restoring&&current.type==='cart'&&history.state?.hisaOneNav){history.back();return;}
   return original.closeCart.apply(this,args);
  };
 }
 window.backToProducts=function(){
  if(current.type==='product'&&history.state?.hisaOneNav)history.back();
  else show({type:'category',kind:'soap',y:0});
 };
 window.backToFragrances=function(){
  if(current.type==='fragrance'&&history.state?.hisaOneNav)history.back();
  else show({type:'category',kind:'fragrance',y:0});
 };
 function liquid(){
  if(window.hisaOpenLiquidGroup&&!window.hisaOpenLiquidGroup.__hisaWrapped){
   wrap('hisaOpenLiquidGroup',a=>({type:'liquidGroup',group:a[0],y:0}));
   window.hisaOpenLiquidGroup.__hisaWrapped=true;
  }
 }
 liquid();setTimeout(liquid,0);
 const existing=history.state?.hisaOneNav&&history.state.screen;
 if(existing){current={...existing};restoreScroll(current.y);}
 else{try{history.replaceState({...history.state,hisaOneNav:true,screen:current},'',location.href);}catch(e){}}
 window.addEventListener('popstate',e=>{
  if(e.state?.hisaOneNav&&e.state.screen)show(e.state.screen);
 });
 let tick;
 window.addEventListener('scroll',()=>{
  if(restoring||navigating)return;
  clearTimeout(tick);
  tick=setTimeout(()=>{current.y=getY();store();},220);
 },{passive:true});
 // On mobile, do not override a deliberate finger scroll during restoration.
 window.addEventListener('touchstart',()=>{userMoved=true;},{passive:true});
 window.addEventListener('wheel',()=>{userMoved=true;},{passive:true});
 window.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End'].includes(e.key))userMoved=true;});
 window.addEventListener('pagehide',store);
 window.addEventListener('pageshow',e=>{if(e.persisted&&history.state?.screen)show(history.state.screen);});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
;

(function(){
const descriptions={
'Transparent Shampoo':'A clear, ready-to-customize shampoo base with a clean, transparent appearance. Designed for makers creating transparent shampoo products. Suitable for adding compatible fragrance and colour after small-batch compatibility testing. Its clear look is ideal for showcasing a simple, modern shampoo range.',
'Pearly Shampoo':'A creamy, milky-looking shampoo base with an attractive pearly appearance. Ideal for creating classic opaque shampoo products with a smooth, premium presentation. Makers can develop their own shampoo range using compatible fragrance and approved cosmetic additives.',
'Transparent Face Wash':'A transparent face wash base developed for makers who prefer a clean, clear gel-style product appearance. A versatile starting point for a fresh-looking facial cleanser range, with room for compatible fragrance, colour and other cosmetic additions after stability testing.',
'Pearly Face Wash':'A soft-looking, milky face wash base with a creamy, opaque presentation. Suitable for developing a premium-looking daily facial cleansing product. Its white pearly appearance gives finished formulations a neat, elegant look.',
'Transparent Body Wash':'A clear body wash base with a transparent finish, suitable for creating visually attractive shower and bath cleansing products. Its clear appearance works well for fresh, colourful product concepts using compatible cosmetic-grade additives.',
'Pearly Body Wash':'A rich-looking, milky body wash base with a smooth, opaque appearance. A versatile choice for makers creating creamy shower gel and body wash products with a premium shelf presentation. Compatible additions should be checked in a small test batch.'
};
const modal=document.getElementById('hisaLiquidDetail'), qty=document.getElementById('hldQty');let selected='';
const rate=q=>q>=50?110:q>=10?115:120;
function refresh(){const q=Math.max(1,Math.floor(Number(qty.value)||1));document.getElementById('hldTotal').textContent='₹'+rate(q)+'/kg × '+q+' kg = ₹'+(rate(q)*q).toLocaleString('en-IN');modal.querySelectorAll('.hld-tier').forEach(b=>b.classList.toggle('active',Number(b.dataset.qty)===q));}
function open(name){selected=name;if(window.hisaSetShampooGallery)window.hisaSetShampooGallery(name);document.getElementById('hldName').textContent=name;document.getElementById('hldDescription').textContent=descriptions[name]||'';qty.value=1;refresh();modal.classList.add('open');document.body.style.overflow='hidden';}
function close(){modal.classList.remove('open');document.body.style.overflow='';}
document.getElementById('liquidSix').addEventListener('click',function(e){const card=e.target.closest('.liquid-six-card');if(!card||e.target.closest('button,input,a'))return;const name=card.querySelector('h3')?.textContent.trim();if(descriptions[name])open(name);});
modal.querySelector('.hld-close').onclick=close;modal.addEventListener('click',e=>{if(e.target===modal)close()});
modal.querySelectorAll('.hld-tier').forEach(b=>b.addEventListener('click',()=>{qty.value=b.dataset.qty;refresh()}));
document.getElementById('hldMinus').onclick=()=>{qty.value=Math.max(1,(Number(qty.value)||1)-1);refresh()};
document.getElementById('hldPlus').onclick=()=>{qty.value=Math.max(1,(Number(qty.value)||0)+1);refresh()};qty.addEventListener('input',refresh);
document.getElementById('hldAdd').onclick=()=>{const q=Math.max(1,Math.floor(Number(qty.value)||1));close();if(typeof addLiquid==='function')addLiquid(selected,q);};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))close()});
})();
;

/* hisa-saved-addresses-v1 */

(function(){
'use strict';
const KEY='hisa_organic_saved_addresses_v1',SELECTED='hisa_organic_selected_address_v1',LAST='hisa_organic_last_order_address_v1';
const fields=['customer','mobile','address','pin','hisaShipZone'];
const el=id=>document.getElementById(id);
function getAddresses(){try{let a=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(a)?a.filter(x=>x&&typeof x==='object').slice(0,30):[]}catch(e){return []}}
function saveAddresses(a){try{localStorage.setItem(KEY,JSON.stringify(a));return true}catch(e){alert('Browser storage is unavailable. Address may not be remembered next time.');return false}}
function values(){return Object.fromEntries(fields.map(id=>[id,(el(id)?.value||'').trim()]))}
function setFields(a){fields.forEach(id=>{if(el(id))el(id).value=a[id]||''});el('hisaShipZone')?.dispatchEvent(new Event('change',{bubbles:true}))}
function chosen(){try{return localStorage.getItem(SELECTED)||''}catch(e){return ''}}
function choose(id){try{localStorage.setItem(SELECTED,id)}catch(e){};let a=getAddresses().find(x=>x.id===id);if(a)setFields(a);showAddressFields(false);render()}
function showAddressFields(show){el('hisaCheckoutStep')?.classList.toggle('hisa-address-editing',!!show);let n=el('hisa-address-mode');if(n)n.textContent=show?'Enter or edit delivery address':'Deliver to selected saved address';}
function clearForm(){fields.forEach(id=>{if(el(id))el(id).value=''});try{localStorage.removeItem(SELECTED)}catch(e){};showAddressFields(true);render();el('customer')?.focus()}
function render(){const root=el('hisa-address-book');if(!root)return;root.replaceChildren();let h=document.createElement('h3');h.textContent='Saved Delivery Addresses';root.append(h);let a=getAddresses();if(!a.length){let p=document.createElement('p');p.textContent='First order: enter your address below. It will be saved on this device when you place your order.';p.className='hisa-address-help';root.append(p)}else{let p=document.createElement('p');p.className='hisa-address-help';p.textContent='Choose an address to automatically fill the checkout form.';root.append(p);a.sort((x,y)=>Number(y.id===chosen())-Number(x.id===chosen()));a.forEach((item,i)=>{let card=document.createElement('div');card.className='hisa-address-card';let radio=document.createElement('input');radio.type='radio';radio.name='hisaSavedAddress';radio.checked=chosen()===item.id;radio.setAttribute('aria-label','Select address '+(i+1));radio.addEventListener('change',()=>choose(item.id));let info=document.createElement('div');info.className='hisa-address-info';let b=document.createElement('strong');b.textContent=(item.label||'Address '+(i+1))+' · '+(item.customer||'');let details=document.createElement('div');details.textContent=[item.address,item.pin,item.mobile].filter(Boolean).join(' · ');info.append(b,details);let actions=document.createElement('div');actions.className='hisa-address-actions';let edit=document.createElement('button');edit.type='button';edit.textContent='Edit';edit.onclick=()=>{choose(item.id);showAddressFields(true);el('address')?.focus()};let del=document.createElement('button');del.type='button';del.textContent='Delete';del.onclick=()=>{if(!confirm('Delete this saved address?'))return;saveAddresses(getAddresses().filter(x=>x.id!==item.id));if(chosen()===item.id){try{localStorage.removeItem(SELECTED)}catch(e){}}render()};actions.append(edit,del);card.append(radio,info,actions);card.addEventListener('click',e=>{if(e.target===card||e.target===info||e.target===details||e.target===b)choose(item.id)});root.append(card)})}let add=document.createElement('button');add.id='hisa-new-address';add.type='button';add.textContent='+ Add New Delivery Address';add.onclick=clearForm;root.append(add);let foot=document.createElement('p');foot.className='hisa-address-help';foot.textContent='Saved only in this browser on this device. Clearing browser data, using private mode or another phone may remove saved addresses.';root.append(foot)}
function init(){const form=el('customer')?.closest('form');if(!form||el('hisa-address-book'))return;let root=document.createElement('section');root.id='hisa-address-book';form.insertBefore(root,form.firstChild);render();let a=getAddresses(),last='';try{last=localStorage.getItem(LAST)||''}catch(e){};let sel=a.find(x=>x.id===last)||a.find(x=>x.id===chosen())||a[0];if(sel)choose(sel.id);else showAddressFields(true);

// Last used address is selected on the next checkout, not during shopping.
const proceed=el('hisaProceedCheckout');
if(proceed)proceed.addEventListener('click',()=>{let a=getAddresses();let id=chosen();let selected=a.find(x=>x.id===id);if(selected){setFields(selected);showAddressFields(false);render()}else if(!a.length){showAddressFields(true)}},false);

// Save only on a valid checkout submit; existing WhatsApp handler still builds the order from these fields.
form.addEventListener('submit',function(){let v=values();if(!v.customer||!/^\d{10}$/.test(v.mobile)||!v.address||!/^\d{6}$/.test(v.pin)||!v.hisaShipZone)return;let all=getAddresses(),id=chosen();let index=all.findIndex(x=>x.id===id);if(index<0){index=all.findIndex(x=>x.address.toLowerCase()===v.address.toLowerCase()&&x.pin===v.pin&&x.mobile===v.mobile)}if(index>=0){all[index]={...all[index],...v};id=all[index].id}else{id='addr_'+Date.now()+'_'+Math.random().toString(36).slice(2,7);all.push({...v,id,label:'Address '+(all.length+1)})}if(saveAddresses(all)){try{localStorage.setItem(SELECTED,id);localStorage.setItem(LAST,id)}catch(e){}}render()},true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
;

(function(){
const descriptions={
'White Bees Wax — Grade AA':'White Bees Wax Grade AA is a refined, light-coloured beeswax option for candle making, wax blends and suitable craft formulations. Its smooth, pale appearance is useful when a clean white finish is desired. Check the technical specification and suitability for your intended application before use.',
'Yellow Bees Wax — Grade AA':'Yellow Bees Wax Grade AA has a warm golden-yellow appearance that suits traditional-style candles, wax crafts and compatible blends. Its natural-looking colour gives finished creations a classic wax aesthetic. Confirm the grade, purity and technical details for your application.',
'White Candle Wax Cube — Grade AA':'White Candle Wax Cube Grade AA comes in convenient cube-shaped pieces for measuring, portioning and melting during candle-making trials and production. The light-coloured cubes are practical for creating custom candle blends and designs. Melting behaviour depends on the supplied grade and formulation.',
'Raw Wax — Grade A':'Raw Wax Grade A is offered in a less-processed, rustic-looking form for customers developing wax crafts and compatible formulations. Its texture and colour may vary by batch. Ask for the source, composition and quality specifications before choosing it for a particular use.',
'Soy Wax':'Soy Wax is a plant-derived wax option popular for container candles and decorative candle projects. It is often selected for its smooth, creamy appearance and compatibility with suitable fragrance and dye systems. Actual performance depends on the specific soy-wax grade and candle formula.',
'Paraffin Wax':'Paraffin Wax is a versatile petroleum-derived wax commonly used in candle manufacturing, wax blends and decorative wax products. It can support different candle styles depending on the supplied grade and melting point. Please confirm technical specifications and intended-use suitability before purchase.'
};
const HISA_WAX_PRICES={'White Bees Wax — Grade AA': [170, 250], 'Yellow Bees Wax — Grade AA': [170, 250], 'White Candle Wax Cube — Grade AA': [150, 220], 'Raw Wax — Grade A': [130, 190], 'Soy Wax': [130, 190], 'Paraffin Wax': [140, 220]};
let waxPack='500 g';
function waxUnit(name,pack){return HISA_WAX_PRICES[name]?.[pack==='500 g'?0:1]||0}
function waxRefresh(){const unit=waxUnit(active,waxPack),q=Math.max(1,Math.floor(Number(document.getElementById('hisaWaxQtyDetail').value)||1));document.querySelectorAll('#hisaWaxPackChoices button').forEach(b=>{b.classList.toggle('selected',b.dataset.pack===waxPack);b.setAttribute('aria-pressed',String(b.dataset.pack===waxPack));b.textContent=b.dataset.pack+' — ₹'+waxUnit(active,b.dataset.pack)});document.getElementById('hisaWaxSelectedTotal').textContent='Product Total: ₹'+(unit*q).toLocaleString('en-IN')+' · Shipping extra'}
let active=null,previousScroll=0;
const panel=document.getElementById('hisaWaxDetail'),qty=document.getElementById('hisaWaxQtyDetail');
function close(){panel.classList.remove('open');document.body.style.overflow='';active=null;requestAnimationFrame(()=>window.scrollTo(0,previousScroll))}
function open(name,card){if(!descriptions[name])return;previousScroll=window.scrollY;active=name;document.getElementById('hisaWaxName').textContent=name;document.getElementById('hisaWaxDescription').textContent=descriptions[name];let img=card.querySelector('img');let photo=document.getElementById('hisaWaxPhoto');if(img){photo.src=img.src;photo.style.display='block';photo.alt=name+' product photo'}else{photo.removeAttribute('src');photo.style.display='none'}qty.value=1;waxPack='500 g';waxRefresh();panel.classList.add('open');panel.scrollTop=0;document.body.style.overflow='hidden';try{history.pushState({hisaWaxDetail:true,name:name},'',location.href)}catch(e){}
}
function goBack(){if(!active)return;if(history.state&&history.state.hisaWaxDetail){history.back()}else close()}
document.addEventListener('click',function(e){if(panel.contains(e.target))return;const card=e.target.closest('.hisa-extra-card');if(!card||!card.closest('#hisaExtraProducts'))return;const name=card.querySelector('h3')?.textContent?.trim();if(!descriptions[name])return;if(e.target.closest('button,input,select'))return;e.preventDefault();open(name,card)},true);
document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.matches('#hisaExtraProducts .hisa-wax-clickable')){e.preventDefault();open(e.target.querySelector('h3')?.textContent?.trim(),e.target)}if(e.key==='Escape'&&active)goBack()});
const obs=new MutationObserver(()=>{document.querySelectorAll('#hisaExtraProducts .hisa-extra-card').forEach(c=>{const n=c.querySelector('h3')?.textContent?.trim();if(descriptions[n]){const cost=HISA_WAX_PRICES[n];if(cost&&!c.querySelector('.hisa-wax-list-price')){const p=document.createElement('div');p.className='hisa-wax-list-price';p.textContent='500 g ₹'+cost[0]+'  •  1 kg ₹'+cost[1];c.querySelector('h3')?.insertAdjacentElement('afterend',p)}c.querySelectorAll('button').forEach(b=>{if(b.textContent.trim()==='Add to Cart')b.style.display='none'});c.classList.add('hisa-wax-clickable');c.setAttribute('tabindex','0');c.setAttribute('role','button');c.setAttribute('aria-label','Open '+n+' details')}})});const root=document.getElementById('hisaExtraProducts');if(root){obs.observe(root,{childList:true});}
window.addEventListener('popstate',function(){if(active)close()});
document.getElementById('hisaWaxBack').onclick=goBack;
document.getElementById('hisaWaxMinus').onclick=()=>{qty.value=Math.max(1,(parseInt(qty.value)||1)-1);waxRefresh()};
document.getElementById('hisaWaxPlus').onclick=()=>{qty.value=Math.min(9999,(parseInt(qty.value)||1)+1);waxRefresh()};
document.getElementById('hisaWaxPackChoices').addEventListener('click',e=>{const b=e.target.closest('button[data-pack]');if(!b)return;waxPack=b.dataset.pack;waxRefresh()});
qty.addEventListener('input',waxRefresh);
document.getElementById('hisaWaxAdd').onclick=function(){if(!active)return;const n=active,q=Math.max(1,Math.min(9999,parseInt(qty.value)||1)),key='wax|'+n+'|'+waxPack+'|'+waxUnit(n,waxPack);hisaQuoteCart[key]=(hisaQuoteCart[key]||0)+q;hisaSaveQuote();goBack();setTimeout(()=>{updateCart();hisaAddedToast()},80)};
})();
;

/* hisa-pin-auto-shipping */

(function(){'use strict';
let seq=0,timer=0,validated='';
function setup(){const pin=document.getElementById('pin'),zone=document.getElementById('hisaShipZone');if(!pin||!zone||pin.dataset.autoBound)return;pin.dataset.autoBound='1';
const label=zone.closest('label');if(label){label.style.display='none';label.removeAttribute('required');}
const wrap=document.createElement('div');wrap.innerHTML='<div id="hisaPinAutoStatus" role="status" aria-live="polite">Enter your 6-digit PIN code to calculate shipping automatically.</div><div id="hisaPinManualFallback"><label>PIN lookup unavailable. Choose delivery region to continue:<select id="hisaPinManualZone"><option value="">Select region</option><option value="mh">Maharashtra</option><option value="other">Other state</option></select></label></div>';pin.closest('label').insertAdjacentElement('afterend',wrap);
const status=wrap.querySelector('#hisaPinAutoStatus'),fallback=wrap.querySelector('#hisaPinManualFallback'),manual=wrap.querySelector('#hisaPinManualZone');
function setZone(v){zone.value=v;zone.dispatchEvent(new Event('change',{bubbles:true}));}
function showFallback(message){setZone('');status.textContent=message;status.dataset.error='true';fallback.classList.add('show');manual.value='';}
manual.addEventListener('change',()=>{setZone(manual.value);if(manual.value){status.textContent='Delivery region selected manually. Shipping will use this region.';status.dataset.error='false';}});
async function lookup(){const code=pin.value.trim(),current=++seq;validated='';setZone('');fallback.classList.remove('show');status.dataset.error='false';if(!/^\d{6}$/.test(code)){status.textContent='Enter your 6-digit PIN code to calculate shipping automatically.';return;}status.textContent='Checking delivery PIN code…';
try{const ctl=new AbortController(),timeout=setTimeout(()=>ctl.abort(),7000);let response;try{response=await fetch('https://api.postalpincode.in/pincode/'+encodeURIComponent(code),{signal:ctl.signal});}finally{clearTimeout(timeout);}if(!response.ok)throw Error('Service unavailable');const data=await response.json();if(current!==seq||pin.value.trim()!==code)return;const post=data?.[0]?.PostOffice;if(data?.[0]?.Status!=='Success'||!Array.isArray(post)||!post.length){showFallback('PIN code not found. Check the PIN or select delivery region.');return;}const state=String(post[0].State||'').trim();if(!state){showFallback('Could not identify the state. Select delivery region.');return;}validated=code;setZone(state.toLowerCase()==='maharashtra'?'mh':'other');status.textContent='✓ '+(post[0].District||'')+', '+state+' — Shipping region selected automatically.';status.dataset.error='false';}catch(e){if(current!==seq)return;showFallback('PIN lookup needs internet access. Please select the delivery region below.');}}
pin.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(lookup,420)});pin.addEventListener('change',lookup);
// Saved addresses can populate PIN programmatically; re-check whenever checkout opens.
const observer=new MutationObserver(()=>{if(pin.value.trim()!==validated&&/^\d{6}$/.test(pin.value.trim())&&pin.value.trim()!==pin.dataset.lastChecked){pin.dataset.lastChecked=pin.value.trim();clearTimeout(timer);timer=setTimeout(lookup,500);}});observer.observe(pin,{attributes:true,attributeFilter:['value']});
document.addEventListener('click',e=>{if(e.target.closest('[onclick*="openCart"], .cart-button, [onclick*="checkout"]'))setTimeout(()=>{if(/^\d{6}$/.test(pin.value.trim())&&pin.value.trim()!==validated)lookup()},250)},true);
if(/^\d{6}$/.test(pin.value.trim()))lookup();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
;

/* hisa-herbal-detail-script */

(function(){
const HISA_HERBAL_PRODUCT_DESCRIPTIONS={"AMLA":"Amla Powder is a finely milled botanical powder derived from Indian gooseberry fruit. Ideal for hair masks, herbal shampoos and scalp-care blends. Use in cosmetic formulations after checking suitability and stability.","ARITHA":"Aritha Powder is a finely milled botanical powder derived from soapnut fruit shells, traditionally valued for their natural saponins. Ideal for herbal shampoos and traditional hair-cleansing blends. Use in cosmetic formulations after checking suitability and stability.","ANAR":"Anar Powder is a finely milled botanical powder derived from pomegranate-derived botanical material. Ideal for face packs, exfoliating blends and handmade soaps. Use in cosmetic formulations after checking suitability and stability.","AMBA HALDI":"Amba Haldi Powder is a finely milled botanical powder derived from mango ginger rhizome. Ideal for ubtan, body masks and herbal soaps. Use in cosmetic formulations after checking suitability and stability.","ALOEVERA":"Aloevera Powder is a finely milled botanical powder derived from aloe vera plant material. Ideal for face packs, soaps and skincare blends. Use in cosmetic formulations after checking suitability and stability.","BRAHMI":"Brahmi Powder is a finely milled botanical powder derived from brahmi herb. Ideal for hair masks, shampoos and scalp-care blends. Use in cosmetic formulations after checking suitability and stability.","BHRINGRAJ":"Bhringraj Powder is a finely milled botanical powder derived from bhringraj leaves. Ideal for hair packs, herbal shampoos and scalp-care blends. Use in cosmetic formulations after checking suitability and stability.","BEETROOT":"Beetroot Powder is a finely milled botanical powder derived from beetroot root. Ideal for face masks and naturally tinted soap designs. Use in cosmetic formulations after checking suitability and stability.","CHARCOAL":"Charcoal Powder is a fine black cosmetic ingredient. Ideal for cleansing soaps, face masks and scrubs. Use in cosmetic formulations after checking suitability and stability.","CURRY LEAVES":"Curry Leaves Powder is a finely milled botanical powder derived from curry leaves. Ideal for hair packs, shampoos and scalp-care blends. Use in cosmetic formulations after checking suitability and stability.","HIBISCUS":"Hibiscus Powder is a finely milled botanical powder derived from hibiscus flower material. Ideal for hair masks, shampoos and botanical soaps. Use in cosmetic formulations after checking suitability and stability.","KESAR CHANDAN":"Kesar Chandan Powder is a finely milled botanical powder derived from a saffron-and-sandalwood-style botanical blend. Ideal for ubtan, face packs and premium soap blends. Use in cosmetic formulations after checking suitability and stability.","MULTANI":"Multani Powder is a finely milled botanical powder derived from multani mitti, a naturally occurring mineral clay. Ideal for face packs, body masks and cleansing blends. Use in cosmetic formulations after checking suitability and stability.","MULETHI":"Mulethi Powder is a finely milled botanical powder derived from licorice root. Ideal for face packs, ubtan and skincare blends. Use in cosmetic formulations after checking suitability and stability.","MANJESTHA":"Manjestha Powder is a finely milled botanical powder derived from manjistha root. Ideal for face masks, ubtan and herbal soaps. Use in cosmetic formulations after checking suitability and stability.","MORINGA":"Moringa Powder is a finely milled botanical powder derived from moringa leaf. Ideal for face masks, soaps and hair-care blends. Use in cosmetic formulations after checking suitability and stability.","MULTANI (WHITE)":"Multani (White) Powder is a finely milled botanical powder derived from light-coloured mineral clay. Ideal for face packs, body masks and gentle cleansing blends. Use in cosmetic formulations after checking suitability and stability.","NEEM":"Neem Powder is a finely milled botanical powder derived from neem leaf. Ideal for cleansing soaps, face packs and herbal shampoos. Use in cosmetic formulations after checking suitability and stability.","ORANGE":"Orange Powder is a finely milled botanical powder derived from orange peel. Ideal for face packs, exfoliating scrubs and soaps. Use in cosmetic formulations after checking suitability and stability.","ROSE":"Rose Powder is a finely milled botanical powder derived from rose petals. Ideal for face packs, botanical soaps and skincare blends. Use in cosmetic formulations after checking suitability and stability.","RED SANDALWOOD":"Red Sandalwood Powder is a finely milled botanical powder derived from red sandalwood botanical material. Ideal for face packs, ubtan and herbal soaps. Use in cosmetic formulations after checking suitability and stability.","SANDALWOOD":"Sandalwood Powder is a finely milled botanical powder derived from sandalwood botanical material. Ideal for face packs, ubtan and handmade soaps. Use in cosmetic formulations after checking suitability and stability.","SHIKAKAI":"Shikakai Powder is a finely milled botanical powder derived from shikakai pods. Ideal for herbal shampoos and traditional hair washes. Use in cosmetic formulations after checking suitability and stability.","TULSI":"Tulsi Powder is a finely milled botanical powder derived from tulsi leaves. Ideal for cleansing soaps, face packs and scalp-care blends. Use in cosmetic formulations after checking suitability and stability.","ROYAL UBTAN":"Royal Ubtan is a traditional botanical powder blend. Ideal for face packs, body masks and traditional ubtan routines. Use in cosmetic formulations after checking suitability and stability."};
const HISA_HERBAL_PRICES={"AMLA": [30, 200], "ARITHA": [35, 210], "ANAR": [25, 130], "AMBA HALDI": [40, 310], "ALOEVERA": [25, 130], "BRAHMI": [25, 130], "BHRINGRAJ": [25, 130], "BEETROOT": [45, 300], "CHARCOAL": [80, 550], "CURRY LEAVES": [35, 200], "KESAR CHANDAN": [45, 350], "MULTANI": [20, 50], "MULETHI": [45, 335], "MANJESTHA": [50, 400], "MORINGA": [40, 320], "MULTANI (WHITE)": [20, 50], "NEEM": [25, 130], "ORANGE": [30, 150], "ROSE": [50, 400], "RED SANDALWOOD": [60, 450], "SANDALWOOD": [50, 400], "SHIKAKAI": [35, 250], "TULSI": [30, 200], "ROYAL UBTAN": [40, 300]};
let selectedName='',selectedPack='100 g',returnY=0;
const detail=document.getElementById('hisaHerbalDetail');
window.hisaHerbalSelectPack=function(pack,btn){selectedPack=pack;detail.querySelectorAll('.hhd-packs button').forEach(b=>{b.classList.toggle('selected',b===btn);b.setAttribute('aria-pressed',String(b===btn))});const pair=HISA_HERBAL_PRICES[selectedName];document.getElementById('hhdPrice').innerHTML=pair?'<strong>Price: ₹'+(pack==='100 g'?pair[0]:pair[1])+' / pack</strong>':'<strong>Price:</strong> Coming Soon · Final price confirmed on WhatsApp';};
window.hisaHerbalQty=function(delta){let input=document.getElementById('hhdQuantity');input.value=Math.max(1,(parseInt(input.value,10)||1)+delta)};
function hide(){detail.classList.remove('is-open');document.body.style.overflow='';requestAnimationFrame(()=>window.scrollTo(0,returnY))}
window.hisaHerbalBack=function(){if(history.state?.hisaHerbalDetail){history.back()}else hide()};
window.hisaOpenHerbalDetail=function(index,skipHistory){const name=window.hisaCollections?.herbal?.[index] || (typeof hisaCollections!=='undefined'?hisaCollections.herbal[index]:null);if(!name)return;
 if(!detail.classList.contains('is-open'))returnY=window.scrollY;
 selectedName=name;selectedPack='100 g';document.getElementById('hhdTitle').textContent=name+' Powder';
 document.getElementById('hhdPhoto').src=HISA_HERBAL_POUCH_PHOTOS[name];document.getElementById('hhdPhoto').alt=name+' herbal powder pouch';
 document.getElementById('hhdDesc').textContent=HISA_HERBAL_PRODUCT_DESCRIPTIONS[name] || 'Please contact Hisa Organic for product specifications and suitable cosmetic applications.';
 document.getElementById('hhdQuantity').value=1;
 const first=detail.querySelector('.hhd-packs button');hisaHerbalSelectPack('100 g',first);
 if(!skipHistory){try{history.pushState({hisaHerbalDetail:true,index:index},'',location.href)}catch(e){}}
 detail.classList.add('is-open');document.body.style.overflow='hidden';detail.scrollTop=0;
};
window.hisaHerbalDetailAdd=function(){let qty=Math.max(1,parseInt(document.getElementById('hhdQuantity').value,10)||1);hide();hisaQuoteAdd('herbal',selectedName+' Powder|'+selectedPack+'|'+(HISA_HERBAL_PRICES[selectedName]?(selectedPack==='100 g'?HISA_HERBAL_PRICES[selectedName][0]:HISA_HERBAL_PRICES[selectedName][1]):''),qty)};
const root=document.getElementById('hisaExtraProducts');
root?.addEventListener('click',function(e){let card=e.target.closest('.hisa-extra-card');if(!card||!card.querySelector('.hisa-herbal-photo'))return;if(e.target.closest('button,input'))return;let index=Array.prototype.indexOf.call(card.parentNode.children,card);hisaOpenHerbalDetail(index)});
root?.addEventListener('keydown',function(e){if(e.key!=='Enter'&&e.key!==' ')return;let card=e.target.closest('.hisa-extra-card');if(!card||!card.querySelector('.hisa-herbal-photo'))return;e.preventDefault();let index=Array.prototype.indexOf.call(card.parentNode.children,card);hisaOpenHerbalDetail(index)});
const observer=new MutationObserver(()=>{root?.querySelectorAll('.hisa-extra-card:has(.hisa-herbal-photo)').forEach(card=>{card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label','View '+card.querySelector('h3')?.textContent+' details')})});if(root){observer.observe(root,{childList:true});}
window.addEventListener('popstate',e=>{if(e.state?.hisaHerbalDetail){hisaOpenHerbalDetail(e.state.index,true)}else if(detail.classList.contains('is-open'))hide()});
})();
;

function hisaToggleMenu(force){const p=document.getElementById('hisa-menu-panel'),b=document.getElementById('hisa-menu-toggle');if(!p||!b)return;const open=typeof force==='boolean'?force:p.hidden;p.hidden=!open;b.setAttribute('aria-expanded',String(open));}
function hisaMenuHome(){hisaToggleMenu(false);if(typeof showHome==='function')showHome();window.scrollTo({top:0,behavior:'smooth'});}
function hisaMenuCategory(type){hisaToggleMenu(false);const cards=document.querySelectorAll('#categories .category-card');const types=['soap','fragrance','liquid','cream','herbal','wax'];const i=types.indexOf(type);if(i<0)return;if(typeof showHome==='function')showHome();if(cards[i])cards[i].click();else if(typeof showCategory==='function')showCategory(type);}
document.addEventListener('click',function(e){if(!e.target.closest('.hisa-menu-wrap'))hisaToggleMenu(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')hisaToggleMenu(false)});
;
