(()=>{
function init(){
 const video=document.getElementById('vid'),play=document.getElementById('play');
 if(video){
  video.controls=true;video.setAttribute('playsinline','');video.preload='metadata';
  const update=()=>{if(play){play.hidden=!video.paused;play.style.display=video.paused?'':'none';}};
  if(play){play.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();try{await video.play()}catch(err){video.controls=true;console.warn('Não foi possível iniciar o vídeo:',err)}});}
  video.addEventListener('play',update);video.addEventListener('pause',update);video.addEventListener('ended',update);video.addEventListener('error',()=>{if(play)play.style.display='none';console.error('Erro ao carregar o vídeo',video.error)});update();
 }
 const track=document.getElementById('track'),prev=document.getElementById('prev'),next=document.getElementById('next');
 if(track){
  const slides=[...track.querySelectorAll('.slide')];let auto=null;
  function advance(dir){if(!slides.length)return;const step=(slides[0].getBoundingClientRect().width||280)+12;const max=track.scrollWidth-track.clientWidth;const target=track.scrollLeft+dir*step;track.scrollTo({left:target>max-4&&dir>0?0:target<0&&dir<0?max:target,behavior:'smooth'});}
  // Replace earlier handlers by using capture and stopping propagation so each click advances only once.
  prev?.addEventListener('click',e=>{e.stopImmediatePropagation();advance(-1);restart()},{capture:true});
  next?.addEventListener('click',e=>{e.stopImmediatePropagation();advance(1);restart()},{capture:true});
  function stop(){if(auto)clearInterval(auto);auto=null}
  function start(){stop();if(slides.length>1&&!matchMedia('(prefers-reduced-motion: reduce)').matches)auto=setInterval(()=>{if(!document.hidden)advance(1)},4500)}
  function restart(){stop();start()}
  track.addEventListener('pointerdown',stop,{passive:true});track.addEventListener('pointerup',()=>setTimeout(start,2000),{passive:true});
  track.addEventListener('mouseenter',stop);track.addEventListener('mouseleave',start);
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());start();
 }
 // Prevent duplicate quantity UI in case scripts are re-executed.
 document.querySelectorAll('#planos .plan').forEach(card=>{
  const opts=card.querySelectorAll('.qty-choice');if(!opts.length)return;
  opts.forEach(btn=>{btn.style.pointerEvents='auto';btn.disabled=false;btn.setAttribute('type','button')});
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();