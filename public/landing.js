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

  // Billing toggle + checkout links. Paste Stripe Payment Link URLs here when they exist; empty entries fall back to the email request.
  const CHECKOUT={solo:{monthly:'',yearly:''},operator:{monthly:'',yearly:''},setup:''};
  let billing='monthly';
  function applyBilling(){document.querySelectorAll('[data-billing]').forEach(b=>b.classList.toggle('active',b.dataset.billing===billing));document.querySelectorAll('.amount[data-monthly]').forEach(a=>a.textContent=a.dataset[billing]);document.querySelectorAll('.billed[data-monthly]').forEach(a=>a.textContent=a.dataset[billing]);document.querySelectorAll('[data-checkout]').forEach(a=>{const plan=a.dataset.checkout,link=plan==='setup'?CHECKOUT.setup:CHECKOUT[plan]?.[billing];if(link)a.href=link;else if(plan!=='setup')a.href=`mailto:cnfdnt.ai@gmail.com?subject=CNFDNT%20OS%20${plan[0].toUpperCase()+plan.slice(1)}%20(${billing})`})}
  document.querySelectorAll('[data-billing]').forEach(b=>b.addEventListener('click',()=>{billing=b.dataset.billing;applyBilling()}));applyBilling();

  // Dala-style constellation: a side-profile brain of tiny coloured triangles, drifting on a black stage.
  const canvas=document.getElementById('constellation');
  if(canvas&&!reduced){
    const ctx=canvas.getContext('2d');const outline=[[.62,-.18],[.78,.05],[.8,.3],[.68,.52],[.45,.66],[.15,.74],[-.2,.72],[-.52,.62],[-.76,.42],[-.86,.15],[-.84,-.12],[-.72,-.32],[-.78,-.5],[-.62,-.66],[-.4,-.7],[-.22,-.6],[-.16,-.46],[-.1,-.55],[-.02,-.8],[.12,-.82],[.14,-.62],[.08,-.48],[.2,-.42],[.42,-.42],[.6,-.32]];
    const shape=new Path2D();outline.forEach(([x,y],i)=>{const [nx,ny]=outline[(i+1)%outline.length];if(i===0)shape.moveTo((x+nx)/2,(y+ny)/2);else shape.quadraticCurveTo(x,y,(x+nx)/2,(y+ny)/2)});shape.quadraticCurveTo(outline[0][0],outline[0][1],(outline[0][0]+outline[1][0])/2,(outline[0][1]+outline[1][1])/2);
    const palette=['#8052ff','#ffb829','#15846e','#4aa8ff','#e06cff','#b487ff','#5b93ff'];let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
    const pts=[];const total=innerWidth<820?900:2200;while(pts.length<total){const x=rnd()*2-1,y=rnd()*1.7-.9;if(ctx.isPointInPath(shape,x,y))pts.push({x,y,z:rnd()*2-1,c:palette[Math.floor(rnd()*palette.length)],s:.9+rnd()*1.6,ph:rnd()*6.28,sp:.4+rnd()*.8})}
    outline.forEach(([x,y],i)=>{const [nx,ny]=outline[(i+1)%outline.length];for(let k=0;k<10;k++){const t=k/10;pts.push({x:x+(nx-x)*t,y:y+(ny-y)*t,z:.2,c:'#ffffff',s:1.2,ph:rnd()*6.28,sp:1,edge:true})}});
    const ambient=[];for(let n=0;n<160;n++)ambient.push({x:rnd(),y:rnd(),c:palette[n%palette.length],s:1+rnd()*2,ph:rnd()*6.28,dx:(rnd()-.5)*.02,dy:(rnd()-.5)*.02});
    let w=0,h=0,mx=0,my=0,t=0,last=0;const dpr=Math.min(devicePixelRatio||1,2);
    const resize=()=>{const r=canvas.getBoundingClientRect();w=r.width;h=r.height;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)};new ResizeObserver(resize).observe(canvas);resize();
    addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5)},{passive:true});
    const tri=(x,y,s,rot)=>{ctx.beginPath();for(let i=0;i<3;i++){const a=rot+i*2.094;ctx[i?'lineTo':'moveTo'](x+Math.cos(a)*s,y+Math.sin(a)*s)}ctx.closePath()};
    let visible=true;new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(canvas);
    function frame(ts){requestAnimationFrame(frame);if(!visible||ts-last<28)return;const dt=Math.min(50,ts-last||16);last=ts;t+=dt*.001;ctx.clearRect(0,0,w,h);
      const cx=w*.5+mx*-18,cy=h*.5+my*-12,scale=Math.min(w*.46,h*.5),tilt=Math.sin(t*.15)*.12+mx*.25;
      ctx.lineWidth=1;for(const a of ambient){a.x=(a.x+a.dx*dt*.001+1)%1;a.y=(a.y+a.dy*dt*.001+1)%1;const g=.25+.35*Math.sin(t*1.2+a.ph);ctx.strokeStyle=a.c;ctx.globalAlpha=g*.5;tri(a.x*w,a.y*h,a.s+1,t*.3+a.ph);ctx.stroke()}
      for(const p of pts){const x=p.x*Math.cos(tilt)+p.z*.08,depth=(p.z+1)/2,px=cx+x*scale,py=cy-p.y*scale-Math.sin(t*.5+p.ph)*2,tw=.45+.55*Math.sin(t*p.sp*2+p.ph);ctx.strokeStyle=p.c;ctx.globalAlpha=p.edge?.55+.35*tw:(.5+depth*.5)*tw;tri(px,py,p.s*(1+depth*.7),t*.2+p.ph);ctx.stroke()}
      ctx.globalAlpha=1;
      // a few bright sparks travelling the outline
      for(let k=0;k<6;k++){const i=Math.floor(((t*.06+k/6)%1)*outline.length),[x,y]=outline[i],[nx,ny]=outline[(i+1)%outline.length],f=((t*.06+k/6)%1)*outline.length%1,sx=cx+(x+(nx-x)*f)*Math.cos(tilt)*scale,sy=cy-(y+(ny-y)*f)*scale;ctx.shadowBlur=18;ctx.shadowColor='#8052ff';ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(sx,sy,2,0,7);ctx.fill();ctx.shadowBlur=0}
    }
    requestAnimationFrame(frame);
  }
})();
