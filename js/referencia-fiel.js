(()=>{'use strict';
const money=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const configs=[{key:'bronze',name:'Bronze',unit:49.70},{key:'prata',name:'Prata',unit:79.90},{key:'ouro',name:'Ouro',unit:99.90}];
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
function setupQuantities(){document.querySelectorAll('#planos .plan').forEach((card,i)=>{const c=configs[i];if(!c||card.querySelector('.qty-ref'))return;const pricebox=card.querySelector('.pricebox'),link=card.querySelector('a.btn');if(!pricebox||!link)return;
const wrapper=document.createElement('div');wrapper.className='qty-ref';wrapper.innerHTML='<div class="qty-ref-head"><strong>Escolha quantas caixas</strong><small>Leve mais, pague menos</small></div><div class="qty-ref-grid">'+[1,2,3].map(q=>{const discount=q===2?.35:q===3?.45:0;return `<button class="qty-ref-option" type="button" data-qty="${q}" aria-pressed="false">${q>1?`<span class="qty-ref-tag">${Math.round(discount*100)}% OFF</span>`:''}<strong>${q} ${q===1?'caixa':'caixas'}</strong><span class="qty-ref-price">${money(round(c.unit*q*(1-discount)))}</span><small>${q===1?'à vista no Pix':'com desconto'}</small></button>`}).join('')+'</div><div class="qty-ref-summary" aria-live="polite"><div class="qty-ref-line"><span class="qty-ref-mult"></span><strong class="qty-ref-subtotal"></strong></div><div class="qty-ref-line discount"><span class="qty-ref-discount-label"></span><strong class="qty-ref-discount"></strong></div><div class="qty-ref-line total"><span>Você paga</span><strong class="qty-ref-total"></strong></div><p>Confira a quantidade e o valor no checkout antes de pagar.</p></div>';
pricebox.before(wrapper);const oldPrice=pricebox.querySelector('.price'),saving=pricebox.querySelector('.save');const oldLink=link.getAttribute('href');function select(q){const disc=q===2?.35:q===3?.45:0;const subtotal=round(c.unit*q),total=round(subtotal*(1-disc)),saved=round(subtotal-total);wrapper.querySelectorAll('.qty-ref-option').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.qty)===q)));wrapper.querySelector('.qty-ref-mult').textContent=`${q} × ${money(c.unit)}`;wrapper.querySelector('.qty-ref-subtotal').textContent=money(subtotal);wrapper.querySelector('.qty-ref-discount-label').textContent=`Desconto de ${Math.round(disc*100)}%`;wrapper.querySelector('.qty-ref-discount').textContent=`− ${money(saved)}`;wrapper.querySelector('.qty-ref-total').textContent=money(total);if(oldPrice)oldPrice.innerHTML='<sup>R$</sup>'+total.toFixed(2).replace('.',',').split(',')[0]+'<small>,'+total.toFixed(2).split('.')[1]+'</small>';if(saving)saving.innerHTML='Você economiza<b>'+money(saved)+'</b>';link.innerHTML=`Levar ${q} ${q===1?'caixa':'caixas'} • ${money(total)} →`;const url=new URL(oldLink,location.href);url.searchParams.set('quantidade',String(q));url.searchParams.set('valor',total.toFixed(2));link.href=url.pathname+url.search+url.hash;}
wrapper.addEventListener('click',e=>{const b=e.target.closest('.qty-ref-option');if(b)select(Number(b.dataset.qty))});select(1);});}
function setupMedia(){const video=document.getElementById('vid'),play=document.getElementById('play');if(video){video.controls=true;video.playsInline=true;video.preload='metadata';const update=()=>{if(play)play.style.display=video.paused?'':'none'};play?.addEventListener('click',async e=>{e.preventDefault();try{await video.play()}catch(err){console.warn('Vídeo não iniciou',err)}});['play','pause','ended'].forEach(ev=>video.addEventListener(ev,update));update();}const track=document.getElementById('track'),prev=document.getElementById('prev'),next=document.getElementById('next');if(track){const advance=dir=>{const slide=track.querySelector('.slide');if(!slide)return;const step=slide.getBoundingClientRect().width+12;const max=track.scrollWidth-track.clientWidth;let pos=track.scrollLeft+dir*step;if(pos>max+5)pos=0;if(pos<0)pos=max;track.scrollTo({left:pos,behavior:'smooth'})};prev?.addEventListener('click',()=>advance(-1));next?.addEventListener('click',()=>advance(1));}}
function popup(){
 if(sessionStorage.getItem('bn-ref-seen'))return;
 const prizes=[['Smartphones','📱'],['Apple','🎧'],['JBL','🎵'],['Xiaomi','⌚'],['Stanley','🥤'],['Lakrata','✨'],['Arham','✨'],['Armaf','✨'],['Smartwatches','⌚'],['Games e TV','🎮']];
 const colors=['#ff7300','#141416','#ffd17a','#fff2d9','#ff7300','#141416','#ffd17a','#fff2d9','#ff7300','#141416'];
 const overlay=document.createElement('div');overlay.className='bn-ref-backdrop';
 overlay.innerHTML='<section class="bn-ref-modal" role="dialog" aria-modal="true" aria-label="Black November"><button class="bn-ref-close" type="button" aria-label="Fechar">×</button><div class="bn-ref-stage"></div></section>';
 const stage=overlay.querySelector('.bn-ref-stage');
 const close=()=>{overlay.remove();sessionStorage.setItem('bn-ref-seen','1');document.removeEventListener('keydown',escape)};
 const escape=e=>{if(e.key==='Escape')close()};document.addEventListener('keydown',escape);
 const action=(text,key)=>`<button class="bn-ref-action" type="button" data-action="${key}">${text}</button>`;
 const wheel=()=>{
  let paths='', labels='';const cx=200,cy=200,r=188;
  prizes.forEach(([name,emoji],i)=>{
   const start=(-90+i*36)*Math.PI/180,end=(-90+(i+1)*36)*Math.PI/180;
   const x1=cx+r*Math.cos(start),y1=cy+r*Math.sin(start),x2=cx+r*Math.cos(end),y2=cy+r*Math.sin(end);
   paths+=`<path d="M200 200 L${x1.toFixed(2)} ${y1.toFixed(2)} A188 188 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z" fill="${colors[i]}" stroke="#ffa733" stroke-width=".7"/>`;
   const mid=-90+(i+.5)*36;const rad=mid*Math.PI/180;
   const x=cx+125*Math.cos(rad),y=cy+125*Math.sin(rad);
   const rotation=mid+90;const ink=[1,5,9].includes(i)?'#fff':'#161416';
   labels+=`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rotation})"><text x="0" y="-12" text-anchor="middle" font-size="23">${emoji}</text><text x="0" y="13" fill="${ink}" text-anchor="middle" font-size="11" font-weight="800">${name}</text></g>`;
  });
  return `<div class="bn-ref-wheel-wrap"><div class="bn-ref-pointer"></div><svg class="bn-ref-wheel-svg" viewBox="0 0 400 400" role="img" aria-label="Roleta de prêmios: ${prizes.map(x=>x[0]).join(', ')}"><circle cx="200" cy="200" r="197" fill="#ffbb61"/><circle cx="200" cy="200" r="191" fill="#141416"/>${paths}${labels}<circle cx="200" cy="200" r="50" fill="#141416" stroke="#ffb35a" stroke-width="6"/><text x="200" y="194" fill="white" text-anchor="middle" font-weight="900" font-size="19">BLACK</text><text x="200" y="217" fill="#ff7800" text-anchor="middle" font-weight="900" font-size="17">NOVEMBER</text></svg></div>`;
 };
 const intro=()=>{overlay.querySelector('.bn-ref-modal').classList.add('bn-ref-intro');stage.innerHTML=`<span class="bn-ref-intro-pill">🟠 CHEGOU</span><img class="bn-ref-hero" src="images/hero-deveu.webp" alt="Produtos das caixas surpresa Deveu Perdeu"><span class="bn-ref-black-label">BLACK NOVEMBER</span><h2 class="bn-ref-intro-title">BLACK<br><em>NOVEMBER</em></h2><p class="bn-ref-intro-description">Caixas surpresa com até 70% OFF e frete grátis. Ofertas por tempo limitado!</p>${action('Aproveitar Black November','start')}`;};
 const spin=()=>{overlay.querySelector('.bn-ref-modal').classList.remove('bn-ref-intro');stage.innerHTML=`<span class="bn-ref-pill">🟠 GIROU, GANHOU</span><h2>Promoção <em>Black November</em>, Girou Ganhou!</h2><p>Eletrônicos, perfumes árabes, garrafas Stanley, fones JBL e Xiaomi e smartwatches de várias marcas. Confira as condições da promoção antes de participar.</p>${wheel()}${action('Girar a roleta','spin')}<p class="bn-ref-disclaimer">Demonstração visual: a roleta não concede nem garante prêmios.</p>`;};
 const result=(index,rotation)=>{stage.innerHTML=`<span class="bn-ref-pill">🟠 GIROU, GANHOU</span><h2>Resultado da <em>roleta</em></h2>${wheel()}<p>O ponteiro parou em <strong>${prizes[index][0]}</strong>. Resultado ilustrativo, sujeito às regras e validação da promoção.</p>${action('Ver caixas disponíveis','go')}`;const finalWheel=stage.querySelector('.bn-ref-wheel-svg');if(finalWheel)finalWheel.style.transform=`rotate(${rotation}deg)`;};
 overlay.querySelector('.bn-ref-close').addEventListener('click',close);
 overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
 stage.addEventListener('click',e=>{const key=e.target.closest('[data-action]')?.dataset.action;
  if(key==='start')spin();
  if(key==='spin'){const btn=stage.querySelector('[data-action="spin"]');if(btn.disabled)return;btn.disabled=true;btn.textContent='Girando...';const index=Math.floor(Math.random()*prizes.length);const wheelEl=stage.querySelector('.bn-ref-wheel-svg');const rotation=360*6-18-36*index;wheelEl.style.setProperty('--bn-rotation',rotation+'deg');wheelEl.classList.add('bn-ref-spinning');setTimeout(()=>{if(overlay.isConnected)result(index,rotation)},4200)}
  if(key==='go'){close();document.getElementById('planos')?.scrollIntoView({behavior:'smooth'})}
 });
 document.body.appendChild(overlay);intro();
}
function init(){setupQuantities();setupMedia();popup()};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
