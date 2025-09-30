"use client";
import React, { useEffect, useRef } from "react";
type Props = { width?: number; height?: number; onScore?: (s:number)=>void; onEvent?: (type:string, meta?:any)=>void; paused?: boolean; onCoin?: (n:number)=>void };
export default function RunnerEngine({ width=820, height=420, onScore, onEvent, paused=false, onCoin }: Props){
  const cv = useRef<HTMLCanvasElement|null>(null); const raf = useRef<number|undefined>(); const score=useRef(0);
  const y=useRef(300); const vy=useRef(0); const gravity=0.9; const groundY=360; const speed=useRef(5);
  const obst=useRef({x:600}); const coin=useRef({x:480, y:280, alive:true});
  useEffect(()=>{ 
    const c=cv.current!; const ctx=c.getContext("2d")!; let last=performance.now();
    function loop(t:number){
      const dt=(t-last)/16.6; last=t;
      if(!paused){
        speed.current = 5 + Math.min(10, Math.floor(score.current/200));
        vy.current += gravity*dt; y.current += vy.current*dt; if(y.current>groundY){y.current=groundY; vy.current=0;}
        obst.current.x -= speed.current*dt; if(obst.current.x<-20){ obst.current.x= width-80; score.current+=100; onScore && onScore(score.current); }
        if(coin.current.alive){ coin.current.x -= speed.current*dt; }
        if(coin.current.x<-10 || !coin.current.alive){ coin.current = { x: width - 120 - Math.random()*100, y: 260 + Math.random()*40, alive:true }; }
        const px=100, py=y.current-20; const ox=obst.current.x, oy=groundY-20;
        if(px<ox+20 && px+20>ox && py<oy+20 && py+20>oy){ score.current=0; onScore && onScore(0); onEvent && onEvent("hit"); obst.current.x=width-80; }
        if(coin.current.alive){
          const cx=coin.current.x, cy=coin.current.y;
          if(Math.abs((px+10)-cx)<16 && Math.abs((py+10)-cy)<16){
            coin.current.alive=false;
            score.current += 25; onScore && onScore(score.current);
            onCoin && onCoin(1);
            onEvent && onEvent("coin");
          }
        }
      }
      ctx.clearRect(0,0,width,height);
      ctx.fillStyle="#09090b"; ctx.fillRect(0,0,width,height);
      ctx.fillStyle="#0f172a"; ctx.fillRect(0,0,width,240);
      ctx.fillStyle="#262626"; ctx.fillRect(0,groundY+10,width,40);
      ctx.fillStyle="#60a5fa"; ctx.fillRect(100,y.current-20,20,20);
      ctx.fillStyle="#ef4444"; ctx.fillRect(obst.current.x,groundY-20,20,20);
      if(coin.current.alive){ ctx.fillStyle="#fde047"; ctx.beginPath(); ctx.arc(coin.current.x, coin.current.y, 8, 0, Math.PI*2); ctx.fill(); }
      raf.current=requestAnimationFrame(loop);
    }
    raf.current=requestAnimationFrame(loop);
    const key=(e:KeyboardEvent)=>{ if(e.code==="Space" && y.current>=groundY){vy.current=-14; onEvent && onEvent("jump");} };
    window.addEventListener("keydown",key);
    onEvent && onEvent("start");
    return ()=>{ if(raf.current) cancelAnimationFrame(raf.current); window.removeEventListener("keydown",key); onEvent && onEvent("quit",{score:score.current}); };
  },[paused,width,height,onScore,onEvent,onCoin]);
  return (<canvas ref={cv} width={width} height={height} style={{borderRadius:12, background:"#0b0b0f"}}/>);
}
