"use client";
import React, { useEffect, useRef } from "react";
type Props = { width?: number; height?: number; onScore?: (s:number)=>void; onEvent?: (type:string, meta?:any)=>void; paused?: boolean; onCoin?: (n:number)=>void };
export default function FlappyEngine({ width=820, height=420, onScore, onEvent, paused=false, onCoin }: Props){
  const cv=useRef<HTMLCanvasElement|null>(null); const raf=useRef<number|undefined>(); const score=useRef(0);
  const y=useRef(200); const vy=useRef(0); const gravity=0.6;
  const baseGap=120; const gapVar=useRef(baseGap);
  const pipes=useRef([{x: width, top: 100}]);
  const coin=useRef<{x:number;y:number;alive:boolean}|null>(null);
  function newPipe(w:number,h:number){ pipes.current.push({x: w, top: 40 + Math.random()*(h-200)}); if(Math.random()<0.4) coin.current = { x: w+20, y: 80 + Math.random()*(h-160), alive:true }; }
  useEffect(()=>{
    const c=cv.current!; const ctx=c.getContext("2d")!; let last=performance.now();
    function loop(t:number){
      const dt=(t-last)/16.6; last=t;
      if(!paused){
        vy.current+=gravity*dt; y.current+=vy.current*dt; if(y.current<10||y.current>height-10){ score.current=0; onScore && onScore(0); y.current=200; vy.current=0; pipes.current=[{x: width, top:100}]; coin.current=null; gapVar.current=baseGap; }
        pipes.current.forEach(p=> p.x-=4*dt );
        if(pipes.current[0].x<width-240) newPipe(width, height);
        if(pipes.current[0].x<-40) { pipes.current.shift(); score.current+=50; onScore && onScore(score.current); gapVar.current=Math.max(80, baseGap - Math.floor(score.current/150)); }
        const px=160, py=y.current;
        const p0=pipes.current[0];
        if(p0 && p0.x<px+20 && p0.x+40>px){
          if(py < p0.top || py > p0.top+gapVar.current){ score.current=0; onScore && onScore(0); pipes.current=[{x:width, top:100}]; y.current=200; vy.current=0; coin.current=null; gapVar.current=baseGap; }
        }
        if(coin.current && coin.current.alive){
          coin.current.x -= 4*dt;
          if(Math.abs( (px+10) - coin.current.x )<16 && Math.abs( py - coin.current.y )<16 ){
            coin.current.alive=false; score.current+=25; onScore && onScore(score.current); onCoin && onCoin(1); onEvent && onEvent("coin");
          }
          if(coin.current.x<-10) coin.current=null;
        }
      }
      ctx.clearRect(0,0,width,height);
      ctx.fillStyle="#09090b"; ctx.fillRect(0,0,width,height);
      ctx.fillStyle="#10b981"; pipes.current.forEach(p=>{ ctx.fillRect(p.x,0,40,p.top); ctx.fillRect(p.x,p.top+gapVar.current,40,height-(p.top+gapVar.current)); });
      if(coin.current && coin.current.alive){ ctx.fillStyle="#fde047"; ctx.beginPath(); ctx.arc(coin.current.x, coin.current.y, 7, 0, Math.PI*2); ctx.fill(); }
      ctx.fillStyle="#60a5fa"; ctx.fillRect(160,y.current-10,20,20);
      raf.current=requestAnimationFrame(loop);
    }
    raf.current=requestAnimationFrame(loop);
    const key=(e:KeyboardEvent)=>{ if(e.code==="Space"){ vy.current=-8; onEvent && onEvent("flap"); } };
    window.addEventListener("keydown",key);
    onEvent && onEvent("start");
    return ()=>{ if(raf.current) cancelAnimationFrame(raf.current); window.removeEventListener("keydown",key); onEvent && onEvent("quit",{score:score.current}); };
  },[paused,width,height,onScore,onEvent,onCoin]);
  return (<canvas ref={cv} width={width} height={height} style={{borderRadius:12, background:"#0b0b0f"}}/>);
}
