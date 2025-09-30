"use client";
import React, { useEffect, useRef } from "react";
type Props = { width?: number; height?: number; onScore?: (s:number)=>void; onEvent?: (type:string, meta?:any)=>void; paused?: boolean; onCoin?: (n:number)=>void };
export default function ShooterEngine({ width=820, height=420, onScore, onEvent, paused=false, onCoin }: Props){
  const cv=useRef<HTMLCanvasElement|null>(null); const raf=useRef<number|undefined>(); const score=useRef(0);
  const player=useRef({x:60,y:200}); const bullets=useRef<{x:number;y:number}[]>([]); const enemies=useRef<{x:number;y:number;hp:number}[]>([]);
  const tacc=useRef(0); const spd=useRef(2);
  useEffect(()=>{
    const c=cv.current!; const ctx=c.getContext("2d")!;
    function spawn(){ if(enemies.current.length<10) enemies.current.push({x:width-20, y: 20+Math.random()*(height-40), hp: Math.random()<0.2 ? 3 : 1}); }
    const key = (e:KeyboardEvent)=>{ if(e.code==="Space" && !paused) { bullets.current.push({x:player.current.x+20, y:player.current.y}); onEvent && onEvent("shoot"); } };
    const move = (e:MouseEvent)=>{ const r=c.getBoundingClientRect(); player.current.y = Math.min(height-20, Math.max(20, e.clientY - r.top)); };
    let last=performance.now();
    function loop(t:number){
      const dt=(t-last)/16.6; last=t; tacc.current+=dt;
      if(!paused){
        if(tacc.current>30){ spawn(); tacc.current=0; }
        spd.current = 2 + Math.min(5, Math.floor(score.current/200));
        bullets.current.forEach(b=> b.x += 8*dt );
        enemies.current.forEach(e=> e.x -= spd.current*dt );
        bullets.current.forEach((b,bi)=>{
          enemies.current.forEach((en,ei)=>{
            if(b.x>en.x-10 && b.x<en.x+10 && Math.abs(b.y-en.y)<12){
              en.hp -= 1; bullets.current.splice(bi,1);
              if(en.hp<=0){ enemies.current.splice(ei,1); score.current+=75; onScore && onScore(score.current); if(Math.random()<0.3){ onCoin && onCoin(1); onEvent && onEvent("coin"); } }
            }
          });
        });
        enemies.current = enemies.current.filter(en => en.x>-10);
        bullets.current = bullets.current.filter(b => b.x<width+10);
      }
      ctx.clearRect(0,0,width,height);
      ctx.fillStyle="#09090b"; ctx.fillRect(0,0,width,height);
      ctx.fillStyle="#60a5fa"; ctx.fillRect(player.current.x-10,player.current.y-10,20,20);
      ctx.fillStyle="#fde047"; bullets.current.forEach(b=> ctx.fillRect(b.x, b.y-3, 6, 6));
      enemies.current.forEach(e=>{ ctx.fillStyle = e.hp>1 ? "#f59e0b" : "#ef4444"; ctx.fillRect(e.x-10,e.y-10,20,20); });
      raf.current=requestAnimationFrame(loop);
    }
    raf.current=requestAnimationFrame(loop);
    c.addEventListener("mousemove", move);
    window.addEventListener("keydown", key);
    onEvent && onEvent("start");
    return ()=>{ if(raf.current) cancelAnimationFrame(raf.current); window.removeEventListener("keydown",key); c.removeEventListener("mousemove",move); onEvent && onEvent("quit",{score:score.current}); };
  },[paused,width,height,onScore,onEvent,onCoin]);
  return (<canvas ref={cv} width={width} height={height} style={{borderRadius:12, background:"#0b0b0f"}}/>);
}
