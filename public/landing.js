/* CNFDNT OS landing v3. Scroll-driven hero navigator, feature scroller, live hold-to-speak demo. No dependencies beyond the app's own visuals.js. */
import {startIntakeVisual} from '/visuals.js';

const root=document.documentElement,toggle=document.getElementById('theme-toggle'),KEY='cnfdnt-landing-theme';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Theme ----
function apply(theme){
  root.dataset.theme=theme;
  document.querySelector('meta[name=theme-color]')?.setAttribute('content',theme==='dark'?'#06080d':'#f4f7fc');
  toggle?.setAttribute('aria-label',`Switch to ${theme==='dark'?'light':'dark'} mode`);
  document.querySelectorAll('img[data-dark][data-light]').forEach(img=>{const next=img.dataset[theme];if(img.getAttribute('src')!==next)img.setAttribute('src',next)});
  setShot(activeShot);
}
let saved=null;try{saved=localStorage.getItem(KEY)}catch{}
toggle?.addEventListener('click',()=>{const next=root.dataset.theme==='dark'?'light':'dark';apply(next);try{localStorage.setItem(KEY,next)}catch{}});

// ---- Scroll reveals ----
const items=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window&&!reduced){
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px',threshold:.08});
  items.forEach(el=>io.observe(el));
}else items.forEach(el=>el.classList.add('in'));

// ---- Nav condenses after the hero ----
const nav=document.getElementById('nav');
const onNav=()=>nav?.classList.toggle('scrolled',scrollY>40);
addEventListener('scroll',onNav,{passive:true});onNav();

// ---- Hero: pinned orbit navigator driven by scroll ----
const pin=document.querySelector('.hero-pin'),navg=document.querySelector('[data-navigator]'),copy=document.querySelector('[data-hero-copy]');
let heroP=0;
function heroFrame(){
  if(!pin||!navg)return;
  const r=pin.getBoundingClientRect(),h=r.height-innerHeight;
  heroP=h>0?Math.min(1,Math.max(0,-r.top/h)):0;
  navg.style.setProperty('--p',heroP.toFixed(4));
  copy.style.opacity=String(1-Math.min(1,heroP*1.6));
  copy.style.transform=`translateY(${-heroP*60}px)`;
}
if(!reduced){addEventListener('scroll',heroFrame,{passive:true});addEventListener('resize',heroFrame);heroFrame()}
// Node hover pauses the orbit; pointer parallax on the whole navigator.
if(navg&&!reduced&&matchMedia('(pointer:fine)').matches){
  navg.addEventListener('pointermove',e=>{const r=navg.getBoundingClientRect();navg.style.setProperty('--mx',((e.clientX-r.left)/r.width-.5).toFixed(3));navg.style.setProperty('--my',((e.clientY-r.top)/r.height-.5).toFixed(3))});
  navg.addEventListener('pointerleave',()=>{navg.style.setProperty('--mx','0');navg.style.setProperty('--my','0')});
}

// ---- Feature scroller: device screenshots follow the active step ----
const shotDesktop=document.getElementById('shot-desktop'),shotPhone=document.getElementById('shot-phone'),steps=[...document.querySelectorAll('.step')];
let activeShot={shot:'home',phone:'home'};
function setShot(next){
  activeShot=next;const theme=root.dataset.theme||'dark';
  if(shotDesktop)shotDesktop.src=`/landing/desktop-${next.shot}-${next.shot==='intake'?'dark':theme}.webp`;
  if(shotPhone)shotPhone.src=`/landing/phone-${next.phone}-${next.phone==='intake'?'dark':theme}.webp`;
  steps.forEach(s=>s.classList.toggle('active',s.dataset.shot===next.shot));
}
if(steps.length){
  const so=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)setShot({shot:e.target.dataset.shot,phone:e.target.dataset.phone})})},{rootMargin:'-45% 0px -45% 0px',threshold:0});
  steps.forEach(s=>so.observe(s));
}
apply(saved||'dark');

// ---- Live hold-to-speak demo (same engine as the app) ----
const demo=document.getElementById('demo-intake'),hold=document.getElementById('hold'),status=document.getElementById('voice-status'),hint=document.querySelector('[data-demo-hint]'),stepEls=[...document.querySelectorAll('[data-step]')];
if(demo&&hold){
  let running=false,userTouched=false,autoTimer=0;
  const setStep=k=>stepEls.forEach(el=>el.classList.toggle('active',el.dataset.step===k));
  const start=()=>{hold.classList.add('recording');status.textContent='...LISTENING...';hint.textContent='Release when you are done';setStep('hold')};
  const stop=()=>{hold.classList.remove('recording');status.textContent='';hint.textContent='Captured. Choose its World.';setStep('release');clearTimeout(autoTimer);autoTimer=setTimeout(()=>{hint.textContent='Press and hold';setStep('idle')},2600)};
  hold.addEventListener('pointerdown',e=>{e.preventDefault();userTouched=true;start();hold.setPointerCapture?.(e.pointerId)});
  ['pointerup','pointercancel','pointerleave'].forEach(ev=>hold.addEventListener(ev,()=>{if(hold.classList.contains('recording'))stop()}));
  hold.addEventListener('keydown',e=>{if((e.key===' '||e.key==='Enter')&&!hold.classList.contains('recording')){e.preventDefault();userTouched=true;start()}});
  hold.addEventListener('keyup',e=>{if(e.key===' '||e.key==='Enter')stop()});
  // Auto-demo until the visitor touches it: hold for 2.4s every 7s while on screen.
  let loop=0;const autoDemo=()=>{if(userTouched||document.hidden)return;start();setTimeout(()=>{if(!userTouched)stop()},2400)};
  const vo=new IntersectionObserver(e=>{const on=e[0].isIntersecting;if(on&&!running){running=true;if(!reduced)startIntakeVisual();setStep('idle');if(!reduced){setTimeout(autoDemo,1200);loop=setInterval(autoDemo,7000)}}else if(!on&&running){running=false;clearInterval(loop)}},{threshold:.35});
  vo.observe(demo);
}

// ---- Billing toggle + checkout links. Paste Stripe Payment Link URLs here; empty entries fall back to the email request. ----
const CHECKOUT={solo:{monthly:'',yearly:''},operator:{monthly:'',yearly:''},setup:''};
let billing='yearly';
function applyBilling(){document.querySelectorAll('[data-billing]').forEach(b=>b.classList.toggle('active',b.dataset.billing===billing));document.querySelectorAll('.amount[data-monthly]').forEach(a=>a.textContent=a.dataset[billing]);document.querySelectorAll('.billed[data-monthly]').forEach(a=>a.textContent=a.dataset[billing]);document.querySelectorAll('[data-checkout]').forEach(a=>{const plan=a.dataset.checkout,link=plan==='setup'?CHECKOUT.setup:CHECKOUT[plan]?.[billing];if(link)a.href=link;else if(plan!=='setup')a.href=`mailto:cnfdnt.ai@gmail.com?subject=CNFDNT%20OS%20${plan[0].toUpperCase()+plan.slice(1)}%20(${billing})`})}
document.querySelectorAll('[data-billing]').forEach(b=>b.addEventListener('click',()=>{billing=b.dataset.billing;applyBilling()}));applyBilling();
