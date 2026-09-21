/* CNFDNT OS landing: theme choice, scroll reveals, light parallax. No dependencies. */
(function(){
  const root=document.documentElement,toggle=document.getElementById('theme-toggle'),KEY='cnfdnt-landing-theme';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function apply(theme){
    root.dataset.theme=theme;
    document.querySelector('meta[name=theme-color]')?.setAttribute('content',theme==='dark'?'#06080d':'#f4f7fc');
    toggle?.setAttribute('aria-label',`Switch to ${theme==='dark'?'light':'dark'} mode`);
    document.querySelectorAll('img[data-dark][data-light]').forEach(img=>{const next=img.dataset[theme];if(img.getAttribute('src')!==next)img.setAttribute('src',next)});
  }
  let saved=null;try{saved=localStorage.getItem(KEY)}catch{}
  apply(saved||'dark');
  toggle?.addEventListener('click',()=>{const next=root.dataset.theme==='dark'?'light':'dark';apply(next);try{localStorage.setItem(KEY,next)}catch{}});

  // Scroll reveals.
  const items=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window&&!reduced){
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px',threshold:.08});
    items.forEach(el=>io.observe(el));
  }else items.forEach(el=>el.classList.add('in'));

  // Nav condenses after the hero.
  const nav=document.getElementById('nav');
  const onScroll=()=>nav?.classList.toggle('scrolled',scrollY>40);
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  // Light parallax on the hero devices, pointer only.
  const stage=document.querySelector('.hero-stage');
  if(stage&&!reduced&&matchMedia('(pointer:fine)').matches){
    const layers=[...stage.querySelectorAll('[data-parallax]')];
    let raf=0,mx=0,my=0;
    stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();mx=(e.clientX-r.left)/r.width-.5;my=(e.clientY-r.top)/r.height-.5;if(!raf)raf=requestAnimationFrame(()=>{raf=0;layers.forEach(l=>{const k=Number(l.dataset.parallax);l.style.transform=`translate(${mx*k}px,${my*k}px)`})})});
    stage.addEventListener('pointerleave',()=>layers.forEach(l=>l.style.transform=''));
  }
})();
