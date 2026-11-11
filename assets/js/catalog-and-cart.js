/* Shared cart for all six collections. Unpriced products are quote requests. */
const hisaQuoteCart = (()=>{try{return JSON.parse(localStorage.getItem('hisa_all_category_quote_cart')||'{}')}catch(e){return {}}})();
const HISA_WHITE_CANDLE_IMG='./assets/images/hisa-white-candle-img.webp';
const HISA_YELLOW_BEES_IMG='./assets/images/hisa-yellow-bees-img.webp';
const HISA_RAW_WAX_IMG='./assets/images/hisa-raw-wax-img.webp';
const HISA_SOY_WAX_IMG='./assets/images/hisa-soy-wax-img.webp';
const HISA_PARAFFIN_IMG='./assets/images/hisa-paraffin-img.webp';
const HISA_HERBAL_POUCH_PHOTOS={"AMLA":"./assets/images/herbal-powder-amla.webp","ARITHA":"./assets/images/herbal-powder-aritha.webp","ANAR":"./assets/images/herbal-powder-anar.webp","AMBA HALDI":"./assets/images/herbal-powder-amba-haldi.webp","ALOEVERA":"./assets/images/herbal-powder-aloevera.webp","BRAHMI":"./assets/images/herbal-powder-brahmi.webp","BHRINGRAJ":"./assets/images/herbal-powder-bhringraj.webp","BEETROOT":"./assets/images/herbal-powder-beetroot.webp","CHARCOAL":"./assets/images/herbal-powder-charcoal.webp","CURRY LEAVES":"./assets/images/herbal-powder-curry-leaves.webp","HIBISCUS":"./assets/images/herbal-powder-hibiscus.webp","KESAR CHANDAN":"./assets/images/herbal-powder-kesar-chandan.webp","MULTANI":"./assets/images/herbal-powder-multani.webp","MULETHI":"./assets/images/herbal-powder-mulethi.webp","MANJESTHA":"./assets/images/herbal-powder-manjestha.webp","MORINGA":"./assets/images/herbal-powder-moringa.webp","MULTANI (WHITE)":"./assets/images/herbal-powder-multani-white.webp","NEEM":"./assets/images/herbal-powder-neem.webp","ORANGE":"./assets/images/herbal-powder-orange.webp","ROSE":"./assets/images/herbal-powder-rose.webp","RED SANDALWOOD":"./assets/images/herbal-powder-red-sandalwood.webp","SANDALWOOD":"./assets/images/herbal-powder-sandalwood.webp","SHIKAKAI":"./assets/images/herbal-powder-shikakai.webp","TULSI":"./assets/images/herbal-powder-tulsi.webp","ROYAL UBTAN":"./assets/images/herbal-powder-royal-ubtan.webp"};
const hisaCollections={
 cream:['Face Cream','Body Cream','Body Lotion','Hand Lotion'],
 herbal:['AMLA','ARITHA','ANAR','AMBA HALDI','ALOEVERA','BRAHMI','BHRINGRAJ','BEETROOT','CHARCOAL','CURRY LEAVES','HIBISCUS','KESAR CHANDAN','MULTANI','MULETHI','MANJESTHA','MORINGA','MULTANI (WHITE)','NEEM','ORANGE','ROSE','RED SANDALWOOD','SANDALWOOD','SHIKAKAI','TULSI','ROYAL UBTAN'],
 wax:['White Bees Wax — Grade AA','Yellow Bees Wax — Grade AA','White Candle Wax Cube — Grade AA','Raw Wax — Grade A','Soy Wax','Paraffin Wax']
};
function hisaSaveQuote(){localStorage.setItem('hisa_all_category_quote_cart',JSON.stringify(hisaQuoteCart))}
function hisaQuoteAdd(category,name,qty){qty=Math.max(1,Math.floor(Number(qty)||1));let key=category+'|'+name;hisaQuoteCart[key]=(hisaQuoteCart[key]||0)+qty;hisaSaveQuote();updateCart();hisaAddedToast()}
function hisaQuoteChange(key,delta){hisaQuoteCart[key]=Math.max(0,(hisaQuoteCart[key]||0)+delta);if(!hisaQuoteCart[key])delete hisaQuoteCart[key];hisaSaveQuote();updateCart()}
const HISA_HERBAL_LIST_PRICES={"AMLA": [30, 200], "ARITHA": [35, 210], "ANAR": [25, 130], "AMBA HALDI": [40, 310], "ALOEVERA": [25, 130], "BRAHMI": [25, 130], "BHRINGRAJ": [25, 130], "BEETROOT": [45, 300], "CHARCOAL": [80, 550], "CURRY LEAVES": [35, 200], "KESAR CHANDAN": [45, 350], "MULTANI": [20, 50], "MULETHI": [45, 335], "MANJESTHA": [50, 400], "MORINGA": [40, 320], "MULTANI (WHITE)": [20, 50], "NEEM": [25, 130], "ORANGE": [30, 150], "ROSE": [50, 400], "RED SANDALWOOD": [60, 450], "SANDALWOOD": [50, 400], "SHIKAKAI": [35, 250], "TULSI": [30, 200], "ROYAL UBTAN": [40, 300]};
function hisaRenderOtherCategory(kind){const root=document.getElementById('hisaExtraProducts');if(!root)return;
 const names=hisaCollections[kind];if(!names){root.innerHTML='';return}
 root.innerHTML='<div class="hisa-extra-grid">'+names.map((name,i)=>`<article class="hisa-extra-card">${kind==='wax' && name==='Yellow Bees Wax — Grade AA'?'<div class="hisa-candle-image-wrap"><img loading="lazy" decoding="async" class="hisa-paraffin-photo" src="'+HISA_YELLOW_BEES_IMG+'" alt="Yellow Bees Wax Grade AA pouch" loading="lazy" decoding="async"></div>':kind==='wax' && name==='White Candle Wax Cube — Grade AA'?'<div class="hisa-candle-image-wrap"><img loading="lazy" decoding="async" class="hisa-paraffin-photo" src="'+HISA_WHITE_CANDLE_IMG+'" alt="White Candle Wax Cube Grade AA pouch" loading="lazy" decoding="async"></div>':kind==='wax' && name==='Raw Wax — Grade A'?'<div class="hisa-candle-image-wrap"><img loading="lazy" decoding="async" class="hisa-paraffin-photo" src="'+HISA_RAW_WAX_IMG+'" alt="Hisa Organic Raw Wax Grade A pouch" loading="lazy" decoding="async"></div>':kind==='wax' && name==='Soy Wax'?'<div class="hisa-candle-image-wrap"><img loading="lazy" decoding="async" class="hisa-paraffin-photo" src="'+HISA_SOY_WAX_IMG+'" alt="Hisa Organic Soy Wax pouch" loading="lazy" decoding="async"></div>':kind==='wax' && name==='Paraffin Wax'?'<img loading="lazy" decoding="async" class="hisa-paraffin-photo" src="'+HISA_PARAFFIN_IMG+'" alt="Hisa Organic Paraffin Wax pouch" loading="lazy" decoding="async">':kind==='herbal'?`<img loading="lazy" decoding="async" class="hisa-herbal-photo" src="${HISA_HERBAL_POUCH_PHOTOS[name]}" alt="${name} herbal powder blue pouch" loading="lazy" decoding="async">`:`<div style="font-size:34px">${kind==='cream'?'🧴':kind==='herbal'?'🌿':'🕯️'}</div>`}<h3>${kind==='herbal'?name+' Powder':name}</h3><p>${kind==='herbal'?'All Herbal Powders • All Natural · '+(HISA_HERBAL_LIST_PRICES[name]?'100 g ₹'+HISA_HERBAL_LIST_PRICES[name][0]+' · 1 kg ₹'+HISA_HERBAL_LIST_PRICES[name][1]:'Price: Coming Soon'):'Price on Request · Stock and packaging to be confirmed'}</p>${kind==='herbal'?`<div class="hisa-powder-packs" role="group" aria-label="${name} pack size"><button type="button" class="hisa-powder-pack selected" aria-pressed="true" onclick="hisaPowderPack(${i},'100 g',this)">100 g</button><button type="button" class="hisa-powder-pack" onclick="hisaPowderPack(${i},'1 kg',this)">1 kg</button></div><input type="hidden" id="hisaPack_herbal_${i}" value="100 g">`:''}<div class="${kind==='herbal'?'hisa-powder-actions':''}" id="hisaPowderActions_${kind}_${i}"><div class="hisa-qty"><button type="button" onclick="hisaExtraStep('${kind}',${i},-1)">−</button><input type="number" min="1" step="1" value="1" id="hisaQty_${kind}_${i}" aria-label="Number of packs for ${name}"><button type="button" onclick="hisaExtraStep('${kind}',${i},1)">+</button></div><button type="button" onclick="hisaQuoteAdd('${kind}',${kind==='herbal'?`'${name} Powder · '+document.getElementById('hisaPack_herbal_${i}').value`:`'${name}'`},document.getElementById('hisaQty_${kind}_${i}').value)">Add to Cart</button></div></article>`).join('')+'</div>';
}
function hisaPowderPack(i,size,btn){document.getElementById('hisaPack_herbal_'+i).value=size;btn.parentElement.querySelectorAll('button').forEach(b=>{b.classList.toggle('selected',b===btn);b.setAttribute('aria-pressed',String(b===btn))});document.getElementById('hisaPowderActions_herbal_'+i)?.classList.add('is-active')}
function hisaExtraStep(kind,i,delta){let el=document.getElementById(`hisaQty_${kind}_${i}`);el.value=Math.max(1,(parseInt(el.value)||1)+delta)}
const hisaCategoryOriginal=showCategory;
showCategory=function(kind){hisaCategoryOriginal(kind);hisaRenderOtherCategory(kind)};
const hisaRenderFragrancesOriginal=renderFragrances;
renderFragrances=function(){hisaRenderFragrancesOriginal();document.querySelectorAll('#fragranceGrid .frag-card').forEach(card=>{let name=card.querySelector('h3')?.textContent?.trim();if(!name||card.querySelector('.hisa-frag-cart'))return;const i=fragranceNames.indexOf(name);if(i<0)return;let b=document.createElement('button');b.className='hisa-frag-cart';b.textContent='Add selected pack to Cart';b.type='button';const sel=document.createElement('select');sel.className='hisa-pack-select';sel.setAttribute('aria-label','Fragrance pack size');sel.innerHTML='<option value="25 ml|60">25 ml · ₹60</option><option value="5 x 25 ml|300">5 bottles (25 ml each) · ₹300</option><option value="500 ml|800">500 ml · ₹800</option><option value="1 kg|1400">1 kg · ₹1,400</option>';sel.onclick=e=>e.stopPropagation();card.appendChild(sel);b.addEventListener('click',e=>{e.stopPropagation();if(typeof fragranceStock==='function'&&fragranceStock(i)===0){alert('Out of Stock');return}hisaQuoteAdd('fragrance',name+'|'+sel.value,1)});card.appendChild(b)})};
const hisaOpenFragranceOriginal=openFragrance;
openFragrance=function(i){hisaOpenFragranceOriginal(i);let b=document.getElementById('hisaFragDetailCart');if(!b){b=document.createElement('button');b.id='hisaFragDetailCart';b.className='btn';b.style.marginLeft='8px';document.getElementById('fragDetailDesc').parentNode.appendChild(b)}let sel=document.getElementById('hisaFragDetailPack');if(!sel){sel=document.createElement('select');sel.id='hisaFragDetailPack';sel.className='hisa-pack-select';sel.innerHTML='<option value="25 ml|60">25 ml · ₹60</option><option value="5 x 25 ml|300">5 bottles · ₹300</option><option value="500 ml|800">500 ml · ₹800</option><option value="1 kg|1400">1 kg · ₹1,400</option>';b.parentNode.insertBefore(sel,b)}b.textContent='Add selected pack to Cart';b.onclick=()=>{if(typeof fragranceStock==='function'&&fragranceStock(i)===0){alert('Out of Stock');return}hisaQuoteAdd('fragrance',fragranceNames[i]+'|'+sel.value,1)}};
const hisaUpdateCartOriginal=updateCart;
updateCart=function(){hisaUpdateCartOriginal();const quote=Object.entries(hisaQuoteCart).filter(([k,q])=>q>0);const quoteCount=quote.reduce((n,[k,q])=>n+q,0);const oldCount=Number(document.getElementById('count').textContent)||0;document.getElementById('count').textContent=oldCount+quoteCount;const lines=document.getElementById('cartItems');if(quote.length){lines.insertAdjacentHTML('beforeend',quote.map(([key,q])=>{const [kind,name]=key.split('|');return `<div class="hisa-cart-quote"><strong>${name}</strong><div>${(kind==='fragrance'||(kind==='wax'||kind==='herbal')&&key.split('|')[3])?(key.split('|')[2]||'500 g')+' · ₹'+Number(key.split('|')[3])+'/pack':'Price on Request · '+(kind==='cream'?'Creams & Lotions':kind==='herbal'?'Herbal Powders':'Waxes')}</div><div style="display:flex;gap:12px;align-items:center;margin-top:7px"><button type="button" onclick="hisaQuoteChange(${JSON.stringify(key)},-1)">−</button><strong>${q}</strong><button type="button" onclick="hisaQuoteChange(${JSON.stringify(key)},1)">+</button></div></div>`}).join(''))}const sub=document.getElementById('subtotal');if(quote.length)sub.insertAdjacentText('beforeend',' + '+quote.length+' quote item(s) (price pending)');};
const hisaForm=document.querySelector('#drawer form');
if(hisaForm){hisaForm.addEventListener('submit',function(e){e.preventDefault();e.stopImmediatePropagation();
const soap=Object.entries(cart).filter(([id,q])=>q>0),liquids=Object.entries(liquidCart).filter(([name,q])=>q>0),quotes=Object.entries(hisaQuoteCart).filter(([key,q])=>q>0);
if(!soap.length&&!liquids.length&&!quotes.length){alert('Please add products to cart');return}
for(const [id,q] of soap){if(stockQty(id)!==null&&q>stockQty(id)){alert(products[id].name+' stock insufficient');return}}
const val=id=>document.getElementById(id)?.value?.trim()||'';
const fragranceTotal=quotes.reduce((sum,[key,q])=>sum+((key.startsWith('fragrance|')||(key.startsWith('wax|')||key.startsWith('herbal|'))&&key.split('|')[3])?Number(key.split('|')[3])*q:0),0);
const total=orderTotal()+fragranceTotal;
const knownWeight=soap.reduce((n,[id,q])=>n+Number(q),0)+liquids.reduce((n,[name,q])=>n+Number(q),0);
const fragranceWeight=quotes.reduce((n,[key,q])=>{if((key.startsWith('wax|')||key.startsWith('herbal|'))&&key.split('|')[3])return n+q*(key.split('|')[2]==='100 g'?0.1:key.split('|')[2]==='500 g'?0.5:1);if(!key.startsWith('fragrance|'))return n;const pack=(key.split('|')[2]||'25 ml').toLowerCase();return n+q*(pack.includes('500')?0.5:pack.includes('25')?0.025:1)},0);
const weight=knownWeight+fragranceWeight;
const hasUnpriced=quotes.some(([key])=>!key.startsWith('fragrance|')&&!((key.startsWith('wax|')||key.startsWith('herbal|'))&&key.split('|')[3]));
const zone=val('hisaShipZone');if(!zone){alert('Please select shipping destination');return}
const isPickup=val('deliveryType').toLowerCase().includes('pickup');
const chargeableKg=weight>0?Math.ceil(weight):0;
const rates=zone==='mh'?[40,80,120,160,200,240,280,320,360,400]:[80,150,200,250,300,350,400,450,500,550];
const shippingKnown=!hasUnpriced&&!isPickup&&chargeableKg>=1&&chargeableKg<=100;
const shipping=shippingKnown?(chargeableKg<=10?rates[chargeableKg-1]:rates[9]+(chargeableKg-10)*(zone==='mh'?40:55)):null;
const shippingLabel=isPickup?'Pickup: shipping to be confirmed':hasUnpriced?'To be confirmed (unpriced/unknown-weight items)':chargeableKg<1?'To be confirmed (unknown weight)':chargeableKg>100?'To be confirmed (over 100 kg)':`Rs ${shipping} (up to ${chargeableKg} kg)`;
const finalAmount=shippingKnown?total+shipping:null;
const msg=['Hello Hisa Organic, I would like to place one combined order.','','ALL CATEGORY ORDER',...soap.map(([id,q])=>`${products[id].name} Soap Base: ${q} kg x Rs ${soapCartRate()} = Rs ${q*soapCartRate()}`),...liquids.map(([name,q])=>`${name}: ${q} kg x Rs 120 = Rs ${q*liquidTierPrice(q)}`),...quotes.map(([key,q])=>{const [kind,name]=key.split('|');return kind==='fragrance'||(kind==='wax'||kind==='herbal')&&key.split('|')[3]?`${name} (${kind}): ${q} x ${key.split('|')[2]} pack(s) x Rs ${Number(key.split('|')[3])} = Rs ${q*Number(key.split('|')[3])}`:`${name} (${kind}): ${q} unit(s) - PRICE ON REQUEST`}),'',`Priced items subtotal: Rs ${total}`,`Approx product weight (excluding packing): ${Number(weight.toFixed(3))} kg`,'Shipping destination: '+(zone==='mh'?'Maharashtra':'Other State'),'Shipping: '+shippingLabel,'Final payable: '+(finalAmount===null?'To be confirmed':'Rs '+finalAmount)+(hasUnpriced?' + price-on-request items':''),'','CUSTOMER DETAILS','Name: '+val('customer'),'Mobile: '+val('mobile'),'Address: '+val('address'),'PIN: '+val('pin'),'Delivery: '+val('deliveryType'),'Notes: '+(val('notes')||'None'),'','Please confirm packing weight, final quotation and payment details.'].join('\n');
// WhatsApp does not tell this website whether the customer actually pressed Send.
// Clear the draft cart when the customer hands the prepared order to WhatsApp.
const whatsappUrl='https://wa.me/918446441401?text='+encodeURIComponent(msg);
try { sessionStorage.setItem('hisa_last_whatsapp_order_draft',msg); } catch(e) {}
Object.keys(cart).forEach(k=>delete cart[k]);
Object.keys(liquidCart).forEach(k=>delete liquidCart[k]);
Object.keys(hisaQuoteCart).forEach(k=>delete hisaQuoteCart[k]);
try { hisaSaveQuote(); } catch(e) {}
try { updateCart(); } catch(e) {}
try { document.getElementById('overlay')?.classList.remove('open'); document.getElementById('drawer')?.classList.remove('open'); } catch(e) {}
window.location.href=whatsappUrl
},true)}
updateCart();
;

/* A customer can type any whole-number quantity directly into My Cart. */
(function(){
const original=updateCart;
function safeAttr(value){return String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
window.hisaSetCartQty=function(type,key,value){
 const qty=Number(value);
 if(!Number.isSafeInteger(qty)||qty<0||qty>1000000){alert('Please enter a valid whole-number quantity (0 to 1,000,000).');updateCart();return}
 if(type==='soap'){
  const id=Number(key);if(!products[id])return;
  const available=stockQty(id);
  if(available!==null&&qty>available){alert('Only '+available+' kg available for '+products[id].name);updateCart();return}
  if(qty===0)delete cart[id];else cart[id]=qty;
 }else if(type==='liquid'){
  if(qty===0)delete liquidCart[key];else liquidCart[key]=qty;
 }else if(type==='quote'){
  if(qty===0)delete hisaQuoteCart[key];else hisaQuoteCart[key]=qty;
  hisaSaveQuote();
 }
 updateCart();
 };
 window.updateCart=function(){
  original();
  const area=document.getElementById('cartItems');if(!area)return;
  const rows=[];
  Object.entries(cart).filter(([id,q])=>q>0).forEach(([id,q])=>rows.push({type:'soap',key:id,name:products[id].name+' Soap Base',qty:q,unit:'kg',detail:'₹'+soapCartRate()+'/kg · '+soapCartTierLabel(),sum:'₹'+(q*soapCartRate()).toLocaleString('en-IN')}));
  Object.entries(liquidCart).filter(([name,q])=>q>0).forEach(([name,q])=>rows.push({type:'liquid',key:name,name,qty:q,unit:'kg',detail:'₹120/kg',sum:'₹'+(q*120).toLocaleString('en-IN')}));
  Object.entries(hisaQuoteCart).filter(([key,q])=>q>0).forEach(([key,q])=>{const [kind,name]=key.split('|');rows.push({type:'quote',key,name:(kind==='fragrance'||(kind==='wax'||kind==='herbal')&&key.split('|')[3])?name+' · '+key.split('|')[2]:name,qty:q,unit:(kind==='fragrance'||(kind==='wax'||kind==='herbal')&&key.split('|')[3])?'packs':'units',detail:(kind==='fragrance'||(kind==='wax'||kind==='herbal')&&key.split('|')[3])?'₹'+Number(key.split('|')[3])+' / pack':kind+' · Price on Request',sum:(kind==='fragrance'||(kind==='wax'||kind==='herbal')&&key.split('|')[3])?'₹'+(q*Number(key.split('|')[3])).toLocaleString('en-IN'):'Quote pending'})});
  if(!rows.length)return;
  area.innerHTML='';
  if(soapCartKg()>0){const note=document.createElement('div');note.className='notice';note.style.margin='10px 0';note.textContent='Soap Bases: '+soapCartKg()+' kg combined across all varieties · ₹'+soapCartRate()+'/kg (25 kg+ ₹105/kg; 100 kg+ ₹100/kg).';area.appendChild(note)}
  rows.forEach(r=>{
   const el=document.createElement('div');el.className='cart-line';el.style.cssText='display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;padding:12px 0;border-bottom:1px solid #e5eee8';
   const info=document.createElement('div');info.style.flex='1 1 170px';
   const strong=document.createElement('strong');strong.textContent=r.name;info.appendChild(strong);
   const desc=document.createElement('div');desc.className='small';desc.textContent=r.detail+' · '+r.sum;info.appendChild(desc);
   const control=document.createElement('div');control.className='hisa-cart-qty';
   const minus=document.createElement('button');minus.type='button';minus.textContent='−';minus.setAttribute('aria-label','Decrease '+r.name);minus.onclick=()=>hisaSetCartQty(r.type,r.key,r.qty-1);
   const input=document.createElement('input');input.type='number';input.min='0';input.max='1000000';input.step='1';input.value=r.qty;input.setAttribute('aria-label','Quantity for '+r.name);input.title='Type the exact quantity';
   const plus=document.createElement('button');plus.type='button';plus.textContent='+';plus.setAttribute('aria-label','Increase '+r.name);plus.onclick=()=>hisaSetCartQty(r.type,r.key,r.qty+1);
   const unit=document.createElement('span');unit.className='hisa-unit';unit.textContent=r.unit;
   const apply=document.createElement('button');apply.type='button';apply.className='hisa-cart-apply';apply.textContent='Update';apply.onclick=()=>hisaSetCartQty(r.type,r.key,input.value);
   input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();apply.click()}});
   input.addEventListener('change',()=>hisaSetCartQty(r.type,r.key,input.value));
   const remove=document.createElement('button');remove.type='button';remove.className='hisa-cart-remove';remove.textContent='Remove';remove.onclick=()=>hisaSetCartQty(r.type,r.key,0);
   control.append(minus,input,plus,unit,apply,remove);info.appendChild(control);el.appendChild(info);area.appendChild(el);
  });
  const count=document.getElementById('count');if(count)count.textContent=rows.reduce((sum,r)=>sum+Number(r.qty),0);
  const fragranceSubtotal=Object.entries(hisaQuoteCart).reduce((n,[key,q])=>n+((key.startsWith('fragrance|')||(key.startsWith('wax|')||key.startsWith('herbal|'))&&key.split('|')[3])?Number(q)*Number(key.split('|')[3]):0),0);
  const subtotal=document.getElementById('subtotal');if(subtotal){const known=orderTotal()+fragranceSubtotal;const pending=Object.keys(hisaQuoteCart).some(k=>!k.startsWith('fragrance|')&&!(k.startsWith('wax|')&&k.split('|')[3])&&hisaQuoteCart[k]>0);subtotal.textContent='Product subtotal: ₹'+known.toLocaleString('en-IN')+(pending?' + unpriced items (quote pending)':'')}
  const summary=document.getElementById('cartSummary');if(summary)summary.textContent=rows.length+' products · Enter exact quantity, then send one WhatsApp order';
 };
 updateCart();
})();
;

/* Fragrance pack selection: show selected price and order exclusively through shared cart. */
(function(){
 const format = n=>'₹'+Number(n).toLocaleString('en-IN');
 function attachPrice(select){
   if(!select || select.dataset.hisaPriceReady)return;
   select.dataset.hisaPriceReady='1';
   const price=document.createElement('div');price.className='hisa-frag-price';price.setAttribute('aria-live','polite');
   select.insertAdjacentElement('afterend',price);
   function update(){const [pack,amount]=select.value.split('|');price.textContent=pack+' — '+format(amount)+' per selected pack'}
   select.addEventListener('change',update);update();
 }
 function tidy(){
  document.querySelectorAll('#fragranceGrid .frag-card').forEach(card=>{
    card.querySelectorAll('button').forEach(b=>{if(!b.classList.contains('hisa-frag-cart'))b.remove()});
    attachPrice(card.querySelector('.hisa-pack-select'));
  });
  const detail=document.querySelector('#fragranceDetail .detail-info');
  if(detail){detail.querySelectorAll('button').forEach(b=>{if(b.id!=='hisaFragDetailCart')b.remove()});attachPrice(detail.querySelector('.hisa-pack-select'));
    const facts=detail.querySelector('.detail-facts');if(facts)facts.remove();
  }
  const intro=document.querySelector('#fragranceCatalogue .wrap > p');if(intro)intro.textContent='Select your fragrance and pack size, then Add to Cart. Checkout all categories together on WhatsApp.';
 }
 const oldRender=window.renderFragrances;
 if(typeof oldRender==='function')window.renderFragrances=function(){oldRender();tidy()};
 const oldOpen=window.openFragrance;
 if(typeof oldOpen==='function')window.openFragrance=function(i){oldOpen(i);tidy()};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tidy);else tidy();
})();
;

/* Soap-style clickable fragrance pack tiles, shared cart remains unchanged. */
(function(){
 const packs=[['25 ml','25 ml|60',60],['500 ml','500 ml|800',800],['1 kg','1 kg|1400',1400]];
 function enhance(sel){
  if(!sel||sel.dataset.tileReady)return;
  sel.dataset.tileReady='1';
  sel.value='25 ml|60';
  const group=document.createElement('div');group.className='hisa-pack-tiles';group.setAttribute('role','group');group.setAttribute('aria-label','Select fragrance pack');
  const buttons=packs.map(([label,value,price])=>{const b=document.createElement('button');b.type='button';b.className='hisa-pack-tile';b.innerHTML=label+'<small>₹'+price.toLocaleString('en-IN')+'</small>';b.setAttribute('aria-pressed',String(sel.value===value));b.addEventListener('click',e=>{e.stopPropagation();sel.value=value;sel.dispatchEvent(new Event('change',{bubbles:true}));buttons.forEach(btn=>btn.setAttribute('aria-pressed',String(btn===b)));});group.appendChild(b);return b});
  sel.insertAdjacentElement('beforebegin',group);
  sel.dispatchEvent(new Event('change',{bubbles:true}));
 }
 function apply(){document.querySelectorAll('#fragranceGrid .hisa-pack-select, #fragranceDetail .hisa-pack-select').forEach(enhance);const facts=document.querySelector('#fragranceDetail .detail-facts');if(facts)facts.innerHTML='Select a pack above: <b>25 ml ₹60</b> · <b>500 ml ₹800</b> · <b>1 kg ₹1,400</b>. <b>Shipping extra.</b> For five 25 ml bottles, add 25 ml pack and set cart quantity to 5 (₹300).';}
 const observer=new MutationObserver(()=>{if(!document.querySelector('.hisa-pack-select:not([data-tile-ready])'))return;apply()});
 function init(){apply();observer.observe(document.body,{subtree:true,childList:true})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
;

/* hisa-frag-shipping-note */

(function(){
 function addShipping(){
  const detail=document.getElementById('fragranceDetail');if(!detail)return;
  let note=document.getElementById('hisaFragranceShippingNote');
  if(!note){note=document.createElement('p');note.id='hisaFragranceShippingNote';const facts=detail.querySelector('.detail-facts');if(facts)facts.insertAdjacentElement('afterend',note);else detail.appendChild(note)}
  note.remove();
 }
 document.addEventListener('DOMContentLoaded',addShipping);
 document.addEventListener('click',function(e){if(e.target.closest('#fragranceGrid .frag-card'))setTimeout(addShipping,0)});
})();
;

/* hisa-live-shipping-preview */

(function(){function update(){const z=document.getElementById('hisaShipZone')?.value;const box=document.querySelector('.shipping-preview');if(!box)return;let p=document.getElementById('hisaShippingZoneInfo');if(!p){p=document.createElement('p');p.id='hisaShippingZoneInfo';box.appendChild(p)}p.textContent=z==='mh'?'Selected: Maharashtra → Maharashtra (₹40 per kg, up to 100 kg)':z==='other'?'Selected: Maharashtra → Other State (1kg ₹80 / 2kg ₹150 / 10kg ₹550; then +₹55/kg up to 100kg)':'Select destination to calculate shipping at WhatsApp checkout.'}document.addEventListener('change',e=>{if(e.target.id==='hisaShipZone')update()});document.addEventListener('DOMContentLoaded',update)})();
;

(function(){
 function setup(){
  const root=document.getElementById('liquidSix');if(!root||document.getElementById('hisaLiquidCategories'))return;
  const grid=root.querySelector('.liquid-six-grid');if(!grid)return;
  const menu=document.createElement('div');menu.id='hisaLiquidCategories';
  [['Shampoo','🧴'],['Face Wash','🫧'],['Body Wash','🚿']].forEach(([name,emoji])=>{const b=document.createElement('button');b.type='button';b.className='hisa-liquid-category';b.innerHTML='<span>'+emoji+'</span>'+name;b.addEventListener('click',()=>window.hisaOpenLiquidGroup(name));menu.appendChild(b)});
  const back=document.createElement('button');back.id='hisaLiquidBack';back.type='button';back.textContent='← Back to Liquid Categories';back.style.display='none';back.addEventListener('click',()=>window.hisaLiquidMenu());
  root.insertBefore(menu,grid);root.insertBefore(back,grid);window.hisaLiquidMenu();
 }
 window.hisaLiquidMenu=function(){const root=document.getElementById('liquidSix');if(!root)return;const grid=root.querySelector('.liquid-six-grid');const menu=document.getElementById('hisaLiquidCategories');const back=document.getElementById('hisaLiquidBack');if(menu)menu.style.display='grid';if(back)back.style.display='none';if(grid){grid.style.display='none';grid.querySelectorAll('.liquid-six-card').forEach(x=>x.style.display='');}const title=document.getElementById('categoryTitle');if(title&&root.style.display!=='none')title.textContent='Liquid Products';};
 window.hisaOpenLiquidGroup=function(name){const root=document.getElementById('liquidSix');if(!root)return;const grid=root.querySelector('.liquid-six-grid');document.getElementById('hisaLiquidCategories').style.display='none';document.getElementById('hisaLiquidBack').style.display='inline-block';grid.style.display='grid';grid.querySelectorAll('.liquid-six-card').forEach(card=>{const title=card.querySelector('h3');card.style.display=title&&title.textContent.toLowerCase().includes(name.toLowerCase())?'':'none';});document.getElementById('categoryTitle').textContent=name;root.scrollIntoView({behavior:'smooth',block:'start'});};
 const oldShowCategory=window.showCategory;if(typeof oldShowCategory==='function'){window.showCategory=function(kind){const result=oldShowCategory.apply(this,arguments);if(kind==='liquid'){setup();window.hisaLiquidMenu()}return result;}}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
;

/* hisa-liquid-explicit-subcategory-fix */

(function(){
 const groups={'Shampoo':['Transparent Shampoo','Pearly Shampoo'],'Face Wash':['Transparent Face Wash','Pearly Face Wash'],'Body Wash':['Transparent Body Wash','Pearly Body Wash']};
 function filter(name){const root=document.getElementById('liquidSix');if(!root)return;const grid=root.querySelector('.liquid-six-grid');if(!grid)return;const allowed=groups[name];if(!allowed)return;
 document.getElementById('hisaLiquidCategories').style.display='none';document.getElementById('hisaLiquidBack').style.display='inline-block';grid.style.display='grid';
 grid.querySelectorAll('.liquid-six-card').forEach(card=>{const h=card.querySelector('h3');card.style.display=h&&allowed.includes(h.textContent.trim())?'':'none';});
 const title=document.getElementById('categoryTitle');if(title)title.textContent=name;
 root.scrollIntoView({block:'start',behavior:'smooth'});
 }
 function init(){window.hisaOpenLiquidGroup=filter;}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
;

/* hisa-direct-fragrance-pack */

/* Direct add to shared cart: tapping a fragrance size adds one pack immediately. */
(function(){
 const packs=[['25 ml','25 ml|60',60],['500 ml','500 ml|800',800],['1 liter','1 liter|1400',1400]];
 function setup(){
  const detail=document.querySelector('#fragranceDetail .detail-info');
  if(!detail)return;
  const sel=detail.querySelector('#hisaFragDetailPack');
  if(sel){sel.innerHTML=packs.map(p=>'<option value="'+p[1]+'">'+p[0]+' · ₹'+p[2]+'</option>').join('');}
  const old=detail.querySelector('.hisa-pack-tiles');if(old)old.remove();
  if(!sel)return;
  const tiles=document.createElement('div');tiles.className='hisa-pack-tiles';tiles.setAttribute('aria-label','Tap pack to add fragrance to cart');
  packs.forEach(([label,value,price])=>{
   const b=document.createElement('button');b.type='button';b.className='hisa-pack-tile';
   b.innerHTML=label+'<small>₹'+price.toLocaleString('en-IN')+'</small>';
   b.addEventListener('click',e=>{
    e.stopPropagation();
    const name=document.getElementById('fragDetailName')?.textContent?.trim();
    if(!name)return;
    if(typeof window.fragranceNames!=='undefined' && typeof window.fragranceStock==='function'){
      const i=window.fragranceNames.indexOf(name);
      if(i>=0&&window.fragranceStock(i)===0){alert('Out of Stock');return;}
    }
    if(typeof window.hisaQuoteAdd==='function'){
      window.hisaQuoteAdd('fragrance',name+'|'+value,1);
      b.setAttribute('aria-label',label+' added to cart');
      const oldText=b.innerHTML;b.innerHTML='✓ Added<small>₹'+price.toLocaleString('en-IN')+'</small>';
      setTimeout(()=>{if(b.isConnected)b.innerHTML=oldText},1100);
    }else alert('Cart unavailable. Please reload the website.');
   });tiles.appendChild(b);
  });
  sel.insertAdjacentElement('beforebegin',tiles);
  const info=detail.querySelector('.detail-facts');if(info&&info.textContent.includes('Select a pack above'))info.style.display='none';
 }
 const original=window.openFragrance;
 if(typeof original==='function')window.openFragrance=function(...args){const result=original.apply(this,args);setup();return result};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
;

/* hisa-typed-quantity-js */

function hisaDetailTyped(v){
 if(v==='')return;
 const n=Math.floor(Number(v));
 if(!Number.isFinite(n)||n<1)return;
 activeDetailQty=Math.min(n,100000);
 const price=tierPrice(activeDetailQty);
 const el=document.getElementById('detailPrice');
 if(el)el.textContent='₹'+price+'/kg · Total ₹'+(activeDetailQty*price).toLocaleString('en-IN');
 document.querySelectorAll('.tier-picker button').forEach((b,i)=>b.classList.toggle('selected',[1,25,100][i]===activeDetailQty));
}
function hisaDetailNormalize(){
 const el=document.getElementById('detailQty');if(!el)return;
 const n=Math.floor(Number(el.value));activeDetailQty=Number.isFinite(n)?Math.max(1,Math.min(n,100000)):1;
 el.value=activeDetailQty;
 hisaDetailTyped(el.value);
}
;

/* hisa-frag-select-quantity-cart */

(function(){
 const packs=[['25 ml',60],['500 ml',800],['1 liter',1400]];
 function setup(){
  const detail=document.querySelector('#fragranceDetail .detail-info');
  if(!detail)return;
  detail.querySelectorAll('.hisa-frag-order-panel').forEach(el=>el.remove());
  detail.querySelectorAll(':scope > .hisa-pack-tiles').forEach(el=>el.remove());
  const panel=document.createElement('div');panel.className='hisa-frag-order-panel';
  panel.innerHTML='<strong>Choose Fragrance Pack</strong><div class="hisa-pack-tiles"></div><div class="hisa-frag-qtyrow"><label for="hisa-frag-qty">Number of bottles / packs</label><div class="hisa-frag-stepper"><button type="button" class="hisa-frag-minus" aria-label="Decrease bottles">−</button><input id="hisa-frag-qty" type="number" min="1" max="9999" step="1" inputmode="numeric" value="1"><button type="button" class="hisa-frag-plus" aria-label="Increase bottles">+</button></div></div><div class="hisa-frag-summary" aria-live="polite"></div><button type="button" class="hisa-frag-submit">Add to Cart</button><div style="font-size:12px;margin-top:8px;color:#56715d">Shipping charges extra</div>';
  let selected=0;
  const tiles=panel.querySelector('.hisa-pack-tiles');
  const qty=panel.querySelector('#hisa-frag-qty');
  const summary=panel.querySelector('.hisa-frag-summary');
  function count(){return Math.max(1,Math.min(9999,Math.floor(Number(qty.value)||1)))}
  function update(){summary.textContent=count()+' × '+packs[selected][0]+' = ₹'+(count()*packs[selected][1]).toLocaleString('en-IN');[...tiles.children].forEach((b,i)=>{b.classList.toggle('selected',i===selected);b.setAttribute('aria-pressed',String(i===selected))})}
  packs.forEach(([size,price],i)=>{const b=document.createElement('button');b.type='button';b.className='hisa-pack-tile';b.innerHTML=size+'<small>₹'+price.toLocaleString('en-IN')+'</small>';b.onclick=()=>{selected=i;update()};tiles.appendChild(b)});
  panel.querySelector('.hisa-frag-minus').onclick=()=>{qty.value=Math.max(1,count()-1);update()};panel.querySelector('.hisa-frag-plus').onclick=()=>{qty.value=Math.min(9999,count()+1);update()};qty.addEventListener('input',update);qty.addEventListener('change',()=>{qty.value=count();update()});
  panel.querySelector('.hisa-frag-submit').onclick=()=>{
    const name=document.getElementById('fragDetailName')?.textContent?.trim();if(!name)return;
    if(typeof window.fragranceNames!=='undefined'&&typeof window.fragranceStock==='function'){
      const idx=window.fragranceNames.indexOf(name);if(idx>=0&&window.fragranceStock(idx)===0){alert('Out of Stock');return}
    }
    if(typeof window.hisaQuoteAdd==='function')window.hisaQuoteAdd('fragrance',name+'|'+packs[selected][0]+'|'+packs[selected][1],count());
    else alert('Cart unavailable');
  };
  const oldSelect=detail.querySelector('#hisaFragDetailPack');
  if(oldSelect)oldSelect.insertAdjacentElement('beforebegin',panel);else detail.appendChild(panel);
  update();
 }
 const original=window.openFragrance;
 if(typeof original==='function')window.openFragrance=function(...args){const result=original.apply(this,args);setup();return result};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
;

/* Unique fragrance descriptions: scent impressions, not verified ingredient claims. */
const HISA_FRAGRANCE_DESCRIPTIONS={"ALMOND": "A warm, gently sweet almond-inspired aroma with soft nutty notes. A comforting choice for elegant handmade soaps.", "ALOEVERA": "A fresh, clean aloe vera-inspired scent with light green and watery notes. Ideal for a refreshing soap collection.", "AQUA FRESH": "A crisp aquatic fragrance with airy, cool and freshly washed notes. Creates a bright, modern bathing experience.", "AQUA MINT": "A cooling blend of watery freshness and lively mint-inspired notes. Great for an energising soap fragrance profile.", "BLUE BERRY": "A juicy blueberry-inspired fragrance with sweet berry notes and a playful fruity finish.", "BLACK CURRENT": "A bold blackcurrant-inspired aroma with rich, tangy berry sweetness and a vibrant fruity character.", "CUCUMBER": "A light cucumber-inspired fragrance with cool green and watery freshness for a clean, soothing scent impression.", "COFFEE": "A rich roasted coffee-inspired aroma with warm, inviting café-style notes. Perfect for distinctive coffee-themed soaps.", "CHOCOLATE": "A delicious chocolate-inspired fragrance with smooth cocoa sweetness and a warm dessert-like feel.", "DOLLAR": "A bold, contemporary perfume-style fragrance with a polished and distinctive scent character.", "DETTOL": "A crisp, familiar hygiene-inspired fragrance with a sharp, clean and refreshing character.", "DOVE": "A soft, creamy, clean-soap-inspired fragrance with gentle powdery notes and a comforting finish.", "FASTER FIAMA": "A lively, modern shower-gel-inspired scent with fresh fruity and floral notes.", "GREEN TEA": "A delicate green-tea-inspired fragrance with soft leafy freshness and a light, calming aroma.", "GRAPE": "A sweet, juicy grape-inspired fragrance with bright fruity notes and a cheerful finish.", "GREEN APPLE": "A crisp green-apple-inspired aroma combining juicy fruit sweetness with a fresh, slightly tangy twist.", "HERBAL MX": "A balanced herbal-inspired blend with green, botanical and fresh notes for a nature-themed soap range.", "HONEY MILK": "A cozy honey-and-milk-inspired fragrance with creamy sweetness and a smooth, comforting aroma.", "JOHNSON": "A gentle baby-care-inspired scent with soft powdery, clean and comforting notes.", "JASMINE": "A floral jasmine-inspired fragrance with sweet white-flower notes and a graceful, lingering impression.", "KESAR CHANDAN": "A warm saffron-and-sandalwood-inspired fragrance with rich, woody and traditional aromatic notes.", "LIRIL": "A bright, lively fresh-soap-inspired fragrance with sparkling citrus-green notes.", "LAVENDER": "A classic lavender-inspired floral fragrance with soft herbal notes and a relaxing aromatic feel.", "LICHI": "A sweet lychee-inspired aroma with juicy tropical fruit notes and a light floral touch.", "LUX": "A luxurious beauty-soap-inspired fragrance with smooth floral and elegant perfumed notes.", "LEMON": "A zesty lemon-inspired fragrance with sparkling citrus freshness and a clean, uplifting character.", "MYSORE SANDAL": "A traditional sandalwood-inspired aroma with smooth, warm and richly woody notes.", "MANGO": "A ripe mango-inspired fragrance bursting with sweet, juicy tropical fruit notes.", "MIX FRUIT RED": "A colourful mixed-fruit-inspired scent with sweet red berries and juicy fruity freshness.", "MULK": "A soft, milky-inspired fragrance with gentle creamy sweetness and a comforting clean feel.", "MULTANI MITTI": "An earthy, clay-inspired fragrance with subtle mineral and fresh botanical notes.", "NATURE GIFT": "A nature-inspired fragrance blending fresh green, light floral and botanical-style notes.", "OCEAN BREEZE": "A breezy marine-inspired fragrance with cool aquatic notes and a fresh coastal character.", "ORANGE": "A juicy orange-inspired fragrance with sweet citrus zest and cheerful freshness.", "ORCHID": "An elegant orchid-inspired floral fragrance with soft exotic petals and a refined, delicate sweetness.", "PONDS": "A classic skincare-inspired fragrance with soft powdery florals and a fresh, elegant finish.", "PEACH": "A sweet peach-inspired fragrance with velvety, juicy fruit notes and a delicate soft finish.", "PEARS": "A transparent-soap-inspired fragrance with fresh, light fruity notes and a familiar clean-soap character.", "PAPAYA": "A tropical papaya-inspired fragrance with mellow fruity sweetness and a sunny, fresh feel.", "RAAT RANI": "A rich night-blooming-flower-inspired fragrance with deep, sweet and expressive floral notes.", "ROSE": "A timeless rose-inspired fragrance with fresh petals, delicate floral sweetness and a romantic aroma.", "RAJANIGANDHA": "A fragrant tuberose-inspired floral scent with lush white-flower notes and a classic Indian floral character.", "SANDALWOOD": "A smooth sandalwood-inspired fragrance with warm woody depth and a soft, calming finish.", "STRAWBERRY": "A bright strawberry-inspired aroma with juicy berry sweetness and a playful fruity character.", "SANTOOR NEW SANDAL": "A fresh sandal-soap-inspired fragrance combining warm woody notes with a clean, modern finish.", "SAFFRON SW": "A rich saffron-inspired fragrance with warm, elegant and subtly sweet aromatic notes.", "TEA TREE": "A crisp tea-tree-inspired scent with green herbal freshness and a sharp, clean character.", "TRENDY": "A stylish contemporary fragrance with fresh, lively and versatile perfume-style notes.", "VANILLA": "A smooth vanilla-inspired fragrance with creamy sweetness and a cozy, warm finish.", "WATERMELON": "A juicy watermelon-inspired aroma with refreshing watery fruit notes and a sweet summer feel.", "NEEM TULSI": "A botanical neem-and-tulsi-inspired scent with leafy green, herbal and fresh aromatic notes.", "RED WINE": "A sophisticated red-wine-inspired fragrance with dark fruity notes and a rich, mellow character.", "GUAVA": "A ripe guava-inspired fragrance with lush tropical fruit sweetness and a fresh, tangy twist."};
const hisaOriginalOpenFragrance = window.openFragrance;
window.openFragrance = function(i){
  hisaOriginalOpenFragrance(i);
  const name = fragranceNames[i];
  const target = document.getElementById("fragDetailDesc");
  if(target && HISA_FRAGRANCE_DESCRIPTIONS[name]) target.textContent = HISA_FRAGRANCE_DESCRIPTIONS[name] + " Suitable for exploring fragrance options in handmade soap products. Fragrance character is descriptive; test compatibility and dosage in your own formula.";
};
;

/* One shared checkout for Soap Base, Liquids, Fragrance, Herbal, Cream and Wax.
   Existing combined-cart submit handler calculates a single WhatsApp order. */
(function(){
 function enhance(){
  const summary=document.getElementById('cartSummary');
  if(!summary || document.getElementById('hisaSharedCartNote'))return;
  const note=document.createElement('div');note.id='hisaSharedCartNote';note.className='hisa-shared-cart-note';
  note.textContent='After tapping Place Order on WhatsApp, your cart is cleared on this device. Please press Send in WhatsApp to submit your request. ONE SHARED CART: Soap Bases + Shampoo + Face Wash + Body Wash + Fragrances + Herbal Powders + Creams + Waxes. All items go in one WhatsApp order. Shipping is added where calculable; price-on-request items need confirmation.';
  summary.insertAdjacentElement('afterend',note);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enhance);else enhance();
})();
;
