// One persistent player across app views; gain envelopes keep loops and pauses gentle.
export class FocusMusic {
  constructor(){this.audio=new Audio();this.audio.loop=true;this.audio.preload='metadata';this.volume=.35;this.envelope=0;this.playing=false;this.track='';this.run=0;this.listeners=new Set();this.audio.addEventListener('ended',()=>this.notify());this.audio.addEventListener('error',()=>{this.playing=false;this.notify()});this.audio.addEventListener('timeupdate',()=>this.updateGain());}
  get paused(){return !this.playing}
  onChange(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn)}
  notify(){for(const fn of this.listeners)fn(this)}
  connect(){if(this.context)return;const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;this.context=new Context();this.audio.volume=1;this.source=this.context.createMediaElementSource(this.audio);this.gain=this.context.createGain();this.analyser=this.context.createAnalyser();this.analyser.fftSize=256;this.samples=new Uint8Array(this.analyser.frequencyBinCount);this.source.connect(this.gain).connect(this.analyser).connect(this.context.destination);this.gain.gain.value=0;}
  updateGain(){const a=this.audio,d=a.duration,t=a.currentTime;const edge=Number.isFinite(d)&&d>8?Math.min(1,t/2.5,Math.max(0,d-t)/2.5):1;const v=this.volume*this.envelope*Math.sin(edge*Math.PI/2);if(this.gain)this.gain.gain.setTargetAtTime(v,this.context.currentTime,.06);else a.volume=v;}
  fade(target,ms=700){cancelAnimationFrame(this.fadeFrame);const start=performance.now(),from=this.envelope;return new Promise(resolve=>{this.finishFade?.();this.finishFade=resolve;const step=now=>{const p=Math.min(1,(now-start)/ms);this.envelope=from+(target-from)*(p*p*(3-2*p));this.updateGain();if(p<1)this.fadeFrame=requestAnimationFrame(step);else{this.finishFade=null;resolve()}};this.fadeFrame=requestAnimationFrame(step)});}
  async play(track=this.track){if(!track)return;const run=++this.run;this.connect();await this.context?.resume();if(track!==this.track){await this.fade(0,350);if(run!==this.run)return;this.audio.pause();this.audio.src=track;this.track=track;}await this.audio.play();if(run!==this.run)return;this.playing=true;this.notify();await this.fade(1,1000);}
  async pause(immediate=false){++this.run;this.playing=false;this.notify();if(!immediate)await this.fade(0,600);else{cancelAnimationFrame(this.fadeFrame);this.finishFade?.();this.envelope=0;this.updateGain()}if(!this.playing)this.audio.pause();}
  setVolume(value){this.volume=Math.max(0,Math.min(1,Number(value)));this.updateGain();this.notify()}
  level(){if(!this.playing||!this.analyser)return 0;this.analyser.getByteTimeDomainData(this.samples);return Math.min(1,Math.sqrt(this.samples.reduce((n,v)=>n+((v-128)/128)**2,0)/this.samples.length)*3)}
}
