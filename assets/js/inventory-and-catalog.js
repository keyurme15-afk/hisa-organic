function fragranceStock(i){const v=localStorage.getItem('hisa_fragrance_stock_'+i);return v===null?null:Math.max(0,Number(v)||0)}
function fragranceStockBadge(i){const n=fragranceStock(i);return n===null?"<span style='color:#667'>Availability: Please enquire</span>":n===0?"<strong style='color:#b91c1c'>● Out of Stock</strong>":"<strong style='color:#087b43'>● In Stock: "+n+" units</strong>"}
function renderStockAdmin(){const el=document.getElementById('stockAdminRows');if(!el)return;el.innerHTML='<h3 style="grid-column:1/-1">Soap Bases — Stock in kg</h3>'+products.map(p=>`<label style="display:block;font-weight:600">${p.name} Soap Base <input type="number" min="0" step="1" data-stock-id="${p.id}" value="${stockQty(p.id)===null?'':stockQty(p.id)}" placeholder="Stock kg" style="width:100%;padding:10px;border:1px solid #cbd5ce;border-radius:8px;margin-top:6px"></label>`).join('')+'<h3 style="grid-column:1/-1">Fragrance Oils — Stock in units</h3>'+fragranceNames.map((name,i)=>`<label style="display:block;font-weight:600">${name} Fragrance <input type="number" min="0" step="1" data-fragrance-stock-id="${i}" value="${fragranceStock(i)===null?'':fragranceStock(i)}" placeholder="Available units" style="width:100%;padding:10px;border:1px solid #cbd5ce;border-radius:8px;margin-top:6px"></label>`).join('')}
function saveAllStock(){document.querySelectorAll('[data-stock-id]').forEach(el=>{if(el.value.trim()==='')localStorage.removeItem('hisa_stock_'+el.dataset.stockId);else localStorage.setItem('hisa_stock_'+el.dataset.stockId,String(Math.max(0,Math.floor(Number(el.value)||0))))});document.querySelectorAll('[data-fragrance-stock-id]').forEach(el=>{const key='hisa_fragrance_stock_'+el.dataset.fragranceStockId;if(el.value.trim()==='')localStorage.removeItem(key);else localStorage.setItem(key,String(Math.max(0,Math.floor(Number(el.value)||0))))});renderProducts();renderFragrances();updateCart();alert('All product stock saved in this browser (demo only).')}const originalRenderFragrances=renderFragrances;
renderFragrances=function(){originalRenderFragrances();document.querySelectorAll('#fragranceGrid .frag-card').forEach(card=>{const name=card.querySelector('h3')?.textContent;const i=fragranceNames.indexOf(name);if(i<0)return;const p=document.createElement('p');p.innerHTML=fragranceStockBadge(i);card.querySelector('button').before(p);if(fragranceStock(i)===0){const btn=card.querySelector('button');btn.disabled=true;btn.textContent='Out of Stock';btn.style.opacity='.5';btn.style.cursor='not-allowed'}})};
const originalOpenFragrance=openFragrance;
openFragrance=function(i){originalOpenFragrance(i);let el=document.getElementById('fragranceDetailStock');if(!el){el=document.createElement('p');el.id='fragranceDetailStock';document.getElementById('fragDetailDesc').after(el)}el.innerHTML=fragranceStockBadge(i)};
const originalEnquireFragrance=enquireFragrance;
enquireFragrance=function(i){if(fragranceStock(i)===0){alert('This fragrance is currently out of stock');return}originalEnquireFragrance(i)};
const originalOpenProduct=openProduct;openProduct=function(id){originalOpenProduct(id);let el=document.getElementById('detailStockStatus');if(!el){el=document.createElement('p');el.id='detailStockStatus';document.getElementById('detailPrice').after(el)}el.innerHTML=stockBadge(id)};
;

// Inventory tools enhance the existing local-only demo; no server sync is implied.
function inventoryRows(){return Array.from(document.querySelectorAll('#stockAdminRows label')).filter(el=>el.querySelector('input[data-stock-id],input[data-fragrance-stock-id]'))}
function inventoryValue(el){const raw=el.querySelector('input').value.trim();return raw===''?null:Math.max(0,Math.floor(Number(raw)||0))}
function refreshStockMetrics(){const rows=inventoryRows(),values=rows.map(inventoryValue);const put=(id,n)=>{const el=document.getElementById(id);if(el)el.textContent=n};put('stTotal',rows.length);put('stReady',values.filter(n=>n!==null&&n>0).length);put('stLow',values.filter(n=>n!==null&&n>0&&n<=10).length);put('stOut',values.filter(n=>n===0).length)}
function filterStockRows(){const q=(document.getElementById('stockSearch')?.value||'').toLowerCase().trim(),filter=document.getElementById('stockFilter')?.value||'all';inventoryRows().forEach(label=>{const n=inventoryValue(label),match=label.textContent.toLowerCase().includes(q)&&(filter==='all'||filter==='low'&&n!==null&&n>0&&n<=10||filter==='out'&&n===0||filter==='unset'&&n===null);label.classList.toggle('stock-hidden',!match)});refreshStockMetrics()}
function exportStockCSV(){const lines=[['type','id','product','quantity','unit']];inventoryRows().forEach(label=>{const input=label.querySelector('input'),isSoap=input.hasAttribute('data-stock-id'),id=isSoap?input.dataset.stockId:input.dataset.fragranceStockId;lines.push([isSoap?'soap':'fragrance',id,label.textContent.trim(),input.value.trim(),isSoap?'kg':'units'])});const csv=lines.map(line=>line.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(',')).join('\r\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));a.download='Hisa_Organic_Inventory_Backup.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function parseCSVLine(line){const result=[];let word='',quoted=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'){if(quoted&&line[i+1]==='"'){word+='"';i++}else quoted=!quoted}else if(c===','&&!quoted){result.push(word);word=''}else word+=c}result.push(word);return result}
async function importStockCSV(file){if(!file)return;const text=await file.text(),lines=text.replace(/^\ufeff/,'').split(/\r?\n/).filter(Boolean);if(lines.length<2){alert('CSV file is empty.');return}let count=0;for(const line of lines.slice(1)){const [type,id,,quantity]=parseCSVLine(line);if(!/^(soap|fragrance)$/.test(type)||!/^[0-9]+$/.test(id))continue;if(quantity!==''&&(!/^\d+$/.test(quantity)||Number(quantity)>100000000))continue;const selector=type==='soap'?'[data-stock-id="'+id+'"]':'[data-fragrance-stock-id="'+id+'"]';const input=document.querySelector(selector);if(input){input.value=quantity;count++}}filterStockRows();alert(count+' product stock values loaded. Click Save Stock to keep changes on this device.')}
const _hisaStockRender=renderStockAdmin;renderStockAdmin=function(){_hisaStockRender();filterStockRows();document.querySelectorAll('#stockAdminRows input').forEach(el=>el.addEventListener('input',refreshStockMetrics))};
const _hisaStockSave=saveAllStock;saveAllStock=function(){_hisaStockSave();filterStockRows()};
window.addEventListener('DOMContentLoaded',()=>{if(document.getElementById('stockAdminRows')){renderStockAdmin();filterStockRows()}});
;

(function(){const section=document.getElementById('liquidSix');if(!section)return;section.addEventListener('input',function(e){if(!e.target.matches('.liquid-order-qty'))return;const card=e.target.closest('.liquid-six-card');const q=Math.max(1,Math.floor(Number(e.target.value)||1));card.querySelector('.liquid-order-total').textContent='Total: ₹'+(q*120).toLocaleString('en-IN');});section.addEventListener('click',function(e){const btn=e.target.closest('.liquid-buy-btn');if(!btn)return;const card=btn.closest('.liquid-six-card');const q=Math.max(1,Math.floor(Number(card.querySelector('.liquid-order-qty').value)||1));const name=btn.dataset.product;addLiquid(name,q);});})();
;

document.addEventListener('click',function(e){
 const btn=e.target.closest('#liquidSix .hisa-qty-minus, #liquidSix .hisa-qty-plus');
 if(!btn)return;
 const input=btn.parentElement.querySelector('.liquid-order-qty');
 if(!input)return;
 const old=Math.max(1,parseInt(input.value,10)||1);
 const next=btn.classList.contains('hisa-qty-plus')?old+1:Math.max(1,old-1);
 input.value=next;
 input.dispatchEvent(new Event('input',{bubbles:true}));
 input.dispatchEvent(new Event('change',{bubbles:true}));
});
;
