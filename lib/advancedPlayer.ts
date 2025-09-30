export type Track = { id:string; title:string; artist:string; url:string };

export class CrossfadePlayer {
  private ctx: AudioContext | null = null;
  private gainA?: GainNode; private gainB?: GainNode;
  private srcA?: MediaElementAudioSourceNode; private srcB?: MediaElementAudioSourceNode;
  private elA?: HTMLAudioElement; private elB?: HTMLAudioElement;
  private active: "A"|"B" = "A";
  private fadeSec = 3;

  constructor(fadeSeconds=3){ this.fadeSec = Math.max(0, fadeSeconds); }

  attach(a: HTMLAudioElement, b: HTMLAudioElement){
    this.elA=a; this.elB=b;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.gainA = this.ctx.createGain(); this.gainB = this.ctx.createGain();
    this.srcA  = this.ctx.createMediaElementSource(a); this.srcB = this.ctx.createMediaElementSource(b);
    this.srcA.connect(this.gainA).connect(this.ctx.destination);
    this.srcB.connect(this.gainB).connect(this.ctx.destination);
    this.gainA.gain.value = 1; this.gainB.gain.value = 0;
  }

  async play(url:string){
    if(!this.elA || !this.elB) return;
    const nextEl = this.active==="A" ? this.elB : this.elA;
    const nextGain = this.active==="A" ? this.gainB! : this.gainA!;
    const curGain  = this.active==="A" ? this.gainA! : this.gainB!;
    nextEl.src = url; nextEl.load();
    await nextEl.play().catch(()=>{});
    const now = this.ctx!.currentTime;
    curGain.gain.cancelScheduledValues(now);
    nextGain.gain.cancelScheduledValues(now);
    curGain.gain.linearRampToValueAtTime(0, now + this.fadeSec);
    nextGain.gain.linearRampToValueAtTime(1, now + this.fadeSec);
    this.active = this.active==="A" ? "B" : "A";
  }

  pause(){ this.elA?.pause(); this.elB?.pause(); }
}
