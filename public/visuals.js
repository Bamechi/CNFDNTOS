/** Small, local visual system. Motion pauses offscreen and respects reduced-motion. */
export const mark = (cls='') => `<svg class="brand-symbol ori-mark ${cls}" viewBox="0 0 60 60" fill="none" aria-hidden="true"><circle cx="30" cy="30" r="22" stroke="currentColor" stroke-width="7"/><circle cx="30" cy="30" r="5.5" fill="var(--ori-gold,#7c7cff)"/></svg>`;
export const oriWordmark = (cls='') => `<svg class="ori-wordmark ${cls}" viewBox="0 0 128 48" aria-label="Orí" role="img"><defs><clipPath id="ori-acc"><rect x="60" y="-6" width="70" height="21"/></clipPath></defs><circle cx="22" cy="25" r="17" stroke="currentColor" stroke-width="5.5" fill="none"/><circle cx="22" cy="25" r="4.2" fill="var(--ori-gold,#7c7cff)"/><text x="46" y="40" font-family="Manrope,'Helvetica Neue',sans-serif" font-weight="500" font-size="41" letter-spacing="-1.5" fill="currentColor">rı</text><text x="46" y="40" font-family="Manrope,'Helvetica Neue',sans-serif" font-weight="500" font-size="41" letter-spacing="-1.5" fill="var(--ori-gold,#7c7cff)" clip-path="url(#ori-acc)">rí</text></svg>`;
const paths={
worlds:'<circle cx="12" cy="12" r="5.6"/><ellipse cx="12" cy="12" rx="10.4" ry="3.5" transform="rotate(-24 12 12)" opacity=".62"/>',
rocks:'<path d="M4 17.5 7.5 9.2 11 12l3.6-6.5L20 17.5H4Z"/><path d="M2.5 20.5h19" opacity=".6"/>',
projects:'<path d="m12 3.2 8.8 4.8L12 12.8 3.2 8 12 3.2Z"/><path d="m3.2 12 8.8 4.8L20.8 12M3.2 16l8.8 4.8L20.8 16" opacity=".6"/>',
todos:'<circle cx="12" cy="12" r="8.8"/><path d="m8.2 12.4 2.6 2.6 5.2-5.6"/>',
issues:'<circle cx="12" cy="12" r="8.8"/><path d="M12 7.6v5.4"/><circle cx="12" cy="16.4" r=".75" fill="currentColor" stroke="none"/>',
timeline:'<rect x="3.6" y="5" width="16.8" height="16" rx="3.4"/><path d="M8 3v4m8-4v4M3.6 10.2h16.8"/><circle cx="8.5" cy="14.6" r=".8" fill="currentColor" stroke="none"/><circle cx="12" cy="14.6" r=".8" fill="currentColor" stroke="none"/><circle cx="15.5" cy="14.6" r=".8" fill="currentColor" stroke="none"/><circle cx="8.5" cy="17.8" r=".8" fill="currentColor" stroke="none"/><circle cx="12" cy="17.8" r=".8" fill="currentColor" stroke="none"/>',
knowledge:'<path d="M4.2 5.6A2.6 2.6 0 0 1 6.8 3H19.8v15.2H6.8a2.6 2.6 0 0 0-2.6 2.6V5.6Z"/><path d="M4.2 20.8a2.6 2.6 0 0 1 2.6-2.6h13v2.6H6.8"/><path d="M9 7.6h6.6M9 11h4.4" opacity=".6"/>',
output:'<path d="M2.5 12h3.2l2.3-6.5 3.4 13 3.2-9.5 2 3h5"/><circle cx="21.2" cy="12" r=".9" fill="currentColor" stroke="none"/>',
capture:'<circle cx="12" cy="12" r="8.8"/><path d="M12 8.2v7.6M8.2 12h7.6"/>',
archive:'<path d="M3.6 7.2h16.8v3.2H3.6zM5.2 10.4v8.6a2 2 0 0 0 2 2h9.6a2 2 0 0 0 2-2v-8.6"/><path d="M9.8 14h4.4"/>',
settings:'<circle cx="12" cy="12" r="3.1"/><path d="m12 2.9 1.55 1.85 2.35-.7.8 2.3 2.3.8-.7 2.35L20.15 12l-1.85 1.5.7 2.35-2.3.8-.8 2.3-2.35-.7L12 21.1l-1.55-1.85-2.35.7-.8-2.3-2.3-.8.7-2.35L3.85 12l1.85-1.5-.7-2.35 2.3-.8.8-2.3 2.35.7L12 2.9Z"/>',
sun:'<circle cx="12" cy="12" r="3.9"/><path d="M12 2.2v2.6m0 14.4v2.6M2.2 12h2.6m14.4 0h2.6M5.1 5.1l1.85 1.85m10.1 10.1 1.85 1.85M5.1 18.9l1.85-1.85m10.1-10.1 1.85-1.85"/>',
moon:'<path d="M19.8 14.6A8.2 8.2 0 0 1 9.4 4.2a8.6 8.6 0 1 0 10.4 10.4Z"/>',
speaker:'<path d="M4 9.4h3.4L12 5.4v13.2l-4.6-4H4V9.4Z"/><path d="M15.4 9.2a4.2 4.2 0 0 1 0 5.6M18.3 6.6a8 8 0 0 1 0 10.8" opacity=".7"/>',
bell:'<path d="M6 16.6h12l-1.5-2.3v-4.1a4.5 4.5 0 0 0-9 0v4.1L6 16.6Z"/><path d="M10.1 19.4a1.9 1.9 0 0 0 3.8 0M12 3.2v1.6"/>',
search:'<circle cx="10.6" cy="10.6" r="6.6"/><path d="m15.6 15.6 5 5"/>',
star:'<path d="m12 2.6 2.9 6 6.5.9-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9 2.9-6Z"/>',
arrow:'<path d="m9 5 7 7-7 7"/>',
edit:'<path d="M4 20h4.5L19 9.5a2.1 2.1 0 0 0-3-3L5.5 17 4 20Z"/><path d="m14 8.5 3 3"/>',
mvp:'<circle cx="5" cy="10" r="1.8" fill="currentColor" stroke="none"/><circle cx="12" cy="5.5" r="1.8" fill="currentColor" stroke="none"/><circle cx="19" cy="10" r="1.8" fill="currentColor" stroke="none"/><path d="M5 10c2.5-3.2 4.8-4.5 7-4.5s4.5 1.3 7 4.5" opacity=".7"/><path d="M6 15.5h12M7.5 19.5h9"/>',
more:'<circle cx="5" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.1" fill="currentColor" stroke="none"/>'};
export const icon=name=>`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.worlds}</svg>`;
export function planet(tone=0,cls=''){return `<div class="planet ${cls}" style="--planet-hue:${tone}deg" aria-hidden="true"><img src="/assets/planet-sapphire.webp" alt="" draggable="false"><i class="planet-atmosphere"></i></div>`}
let disposeBrain=()=>{};
export function stopIntakeVisual(){disposeBrain();disposeBrain=()=>{}}
/** Voice intake: a low-opacity wireframe brain and tight signal rings behind the pill, and pulsating neural cells inside it. */
export function startIntakeVisual(){
  stopIntakeVisual();const canvas=document.querySelector('#brain'),button=document.querySelector('#hold'),energy=document.querySelector('#button-energy');if(!canvas||!button||!energy)return;
  const ctx=canvas.getContext('2d'),ec=energy.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame,last=0,width=0,height=0,ew=0,eh=0,time=0,level=0,disposed=false;
  // Side-profile brain: a hand-set silhouette (cerebrum, cerebellum, stem) filled with particles, sulci traced inside.
  const outline=[[.62,-.18],[.78,.05],[.8,.3],[.68,.52],[.45,.66],[.15,.74],[-.2,.72],[-.52,.62],[-.76,.42],[-.86,.15],[-.84,-.12],[-.72,-.32],[-.78,-.5],[-.62,-.66],[-.4,-.7],[-.22,-.6],[-.16,-.46],[-.1,-.55],[-.02,-.8],[.12,-.82],[.14,-.62],[.08,-.48],[.2,-.42],[.42,-.42],[.6,-.32]];
  const sulci=[[[.55,-.12],[.3,-.02],[0,.02],[-.3,.02],[-.55,.08]],[[.5,.3],[.3,.42],[.05,.4],[-.2,.48],[-.45,.4]],[[.6,.1],[.45,.2],[.3,.12],[.15,.22],[0,.16]],[[-.3,.25],[-.45,.15],[-.6,.28],[-.7,.15]],[[.1,-.3],[.3,-.25],[.45,-.3]],[[-.35,-.5],[-.5,-.45],[-.62,-.55],[-.45,-.62]],[[.2,.55],[.05,.5],[-.1,.58],[-.3,.55]]];
  const shape=new Path2D();outline.forEach(([x,y],i)=>{const [nx,ny]=outline[(i+1)%outline.length],mx=(x+nx)/2,my=(y+ny)/2;if(i===0)shape.moveTo(mx,my);else shape.quadraticCurveTo(x,y,mx,my)});shape.quadraticCurveTo(outline[0][0],outline[0][1],(outline[0][0]+outline[1][0])/2,(outline[0][1]+outline[1][1])/2);
  const probe=document.createElement('canvas').getContext('2d');
  const particles=[];const count=0;let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
  while(particles.length<count){const x=rnd()*2-1,y=rnd()*1.7-.9;if(probe.isPointInPath(shape,x,y))particles.push({x,y,z:rnd()*2-1,light:rnd(),kind:0})}
  false&&outline.forEach(([x,y],i)=>{const [nx,ny]=outline[(i+1)%outline.length];for(let k=0;k<9;k++){const t=k/9;particles.push({x:x+(nx-x)*t,y:y+(ny-y)*t,z:.3,light:.9,kind:1})}});
  false&&sulci.forEach(c=>{for(let i=0;i<c.length-1;i++)for(let k=0;k<7;k++){const t=k/7;particles.push({x:c[i][0]+(c[i+1][0]-c[i][0])*t,y:c[i][1]+(c[i+1][1]-c[i][1])*t,z:.5,light:.75,kind:2})}});
  const neighbours=[];for(let i=0;i<particles.length;i++){const a=particles[i];let best=[[1e9,-1],[1e9,-1]];for(let j=0;j<particles.length;j++){if(i===j)continue;const b=particles[j],d=(a.x-b.x)**2+(a.y-b.y)**2+(a.z-b.z)*.02;if(d<best[1][0]){best[1]=[d,j];best.sort((p,q)=>p[0]-q[0])}}neighbours.push(best.map(b=>b[1]).filter(j=>j>i))}
  const nodes=[];
  // Neural cells inside the pill: jittered seeds that pulse from the centre outward.
  const seeds=[];for(let r=0;r<3;r++)for(let c=0;c<15;c++){const j=(r*15+c);seeds.push({u:(c+.5)/15+((j*37%100)/100-.5)*.045,v:(r+.5)/3+((j*53%100)/100-.5)*.24,phase:(j*97%100)/100*6.28})}
  function resize(){const dpr=Math.min(devicePixelRatio||1,1.7);const cb=canvas.getBoundingClientRect();width=cb.width||innerWidth;height=cb.height||innerHeight;canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);const box=button.getBoundingClientRect();ew=box.width;eh=box.height;energy.width=ew*dpr;energy.height=eh*dpr;ec.setTransform(dpr,0,0,dpr,0,0)}
  const observer=new ResizeObserver(resize);observer.observe(button);resize();
  function draw(ts){if(disposed)return;frame=requestAnimationFrame(draw);if(document.hidden||ts-last<30)return;const dt=Math.min(60,ts-last||33);last=ts;if(!reduced.matches)time+=dt*.001;const active=button.classList.contains('recording');level+=(Number(active)-level)*.07;ctx.clearRect(0,0,width,height);ec.clearRect(0,0,ew,eh);
    const box=button.getBoundingClientRect(),cb=canvas.getBoundingClientRect(),cx=box.left-cb.left+ew/2,cy=box.top-cb.top+eh/2,scale=Math.min(width*.34,height*.44,440),t=time*.09,pulse=.5+.5*Math.sin(time*1.6);
    // Soft blue halo behind the pill.
    const halo=ctx.createRadialGradient(cx,cy-eh*.3,eh*.3,cx,cy-eh*.3,scale*.8);halo.addColorStop(0,`rgba(58,112,255,${.16+level*.22+pulse*.05})`);halo.addColorStop(.45,`rgba(46,84,220,${.06+level*.08})`);halo.addColorStop(1,'transparent');ctx.fillStyle=halo;ctx.fillRect(0,0,width,height);
    // Wireframe brain, always present at low opacity; coheres while listening.
    const phone=width<700,bx=cx,by=phone?cy-eh*1.75:cy-eh*.42,bs=phone?Math.min(width*.44,scale*.9):scale*.92,dot=.3+level*.45,line=.13+level*.28,tilt=Math.sin(time*.18)*.08,breathe=1+Math.sin(time*.9)*.012,projected=[];
    for(const p of particles){const depth=(p.z+1)/2;projected.push({x:bx+(p.x*Math.cos(tilt)+p.z*.06)*bs*breathe,y:by-(p.y*breathe+Math.sin(time*.3)*.01)*bs,depth,light:p.light,kind:p.kind})}
    ctx.lineWidth=.6;for(let i=0;i<projected.length;i++){const a=projected[i];for(const j of neighbours[i]){const b=projected[j];ctx.strokeStyle=`rgba(${a.kind?120:72},${a.kind?170:132},255,${line*(a.kind?1.3:.45+a.depth*.55)})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}
    for(const p of projected){const bright=p.kind===1?1.35:p.kind===2?1.15:.4+p.depth*.6;ctx.fillStyle=`rgba(${100+p.light*60|0},${160+p.light*60|0},255,${Math.min(1,dot*bright)})`;ctx.beginPath();ctx.arc(p.x,p.y,p.kind?1.1:.7+p.depth*.8,0,7);ctx.fill()}
    for(const n of nodes){const p=projected[n.i],glow=.5+.5*Math.sin(time*1.3+n.phase);ctx.shadowBlur=10+level*8;ctx.shadowColor='#5c9cff';ctx.fillStyle=`rgba(190,222,255,${(.3+level*.55)*glow})`;ctx.beginPath();ctx.arc(p.x,p.y,1.5+glow*1.1,0,7);ctx.fill();ctx.shadowBlur=0}
    // Signal rings hugging the pill, each carrying a few travelling nodes.
    for(let n=0;n<5;n++){const radius=eh*.9+n*scale*.13,ry=radius*(.86+n*.03);ctx.beginPath();ctx.ellipse(cx,cy,radius,ry,0,0,Math.PI*2);ctx.strokeStyle=`rgba(${n%2?'136,110,255':'86,150,255'},${.26+level*.18-n*.03})`;ctx.lineWidth=n===0?.9:.65;ctx.stroke();
      for(let k=0;k<2+n%2;k++){const a=k*2.1+n*1.3+t*(n%2?-1:1)*(1+n*.2),x=cx+Math.cos(a)*radius,y=cy+Math.sin(a)*ry,g=.6+.4*Math.sin(time*2+n+k);ctx.shadowBlur=14;ctx.shadowColor='#6da5ff';ctx.fillStyle=`rgba(190,222,255,${(.55+level*.4)*g})`;ctx.beginPath();ctx.arc(x,y,1.5+(k===0?1:0),0,7);ctx.fill();ctx.shadowBlur=0}}
    // Drifting dust with a few sparkles.
    for(let n=0;n<70;n++){const a=n*2.39996,r=scale*(.55+(n%17)/26),x=cx+Math.cos(a+t*.12)*r*1.35,y=cy+Math.sin(a+t*.12)*r;ctx.fillStyle=`rgba(120,170,255,${(.1+level*.25)*(.5+.5*Math.sin(time*1.2+n))})`;ctx.fillRect(x,y,n%13===0?1.8:.8,n%13===0?1.8:.8)}
    // Pulsating neural cells inside the pill. Blue on the left, violet through magenta on the right.
    ec.save();ec.beginPath();ec.roundRect(1,1,ew-2,eh-2,eh/2);ec.clip();ec.globalCompositeOperation='lighter';
    const intensity=.9+level*.5,speed=1.4+level*1.6,pts=seeds.map(s=>{const wob=Math.sin(time*speed*.5+s.phase)*3;return{x:s.u*ew+wob,y:s.v*eh+Math.cos(time*speed*.6+s.phase)*3,phase:s.phase,u:s.u}});
    const tint=u=>u<.5?[74+u*2*80,168-u*2*60,255]:[154+(u-.5)*2*80,108-(u-.5)*2*10,255];
    const wave=(u,ph)=>.5+.5*Math.sin(time*speed-Math.abs(u-.5)*6+ph*.35);
    const reach=ew*.13;ec.lineWidth=1.1;
    for(let i=0;i<pts.length;i++){const a=pts[i];for(let j=i+1;j<pts.length;j++){const b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<reach){const w=wave((a.u+b.u)/2,a.phase),c=tint((a.u+b.u)/2);ec.strokeStyle=`rgba(${c[0]|0},${c[1]|0},${c[2]},${(.3+w*.6)*intensity*(1-d/reach*.45)})`;ec.shadowBlur=8+w*10;ec.shadowColor=`rgb(${c[0]|0},${c[1]|0},${c[2]})`;ec.beginPath();ec.moveTo(a.x,a.y);ec.lineTo(b.x,b.y);ec.stroke()}}}
    ec.shadowBlur=0;
    for(const p of pts){const w=wave(p.u,p.phase),c=tint(p.u),g=ec.createRadialGradient(p.x,p.y,0,p.x,p.y,eh*.28);g.addColorStop(0,`rgba(${c[0]|0},${c[1]|0},${c[2]},${(.12+w*.22)*intensity})`);g.addColorStop(1,'transparent');ec.fillStyle=g;ec.fillRect(p.x-eh*.3,p.y-eh*.3,eh*.6,eh*.6);ec.fillStyle=`rgba(230,240,255,${(.35+w*.55)*intensity})`;ec.beginPath();ec.arc(p.x,p.y,.9+w*1.1,0,7);ec.fill()}
    // Lightning while listening: jagged arcs from both ends racing toward the centre.
    if(level>.25){for(let k=0;k<7;k++){const left=k%2===0,sx=left?2:ew-2,sy=eh*.2+Math.random()*eh*.6,tx=ew/2+(left?-1:1)*(10+Math.random()*ew*.12),ty=eh/2+(Math.random()-.5)*eh*.4,steps=7;ec.beginPath();ec.moveTo(sx,sy);for(let i=1;i<steps;i++){const t=i/steps;ec.lineTo(sx+(tx-sx)*t+(Math.random()-.5)*14,sy+(ty-sy)*t+(Math.random()-.5)*18)}ec.lineTo(tx,ty);const c=left?'110,200,255':'232,130,255';ec.strokeStyle=`rgba(${c},${(.25+Math.random()*.45)*level})`;ec.lineWidth=1.6;ec.shadowBlur=14;ec.shadowColor=`rgb(${c})`;ec.stroke();ec.strokeStyle=`rgba(255,255,255,${(.35+Math.random()*.4)*level})`;ec.lineWidth=.6;ec.stroke()}ec.shadowBlur=0}
    // Breathing edge light so the whole pill visibly pulses.
    const edge=ec.createLinearGradient(0,0,ew,0);edge.addColorStop(0,`rgba(80,190,255,${.12+pulse*.16+level*.3})`);edge.addColorStop(.5,'rgba(120,120,255,0)');edge.addColorStop(1,`rgba(230,110,255,${.12+pulse*.16+level*.3})`);ec.fillStyle=edge;ec.fillRect(0,0,ew,eh);
    ec.restore();
  }
  frame=requestAnimationFrame(draw);disposeBrain=()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();ctx.clearRect(0,0,width,height)};
}
export function animatePage(){const main=document.querySelector('.content');if(!main||matchMedia('(prefers-reduced-motion: reduce)').matches)return;main.animate([{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.2,.65,.3,1)'});}
