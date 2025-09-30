"use client";
import React, {useEffect, useRef} from "react";
import { addCoins } from "./economy";

type Props={ paused?:boolean; settings?:{difficulty:"easy"|"normal"|"hard"}; onScore?:(n:number)=>void; };

export default function MobaLane({paused,settings,onScore}:Props){
  const ref=useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{
    const cv=ref.current!, ctx=cv.getContext("2d")!;
    const W=cv.width=720, H=cv.height=420;
    const laneY=H*0.55;
    let score=0, running=true;

    type Creep={x:number,y:number,hp:number,spd:number,ally:boolean};
    type Bolt={x:number,y:number,vx:number,vy:number};
    const creeps:Creep[]=[]; const bolts:Bolt[]=[];
    const hero={x:W*0.2, y:laneY-30};

    const diff=settings?.difficulty||"normal";
    const enemyEvery = diff==="hard"?900:diff==="normal"?1100:1300;
    const allyEvery = 1500;

    let t=0, aAcc=0, eAcc=0;

    const spawn=(ally:boolean)=>{
      const sp= ally? 1.2: -1.1;
      const x=ally? -20: W+20;
      const hp= ally? 8:10;
      creeps.push({x,y:laneY, hp, spd:sp, ally});
    };

    function cast(x:number,y:number){
      const dx=x-hero.x, dy=y-hero.y, L=Math.hypot(dx,dy)||1, s=4.2;
      bolts.push({x:hero.x,y:hero.y,vx:dx/L*s,vy:dy/L*s});
    }

    cv.addEventListener("click",(e)=>{
      const r=cv.getBoundingClientRect(); cast(e.clientX-r.left, e.clientY-r.top);
    });

    function step(dt:number){
      if(paused||!running) return;
      t+=dt; aAcc+=dt; eAcc+=dt;
      while(aAcc>allyEvery){aAcc-=allyEvery; spawn(true);}
      while(eAcc>enemyEvery){eAcc-=enemyEvery; spawn(false);}

      // move creeps
      for(const c of creeps){ c.x += c.ally? 1.2: -1.1; }

      // collisions bolts->creeps
      for(let i=bolts.length-1;i>=0;i--){
        const b=bolts[i]; b.x+=b.vx; b.y+=b.vy;
        if(b.x<-20||b.x>W+20||b.y<-20||b.y>H+20){ bolts.splice(i,1); continue; }
        for(let j=creeps.length-1;j>=0;j--){
          const c=creeps[j];
          const d=Math.hypot(b.x-c.x,b.y-c.y);
          if(d<16){ c.hp-=5; bolts.splice(i,1); if(c.hp<=0){creeps.splice(j,1); score+=4; onScore?.(score); addCoins(3);} break;}
        }
      }

      // wave victory if lane cleared long enough
      // draw
      ctx.fillStyle="#0b1220"; ctx.fillRect(0,0,W,H);
      // lane
      ctx.strokeStyle="#1f2937"; ctx.beginPath(); ctx.moveTo(0,laneY); ctx.lineTo(W,laneY); ctx.stroke();
      // hero
      ctx.fillStyle="#93c5fd"; ctx.fillRect(hero.x-10, hero.y-10, 20, 20);
      // creeps
      for(const c of creeps){ ctx.fillStyle=c.ally?"#a7f3d0":"#fca5a5"; ctx.beginPath(); ctx.arc(c.x, c.y, 10, 0, Math.PI*2); ctx.fill(); }
      // bolts
      ctx.fillStyle="#fde68a"; for(const b of bolts){ ctx.beginPath(); ctx.arc(b.x,b.y,4,0,Math.PI*2); ctx.fill(); }
      // HUD
      ctx.fillStyle="#e5e7eb"; ctx.font="12px system-ui";
      ctx.fillText(`Score ${score}  Creeps ${creeps.length}  Click to cast`, 10, 16);
    }

    let last=performance.now(), req=0;
    const loop=(now:number)=>{ const dt=now-last; last=now; step(dt); req=requestAnimationFrame(loop); };
    req=requestAnimationFrame(loop);

    return ()=>cancelAnimationFrame(req);
  },[paused,settings?.difficulty]);

  return <canvas ref={ref} style={{width:"100%",height:420,border:"1px solid #1f2937",borderRadius:12,background:"#0b1220"}}/>;
}
