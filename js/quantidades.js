document.addEventListener('DOMContentLoaded',()=>{
 const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
 const configs=[{name:'bronze',unit:49.70,original:129.90,discounts:{1:0,2:.35,3:.45}},{name:'prata',unit:79.90,original:199,discounts:{1:0,2:.35,3:.45}},{name:'ouro',unit:99.90,original:299,discounts:{1:0,2:.35,3:.45}}];
 const cards=[...document.querySelectorAll('#planos .plan')];
 cards.forEach((card,i)=>{
  const config=configs[i];if(!config)return;
  const box=card.querySelector('.pricebox');const link=card.querySelector('a.btn');if(!box||!link)return;
  const area=document.createElement('div');area.className='qty-area';
  area.innerHTML='<div class="qty-heading"><span>Escolha quantas caixas</span><small>Leve mais, pague menos</small></div><div class="qty-options" role="group" aria-label="Quantidade de caixas '+config.name+'">'+[1,2,3].map(n=>'<button type="button" class="qty-choice" data-count="'+n+'" aria-pressed="false">'+(n>1?'<span class="qty-tag">'+(n===2?'35% OFF':'45% OFF')+'</span>':'')+'<b>'+n+' '+(n===1?'caixa':'caixas')+'</b><span class="qty-amount"></span><span class="qty-unit"></span></button>').join('')+'</div><div class="qty-summary" aria-live="polite"></div>';
  box.before(area);const choices=[...area.querySelectorAll('.qty-choice')],summary=area.querySelector('.qty-summary');
  function choose(n){
   const discount=config.discounts[n],total=+(config.unit*n*(1-discount)).toFixed(2),full=+(config.unit*n).toFixed(2),saved=+(full-total).toFixed(2);
   choices.forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.count===n)));
   const price=box.querySelector('.price'),old=box.querySelector('.old'),save=box.querySelector('.save');
   if(price)price.innerHTML='<sup>R$</sup>'+Math.floor(total)+'<small>,'+total.toFixed(2).split('.')[1]+'</small>';
   if(old)old.innerHTML='de <s>'+money(config.original*n)+'</s> por';
   if(save)save.innerHTML='Você economiza<b>'+money(config.original*n-total)+'</b>';
   choices.forEach(b=>{const k=+b.dataset.count,t=+(config.unit*k*(1-config.discounts[k])).toFixed(2);b.querySelector('.qty-amount').textContent=money(t);b.querySelector('.qty-unit').textContent=k===1?'à vista no Pix':'≈ '+money(t/k)+'/caixa'});
   summary.innerHTML='<div class="qty-line"><span>'+n+' × '+money(config.unit)+'</span><span>'+money(full)+'</span></div><div class="qty-line"><span>Desconto de '+Math.round(discount*100)+'%</span><span>− '+money(saved)+'</span></div><div class="qty-line qty-total"><span>Você paga</span><span>'+money(total)+'</span></div><div class="qty-note">'+(n===1?'Uma caixa selecionada.':'Economia de '+money(saved)+' ao levar '+n+' caixas.')+'</div>';
   const url=new URL(link.href,location.href);url.searchParams.set('quantidade',String(n));url.searchParams.set('valor',total.toFixed(2));link.href=url.toString();link.dataset.quantidade=n;
   link.firstChild.textContent=n===1?'Quero a '+config.name.charAt(0).toUpperCase()+config.name.slice(1)+' ':'Levar '+n+' caixas - '+money(total)+' ';
  }
  choices.forEach(b=>b.addEventListener('click',()=>choose(+b.dataset.count)));
  choose(1);
 });
 // The popup's selection link leads to the quantity cards; do not imply a prize is awarded without validation.
 const observer=new MutationObserver(()=>{const win=document.querySelector('.bn-win');if(!win||win.dataset.qtyReady)return;win.dataset.qtyReady='1';const a=win.querySelector('a[href="#planos"]');if(a)a.textContent='Escolher 1, 2 ou 3 caixas';});observer.observe(document.body,{childList:true,subtree:true});
});