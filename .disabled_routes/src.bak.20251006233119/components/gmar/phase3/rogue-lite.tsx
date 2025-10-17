"use client";
import React, { useEffect, useRef } from "react";

type Vec = { x:number; y:number };
type Enemy = Vec & { r:number; hp:number; vx:number; vy:number };
type Bullet = Vec & { r:number; vx:number; vy:number };

function clamp(v:number,a:number,b:number){ return Math.max(a, Math.min(b, v)); }
function dist(a:Vec,b:Vec){ const dx=a.x-b.x, dy=a.y-b.y; return Math.hypot(dx,dy); }

export default function RogueLite({
  paused=false,
  settings,
  onScore=()=>{},
  addCoins=()=>{}
}:{
  paused?: boolean;
  settings?: any;
  onScore?: (n:number)=>void;
  addCoins?: (n:number)=>void;
}){
  const ref = useRef<HTMLCanvasElement|null>(null);
  const scoreRef = useRef(0);

  useEffect(()=>{
    const cvs = ref.current!;
    const ctx = cvs.getContext("2d")!;
    let ww = cvs.width = 720;
    let hh = cvs.height = 420;

    const keys:Record<string,boolean> = {};
    const mouse = { x: ww/2, y: hh/2, down:false };

    const player:Vec & { r:number } = { x: ww/2, y: hh/2, r: 12 };
    let bullets:Bullet[] = [];
    let enemies:Enemy[] = [];
    let lastSpawn = 0;

    const spd = settings?.difficulty==="hard" ? 4.0 : settings?.difficulty==="easy" ? 2.8 : 3.4;

    function spawnEnemy(){
      const side = Math.floor(Math.random()*4);
      let x=0,y=0;
      if(side===0){ x=Math.random()*ww; y=-20; }
      if(side===1){ x=ww+20; y=Math.random()*hh; }
      if(side===2){ x=Math.random()*ww; y=hh+20; }
      if(side===3){ x=-20; y=Math.random()*hh; }
      const r=10+Math.random()*7;
      const dx = player.x - x, dy = player.y - y;
      const len = Math.hypot(dx,dy)||1;
      const vx = (dx/len) * (1.2+Math.random()*0.6);
      const vy = (dy/len) * (1.2+Math.random()*0.6);
      enemies.push({ x,y,r,hp:2+Math.random()*2,vx,vy });
    }

    function shoot(){
      const dx = mouse.x - player.x, dy = mouse.y - player.y;
      const len = Math.hypot(dx,dy)||1;
      const s = 7.2;
      bullets.push({ x: player.x, y: player.y, r: 4, vx: (dx/len)*s, vy: (dy/len)*s });
    }

    let fireCD = 0;

    const onKey = (e:KeyboardEvent)=>{ keys[e.key.toLowerCase()] = e.type==="keydown"; };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    cvs.addEventListener("mousemove", e=>{
      const rect = cvs.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    });
    cvs.addEventListener("mousedown", ()=>{ mouse.down=true; });
    cvs.addEventListener("mouseup",   ()=>{ mouse.down=false; });
    cvs.addEventListener("mouseleave",()=>{ mouse.down=false; });

    let raf=0; let t0=performance.now();
    const loop=(t:number)=>{
      raf = requestAnimationFrame(loop);
      if(paused) return;
      const dt = (t - t0)/1000; t0=t;
      ctx.fillStyle = "#0b1220"; ctx.fillRect(0,0,ww,hh);

      // input
      let vx=0, vy=0;
      if(keys["w"]||keys["arrowup"]) vy-=1;
      if(keys["s"]||keys["arrowdown"]) vy+=1;
      if(keys["a"]||keys["arrowleft"]) vx-=1;
      if(keys["d"]||keys["arrowright"]) vx+=1;
      const len=Math.hypot(vx,vy)||1;
      vx=(vx/len)*spd; vy=(vy/len)*spd;
      player.x = clamp(player.x + vx, 0+player.r, ww-player.r);
      player.y = clamp(player.y + vy, 0+player.r, hh-player.r);

      // fire
      fireCD -= dt;
      if(mouse.down && fireCD<=0){ shoot(); fireCD = 0.12; }

      // spawn enemies
      lastSpawn += dt;
      const spawnEvery = settings?.difficulty==="hard" ? 0.45 : settings?.difficulty==="easy" ? 0.9 : 0.65;
      if(lastSpawn > spawnEvery){ lastSpawn=0; spawnEnemy(); }

      // update bullets
      bullets.forEach(b=>{ b.x+=b.vx; b.y+=b.vy; });
      bullets = bullets.filter(b=> b.x>-20&&b.x<ww+20&&b.y>-20&&b.y<hh+20);

      // update enemies + collisions
      for(let i=enemies.length-1;i>=0;i--){
        const e=enemies[i];
        e.x += e.vx; e.y += e.vy;

        // hit player?
        if(dist(e,player) <= e.r + player.r){
          // simple penalty then knock back enemy
          scoreRef.current = Math.max(0, scoreRef.current - 10);
          e.x += (e.vx*-12); e.y += (e.vy*-12);
        }

        // bullets collide
        for(let j=bullets.length-1;j>=0;j--){
          const b=bullets[j];
          if(dist(e,b) <= e.r + b.r){
            bullets.splice(j,1);
            e.hp -= 2;
            if(e.hp<=0){
              enemies.splice(i,1);
              scoreRef.current += 5;
              onScore(scoreRef.current);
              addCoins?.(1);
            }
            break;
          }
        }
      }

      // draw player
      ctx.fillStyle="#60a5fa"; ctx.beginPath(); ctx.arc(player.x,player.y,player.r,0,Math.PI*2); ctx.fill();

      // draw enemies
      ctx.fillStyle="#fca5a5";
      enemies.forEach(e=>{ ctx.beginPath(); ctx.arc(e.x,e.y,e.r,0,Math.PI*2); ctx.fill(); });

      // draw bullets
      ctx.fillStyle="#e5e7eb";
      bullets.forEach(b=>{ ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill(); });

      // HUD
      ctx.fillStyle="#9ca3af"; ctx.font="12px ui-sans-serif,system-ui,-apple-system";
      ctx.fillText(`Score ${scoreRef.current} • Enemies ${enemies.length}`, 10, 18);
    };
    raf = requestAnimationFrame(loop);

    return ()=>{ cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, settings?.difficulty]);

  return <canvas ref={ref} style={{width:"100%",height:420,background:"#0b1220",border:"1px solid #1f2937",borderRadius:12}}/>;
}
