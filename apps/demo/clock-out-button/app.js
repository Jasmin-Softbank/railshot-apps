'use strict';
const $=id=>document.getElementById(id);
const hit=$('hit'),face=$('face'),counter=$('count'),particles=$('particles');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const formatter=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
let attempts=0,escaped=false,bounce,countAnimation;
function timeParts(date=new Date()){return Object.fromEntries(formatter.formatToParts(date).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));}
function isOpen(date=new Date()){const p=timeParts(date);return p.hour==='18'&&p.minute==='00'&&Number(p.second)<10;}
function update(){const date=new Date(),p=timeParts(date);$('hours').textContent=p.hour;$('minutes').textContent=p.minute;$('seconds').textContent=p.second;$('clock').dateTime=date.toISOString();document.body.classList.toggle('available',isOpen(date)&&!escaped);}
function floatPlus(){const plus=document.createElement('span');plus.className='plus';plus.textContent='+1';particles.append(plus);const x=((attempts-1)%5-2)*42;plus.style.marginLeft=x+'px';if(particles.children.length>32)particles.firstElementChild.remove();if(reduced){plus.style.transform='translate(-50%,-48px)';setTimeout(()=>plus.remove(),650);return;}const animation=plus.animate([{transform:'translate(-50%,0) scale(.7)',opacity:0},{transform:'translate(-50%,-26px) scale(1.12)',opacity:1,offset:.16},{transform:'translate(-50%,-65px) scale(1)',opacity:1,offset:.6},{transform:'translate(-50%,-125px) scale(.94)',opacity:0}],{duration:950,easing:'cubic-bezier(.15,.65,.3,1)',fill:'forwards'});animation.onfinish=()=>plus.remove();}
function attempt(){if(escaped)return {status:'escaped',attempts};attempts++;counter.textContent=attempts.toLocaleString('ko-KR');floatPlus();if(!reduced){bounce?.cancel();bounce=face.animate([{transform:'translateY(-2px)'},{transform:'translateY(-16px)',offset:.55},{transform:'translateY(-12px)'}],{duration:230,easing:'ease-out'});countAnimation?.cancel();countAnimation=counter.animate([{transform:'scale(1.2)',color:'#242428'},{transform:'scale(1)',color:'#7e7e85'}],{duration:240});}if(isOpen()){escaped=true;document.body.classList.add('done');document.body.classList.remove('available');$('hitLabel').textContent='퇴근 완료';$('status').textContent='퇴근 완료';bounce?.cancel();hit.disabled=true;}return {status:escaped?'escaped':'locked',attempts};}
function release(){hit.classList.remove('pressed');}
 hit.addEventListener('pointerdown',e=>{if(e.button!==0||escaped)return;bounce?.cancel();hit.classList.add('pressed');hit.setPointerCapture(e.pointerId);});
for(const event of ['pointerup','pointercancel','lostpointercapture','blur'])hit.addEventListener(event,release);
hit.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter')hit.classList.add('pressed');});
hit.addEventListener('keyup',release);
hit.addEventListener('click',()=>{release();attempt();});
document.addEventListener('visibilitychange',()=>{release();update();});
update();setInterval(update,200);
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'attempt_clock_out',title:'퇴근 시도',description:'퇴근 버튼을 한 번 누릅니다. 한국 시간 18:00:00부터 18:00:10 전까지 퇴근할 수 있습니다.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw new Error('입력은 빈 객체여야 합니다.');return attempt();}})).catch(()=>{});}catch{}}
