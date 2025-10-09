"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/lib/gmar/store";

/** ===== ROYALE BATTLE NEXUS — HEROES + VEHICLES + ABILITIES =====
 *  Features:
 *  - 3 Hero classes (Titan, Phantom, Surge) with unique stats
 *  - Futuristic weapons: Blaster, Spread, Rail (piercing beam)
 *  - Dash (Shift) with cooldown, Fly (F) with energy drain
 *  - Surprise enemies: drop pods from above that crack open
 *  - Vehicles: On-Foot, Hoverboard, Hoverbike (V to cycle)
 *  - Customizable color schemes (C to cycle, persisted)
 *  - AAA visuals (glow, trails, outlines), minimap & shrinking zone
 */

type Owner = "player" | "bot" | "peer";
type Vec = { x: number; y: number; vx: number; vy: number; r: number; alive: boolean; owner?: Owner };
type Particle = { x:number; y:number; vx:number; vy:number; life:number; max:number; size:number; color:string; glow?:string };
type Weapon = "BLASTER" | "SPREAD" | "RAIL";
type HeroClass = "TITAN" | "PHANTOM" | "SURGE";
type Vehicle = "FOOT" | "HOVERBOARD" | "HOVERBIKE";

const clamp = (v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
const rand  = (a:number,b:number)=>a+Math.random()*(b-a);

const HERO_STATS: Record<HeroClass, {speed:number; hp:number; energy:number; color:string}> = {
  TITAN:   { speed: 4.5, hp: 5, energy: 80,  color:"#4aa3ff" },
  PHANTOM: { speed: 6.2, hp: 3, energy: 110, color:"#9b87ff" },
  SURGE:   { speed: 5.4, hp: 4, energy: 100, color:"#33ffc7" },
};

const VEHICLE_MODS: Record<Vehicle, {mult:number; turn:number; label:string}> = {
  FOOT:       { mult: 1.0,  turn: 1.0,  label: "On-Foot" },
  HOVERBOARD: { mult: 1.35, turn: 0.9,  label: "Hoverboard" },
  HOVERBIKE:  { mult: 1.75, turn: 0.75, label: "Hoverbike" },
};

export default function GameEngine({ width=1200, height=740 }:{ width?:number; height?:number }) {
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const { paused, dispatch, lives } = useGameStore();

  // game state
  const [started,setStarted]=useState(false);
  const [victory,setVictory]=useState(false);
  const [gameOver,setGameOver]=useState(false);

  // meta selections
  const [hero,setHero]=useState<HeroClass>(()=> (localStorage.getItem("rbn:hero") as HeroClass) || "SURGE");
  const [weapon,setWeapon]=useState<Weapon>(()=> (localStorage.getItem("rbn:weapon") as Weapon) || "BLASTER");
  const [vehicle,setVehicle]=useState<Vehicle>(()=> (localStorage.getItem("rbn:vehicle") as Vehicle) || "FOOT");
  const schemes = [
    { primary:"#4aa3ff", glow:"#73b7ff", ui:"#e6eef7" },
    { primary:"#33ffc7", glow:"#00ffb3", ui:"#eafff7" },
    { primary:"#ff8d4a", glow:"#ffc08a", ui:"#ffeede" },
    { primary:"#9b87ff", glow:"#c0b4ff", ui:"#f2f0ff" },
  ];
  const [schemeIdx,setSchemeIdx]=useState<number>(parseInt(localStorage.getItem("rbn:scheme")||"0")%schemes.length);

  // cinematic
  const openTime = useRef(0);
  const stars = useRef<Array<{x:number;y:number;z:number}>>([]);

  // world
  const MAP_W = 3600, MAP_H = 3600;

  useEffect(()=>{
    localStorage.setItem("rbn:hero", hero);
    localStorage.setItem("rbn:weapon", weapon);
    localStorage.setItem("rbn:vehicle", vehicle);
    localStorage.setItem("rbn:scheme", String(schemeIdx));
  },[hero,weapon,vehicle,schemeIdx]);

  useEffect(()=>{
    const cvs = canvasRef.current!;
    const ctx = cvs.getContext("2d")!;
    let raf=0, tPrev=performance.now();

    // zone
    let zoneRadius = Math.min(MAP_W, MAP_H)/2;
    const zoneCenter = { x: MAP_W/2, y: MAP_H/2 };

    // player
    const STATS = HERO_STATS[hero];
    let maxLives = STATS.hp;
    if (useGameStore.getState().lives !== maxLives) useGameStore.getState().reset(); // sync lives baseline
    // after reset, set to hero hp
    const setLives = (n:number) => (useGameStore.getState() as any).lives = n;
    setLives(maxLives);

    const player: Vec = { x: MAP_W/2, y: MAP_H/2, vx:0, vy:0, r:28, alive:true };
    let energy = STATS.energy;  // for dash / flight
    const energyMax = STATS.energy;

    // containers
    type Bullet = Vec & { dmg:number; pierce?:number };
    let bullets:Bullet[]=[];
    let enemies:Vec[]=[];
    let coins:Vec[]=[];
    let particles:Particle[]=[];
    let pods:Vec[]=[]; // drop pods from above
    let damageFlash=0;
    let dashCd=0;
    let flyOn=false;

    // opening
    if (stars.current.length===0){
      for(let i=0;i<180;i++) stars.current.push({ x:Math.random()*width, y:Math.random()*height, z:0.6+Math.random()*1.8 });
    }

    // helpers
    const colPrimary = schemes[schemeIdx].primary;
    const colGlow    = schemes[schemeIdx].glow;
    const colUi      = schemes[schemeIdx].ui;

    const pop = (x:number,y:number,color="#ff735a",count=28)=>{
      for(let i=0;i<count;i++) particles.push({
        x,y,vx:rand(-2.6,2.6),vy:rand(-2.6,2.6),
        life:0,max:rand(22,36),size:rand(2.2,4.2),color,glow:color
      });
    };
    const muzzle = (x:number,y:number,glow=colGlow)=>{
      particles.push({x,y,vx:0,vy:0,life:0,max:8,size:9,color:"#fff",glow});
    };
    const coinspark = (x:number,y:number)=>{
      for(let i=0;i<14;i++) particles.push({
        x,y,vx:rand(-1,1),vy:rand(-1,0.2),
        life:0,max:rand(16,24),size:rand(1.6,2.6),color:"#ffd700",glow:"#ffd700"
      });
    };

    function spawnEnemy() {
      // half normal roamers; half drop pods from above
      if (Math.random() < 0.5) {
        enemies.push({
          x: Math.random() * MAP_W,
          y: Math.random() * MAP_H,
          vx: (Math.random() - 0.5) * 1.1,
          vy: (Math.random() - 0.5) * 1.1,
          r: 22,
          alive: true,
        });
      } else {
        pods.push({ x: Math.random() * MAP_W, y: -80, vx: 0, vy: rand(5, 8), r: 18, alive: true });
      }
    }

    function spawnCoin(x:number,y:number){ coins.push({ x,y,vx:rand(-0.5,0.5), vy:-0.6-rand(0,0.3), r:10, alive:true }); }

    // Weapons
    function fireWeapon() {
      if (!player.alive) return;
      if (weapon === "BLASTER") {
        bullets.push({ x:player.x, y:player.y-30, vx:0, vy:-10, r:7, alive:true, owner:"player", dmg:1 });
        muzzle(player.x, player.y-24);
      } else if (weapon === "SPREAD") {
        const spread = [-0.25, 0, 0.25];
        spread.forEach((ang)=>{
          bullets.push({ x:player.x, y:player.y-30, vx:8*Math.sin(ang), vy:-10*Math.cos(ang), r:7, alive:true, owner:"player", dmg:1 });
        });
        muzzle(player.x, player.y-24);
      } else { // RAIL
        // piercing beam represented as fast long bullet with pierce count
        bullets.push({ x:player.x, y:player.y-40, vx:0, vy:-18, r:6, alive:true, owner:"player", dmg:2, pierce:4 });
        muzzle(player.x, player.y-28, "#a1e2ff");
        pop(player.x, player.y-60, "#8bd2ff", 10);
      }
    }

    function dash() {
      if (dashCd > 0 || energy < 15) return;
      dashCd = 30; // ~0.5s
      energy = Math.max(0, energy - 15);
      const dirX = player.vx, dirY = player.vy;
      const len = Math.hypot(dirX, dirY) || 1;
      const mult = 18;
      player.x += (dirX/len)*mult;
      player.y += (dirY/len)*mult;
      pop(player.x, player.y, colGlow, 18);
    }

    // input
    const keys:Record<string,boolean> = {};
    const onKey = (e:KeyboardEvent,down:boolean)=>{
      const k=e.key.toLowerCase();
      keys[k]=down;

      if(!started && down && (k==="enter" || k==="return")){ setStarted(true); return; }

      if(down && k===" ") fireWeapon();
      if(down && k==="shift") dash();

      if(down && k==="f") { // toggle flight
        if (!flyOn && energy < 20) return;
        flyOn = !flyOn;
      }

      if(down && k==="v"){ // cycle vehicle
        setVehicle((prev)=>{
          const order:Vehicle[]=["FOOT","HOVERBOARD","HOVERBIKE"];
          return order[(order.indexOf(prev)+1)%order.length];
        });
      }

      if(down && (k==="q"||k==="z")) setWeapon(prev => (prev==="BLASTER"?"SPREAD":prev==="SPREAD"?"RAIL":"BLASTER"));
      if(down && (k==="e"||k==="x")) setWeapon(prev => (prev==="RAIL"?"SPREAD":prev==="SPREAD"?"BLASTER":"RAIL"));

      if(down && k==="1") setHero("TITAN");
      if(down && k==="2") setHero("PHANTOM");
      if(down && k==="3") setHero("SURGE");

      if(down && k==="c") setSchemeIdx((i)=> (i+1)%schemes.length);
    };
    addEventListener("keydown", e=>onKey(e,true));
    addEventListener("keyup",   e=>onKey(e,false));

    // loop vars
    let enemyTimer=0;

    const loop=(t:number)=>{
      const dt=(t-tPrev)/16.6667; tPrev=t;
      raf=requestAnimationFrame(loop);

      // opening
      if(!started){
        openTime.current+=dt;
        ctx.clearRect(0,0,width,height);
        const g = ctx.createLinearGradient(0,0,width,height);
        g.addColorStop(0,"#05080c"); g.addColorStop(1,"#0a0f15");
        ctx.fillStyle=g; ctx.fillRect(0,0,width,height);
        stars.current.forEach((s,i)=>{
          s.y += 0.3*s.z; if(s.y>height) s.y=0;
          ctx.globalAlpha = 0.5 + 0.5*Math.sin((openTime.current+i)*0.05);
          ctx.fillStyle="#0ff";
          ctx.fillRect(s.x,s.y,2*s.z,2*s.z);
        });
        ctx.globalAlpha=1;

        // title
        const pulse = 0.7 + 0.3*Math.sin(openTime.current*0.07);
        ctx.save();
        ctx.shadowBlur=28; ctx.shadowColor=colGlow;
        ctx.globalAlpha=pulse;
        ctx.fillStyle=colGlow;
        ctx.font="900 56px system-ui, -apple-system, Segoe UI, Roboto";
        const title="Royale Battle Nexus";
        const tw=ctx.measureText(title).width;
        ctx.fillText(title, width/2 - tw/2, height/2 - 44);
        ctx.restore();

        ctx.fillStyle="#bfc7d1"; ctx.font="18px system-ui";
        const sub="ENTER: Start • WASD/Arrows: Move • Space: Shoot • Shift: Dash • F: Fly • V: Vehicle • Z/X or Q/E: Weapon • 1/2/3: Hero • C: Colors";
        const sw=ctx.measureText(sub).width;
        wrapText(ctx, sub, width/2 - Math.min(sw, width-80)/2, height/2 + 4, Math.min(sw, width-80), 22);

        // hero preview
        drawHeroPreview(ctx, width/2, height/2 + 80, hero, schemes[schemeIdx].primary, colGlow);

        return;
      }

      if(paused || gameOver || victory) return;

      // cooldowns / energy
      dashCd = Math.max(0, dashCd-1);
      energy = clamp(energy + (flyOn ? -0.6 : 0.5), 0, energyMax);
      if (flyOn && energy <= 0) flyOn = false;

      // zone shrink
      if(zoneRadius>260) zoneRadius -= 0.012*dt;

      // spawns
      enemyTimer+=dt;
      if(enemyTimer>12/60){
        enemyTimer=0; if(enemies.length + pods.length < 26) spawnEnemy();
      }

      // movement speed
      const vehicleMult = VEHICLE_MODS[vehicle].mult;
      const spd = STATS.speed * vehicleMult * (flyOn ? 1.1 : 1);
      const turn = VEHICLE_MODS[vehicle].turn;

      // input movement
      const ax = (Number(!!keys["arrowright"]||!!keys["d"]) - Number(!!keys["arrowleft"]||!!keys["a"])) * spd;
      const ay = (Number(!!keys["arrowdown"]||!!keys["s"]) - Number(!!keys["arrowup"]||!!keys["w"])) * spd;

      // smoother turn for vehicles
      player.vx = player.vx* (1-turn*0.25) + ax*(turn*0.25);
      player.vy = player.vy* (1-turn*0.25) + ay*(turn*0.25);

      // gravity if not flying
      if (!flyOn) player.vy += 0.08;

      player.x = clamp(player.x + player.vx, player.r, MAP_W-player.r);
      player.y = clamp(player.y + player.vy, player.r, MAP_H-player.r);

      // bullets
      bullets.forEach(b=>{ b.x+=b.vx; b.y+=b.vy; if(b.x<-60||b.x>MAP_W+60||b.y<-60||b.y>MAP_H+60) b.alive=false; });

      // pods fall then burst into enemies
      pods.forEach(p=>{
        p.y += p.vy;
        if (p.y > rand(300, MAP_H-300)) {
          p.alive = false;
          pop(p.x, p.y, "#ffaa66", 24);
          // spawn 1-3 enemies at landing
          const n = 1 + Math.floor(Math.random()*3);
          for (let i=0;i<n;i++){
            enemies.push({ x:p.x+rand(-20,20), y:p.y+rand(-10,10), vx:rand(-1.2,1.2), vy:rand(-1.2,1.2), r:22, alive:true });
          }
        }
      });

      // enemies move + shoot
      enemies.forEach(en=>{
        en.x+=en.vx; en.y+=en.vy;
        if(en.x<en.r||en.x>MAP_W-en.r) en.vx*=-1;
        if(en.y<en.r||en.y>MAP_H-en.r) en.vy*=-1;
        if(Math.random()<0.012){
          const dx=player.x-en.x, dy=player.y-en.y, len=Math.hypot(dx,dy)||1;
          bullets.push({ x:en.x, y:en.y, vx:(dx/len)*4.2, vy:(dy/len)*4.2, r:7, alive:true, owner:"bot", dmg:1 });
        }
      });

      // coins
      coins.forEach(c=>{ c.vy+=0.09; c.x+=c.vx; c.y+=c.vy; if(c.y>MAP_H+40) c.alive=false; });

      // particles
      particles.forEach(p=>{ p.life++; p.x+=p.vx; p.y+=p.vy; p.vx*=0.98; p.vy*=0.98; });
      particles = particles.filter(p=>p.life<p.max);

      const hit=(a:Vec,b:Vec)=>{ const dx=a.x-b.x, dy=a.y-b.y; return dx*dx+dy*dy <= (a.r+b.r)*(a.r+b.r); };

      // bullets vs enemies (with rail pierce)
      bullets.forEach(b=>{
        if(b.owner==="player"){
          enemies.forEach(en=>{
            if(b.alive && en.alive && hit(b,en)){
              en.alive=false; spawnCoin(en.x,en.y); pop(en.x,en.y,"#ff5b6a");
              useGameStore.getState().dispatch({type:"SCORE",by: weapon==="RAIL" ? 15 : 10});
              if (b.pierce && b.pierce>0) { b.pierce--; } else { b.alive=false; }
            }
          });
        }
      });

      // bullets vs player
      bullets.forEach(b=>{
        if(b.owner==="bot" && player.alive && hit(b,player)){
          b.alive=false; damageFlash=10;
          useGameStore.getState().dispatch({type:"HIT"});
        }
      });

      // player vs enemy (ram)
      enemies.forEach(en=>{
        if(player.alive && en.alive && hit(player,en)){
          en.alive=false; pop(en.x,en.y,"#ff3b3b"); damageFlash=10;
          useGameStore.getState().dispatch({type:"HIT"});
        }
      });

      // player vs coin
      coins.forEach(c=>{
        if(c.alive && hit(player,c)){
          c.alive=false; coinspark(c.x,c.y);
          useGameStore.getState().dispatch({type:"COIN",amount:1});
        }
      });

      // zone damage
      const dx=player.x-zoneCenter.x, dy=player.y-zoneCenter.y, dist=Math.hypot(dx,dy);
      if(dist>zoneRadius && Math.random()<0.02){ damageFlash=10; useGameStore.getState().dispatch({type:"HIT"}); }

      // cleanup
      bullets=bullets.filter(b=>b.alive);
      enemies=enemies.filter(e=>e.alive);
      coins=coins.filter(c=>c.alive);
      pods=pods.filter(p=>p.alive);

      // end states
      if(lives>0 && enemies.length===0 && pods.length===0 && zoneRadius<=260) setVictory(true);
      if(lives<=0) setGameOver(true);

      // camera
      const camX = clamp(player.x - width/2, 0, MAP_W - width);
      const camY = clamp(player.y - height/2, 0, MAP_H - height);

      // RENDER =========================================================
      ctx.clearRect(0,0,width,height);
      ctx.save();
      ctx.translate(-camX, -camY);

      // grid bg
      const grid=44;
      ctx.fillStyle="#0a0f15"; ctx.fillRect(0,0,MAP_W,MAP_H);
      ctx.strokeStyle="#0e1620"; ctx.lineWidth=1;
      ctx.beginPath();
      for(let x=0;x<=MAP_W;x+=grid) { ctx.moveTo(x,0); ctx.lineTo(x,MAP_H); }
      for(let y=0;y<=MAP_H;y+=grid) { ctx.moveTo(0,y); ctx.lineTo(MAP_W,y); }
      ctx.stroke();

      // zone ring
      ctx.save();
      ctx.shadowBlur=24; ctx.shadowColor="#00ffb3";
      ctx.beginPath(); ctx.arc(zoneCenter.x,zoneCenter.y,zoneRadius,0,Math.PI*2);
      ctx.strokeStyle="#00ffb3"; ctx.lineWidth=6; ctx.stroke();
      ctx.restore();

      // pods
      pods.forEach(p=>{
        ctx.save();
        ctx.shadowBlur=14; ctx.shadowColor="#ffaa66";
        ctx.fillStyle="#ffaa66";
        ctx.beginPath(); ctx.ellipse(p.x,p.y,18,26,0,0,Math.PI*2); ctx.fill();
        ctx.restore();
      });

      // player (ship/board/bike)
      drawPlayer(ctx, player, vehicle, colPrimary, colGlow);

      // bullets with trail
      bullets.forEach(b=>{
        const trail = ctx.createLinearGradient(b.x, b.y, b.x, b.y + (b.vy>0?28:-28));
        if(b.owner==="player"){ trail.addColorStop(0,"#fff"); trail.addColorStop(1,"rgba(180,220,255,0)"); }
        else { trail.addColorStop(0,"#ffcc00"); trail.addColorStop(1,"rgba(255,204,0,0)"); }
        ctx.fillStyle=trail;
        (ctx as any).roundRect?.(b.x-3, b.y-14, 6, 28, 3) ?? ctx.fillRect(b.x-3, b.y-14, 6, 28);
      });

      // enemies
      enemies.forEach(en=>{
        ctx.save();
        ctx.shadowBlur=18; ctx.shadowColor="#ff5b6a";
        ctx.beginPath(); ctx.arc(en.x,en.y,en.r,0,Math.PI*2);
        ctx.fillStyle="#ff4757"; ctx.fill();
        ctx.shadowBlur=0; ctx.lineWidth=3; ctx.strokeStyle="#5a1016"; ctx.stroke();
        ctx.restore();
      });

      // coins
      coins.forEach(c=>{
        const gr=ctx.createRadialGradient(c.x-3,c.y-3,2,c.x,c.y,12);
        gr.addColorStop(0,"#fff7aa"); gr.addColorStop(1,"#d7a700");
        ctx.fillStyle=gr; ctx.beginPath(); ctx.arc(c.x,c.y,c.r,0,Math.PI*2); ctx.fill();
        ctx.lineWidth=2; ctx.strokeStyle="#7a5b00"; ctx.stroke();
      });

      // particles
      particles.forEach(p=>{
        const a = 1 - p.life/p.max;
        ctx.save(); ctx.globalAlpha = Math.max(0,a);
        if(p.glow){ ctx.shadowBlur=16; ctx.shadowColor=p.glow; }
        ctx.fillStyle=p.color;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fill();
        ctx.restore();
      });

      ctx.restore();

      // HUD
      ctx.fillStyle="#0b0f14"; ctx.fillRect(0,0,width,54);
      ctx.fillStyle=colUi; ctx.font="16px system-ui";
      const s = useGameStore.getState();
      ctx.fillText(`Score: ${s.score}`, 16, 34);
      ctx.fillText(`Coins: ${s.coins}`, 140, 34);

      // lives hearts
      for(let i=0;i<s.lives;i++){
        const x=240+i*20;
        ctx.fillStyle="#ff4d6d";
        ctx.beginPath();
        ctx.arc(x,26,6,0,Math.PI);
        ctx.arc(x+10,26,6,0,Math.PI);
        ctx.lineTo(x+5,38); ctx.closePath(); ctx.fill();
      }

      // hero/vehicle/weapon label
      ctx.fillStyle=colUi; ctx.font="13px system-ui";
      ctx.fillText(`Hero: ${hero}  •  Vehicle: ${VEHICLE_MODS[vehicle].label}  •  Weapon: ${weapon}`, 320, 34);

      // energy bar
      const eX=width-260, eW=220, eH=10;
      ctx.fillStyle="#12212a"; ctx.fillRect(eX, 22, eW, eH);
      const ePct=energy/energyMax;
      ctx.fillStyle=colGlow; ctx.fillRect(eX, 22, eW*ePct, eH);
      ctx.strokeStyle="#1c2a36"; ctx.strokeRect(eX, 22, eW, eH);
      ctx.fillStyle=colUi; ctx.fillText(`Energy ${Math.round(energy)}/${energyMax}`, eX, 44);

      // minimap
      const MM_W=190, MM_H=190; const scaleX=MM_W/MAP_W, scaleY=MM_H/MAP_H;
      ctx.fillStyle="rgba(0,0,0,0.55)"; ctx.fillRect(12,62,MM_W,MM_H);
      ctx.strokeStyle="#1c2a36"; ctx.strokeRect(12,62,MM_W,MM_H);
      ctx.beginPath(); ctx.strokeStyle="#00ffb3"; ctx.lineWidth=1;
      ctx.arc(12+zoneCenter.x*scaleX,62+zoneCenter.y*scaleY,zoneRadius*scaleX,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle=colPrimary; ctx.fillRect(12+player.x*scaleX-2,62+player.y*scaleY-2,4,4);
      ctx.fillStyle="#ff4757"; enemies.forEach(en=>ctx.fillRect(12+en.x*scaleX-1,62+en.y*scaleY-1,2,2));

      if(damageFlash>0){ damageFlash--; ctx.save(); ctx.globalAlpha=0.18; ctx.fillStyle="#ff0000"; ctx.fillRect(0,0,width,height); ctx.restore(); }

      if(paused){ overlay(ctx,width,height,"PAUSED"); }
      if(gameOver){ overlay(ctx,width,height,"Game Over — Press R to Retry"); }
      if(victory){ overlay(ctx,width,height,"🎉 Victory Royale — You Survived!"); }
    };

    raf=requestAnimationFrame(loop);

    const onCtrl=(e:KeyboardEvent)=>{
      const k=e.key.toLowerCase();
      if(k==="r"){ useGameStore.getState().reset(); setVictory(false); setGameOver(false); setStarted(false); setLives(maxLives); }
      if(k==="p"){ dispatch({type:"PAUSE", on: !useGameStore.getState().paused}); }
    };
    addEventListener("keydown", onCtrl);

    return ()=>{ cancelAnimationFrame(raf); removeEventListener("keydown", onCtrl); };
  // ✅ include `started` so ENTER immediately switches from opening to gameplay
  },[paused,dispatch,lives,width,height,hero,weapon,vehicle,schemeIdx,started]);

  return (
    <div style={{position:"relative"}}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width:"100%", height:"auto", border:"1px solid #1b2836", borderRadius:16, background:"#05080c" }}
      />
    </div>
  );
}

/* ===== Render helpers ===== */

function overlay(ctx:CanvasRenderingContext2D,w:number,h:number,text:string){
  ctx.save();
  ctx.globalAlpha=0.86; ctx.fillStyle="#000"; ctx.fillRect(0,0,w,h);
  ctx.restore();
  ctx.save();
  ctx.shadowBlur=24; ctx.shadowColor="#18e7ff";
  ctx.fillStyle="#e6eef7"; ctx.font="bold 32px system-ui";
  const tw=ctx.measureText(text).width;
  ctx.fillText(text, w/2 - tw/2, h/2);
  ctx.restore();
}

function wrapText(ctx:CanvasRenderingContext2D, text:string, x:number, y:number, maxWidth:number, lineHeight:number){
  const words = text.split(" ");
  let line = "";
  for (let n = 0; n < words.length; n++) {
    const test = line + words[n] + " ";
    if (ctx.measureText(test).width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, y);
}

function drawHeroPreview(ctx:CanvasRenderingContext2D, x:number, y:number, hero:HeroClass, color:string, glow:string){
  ctx.save(); ctx.shadowBlur=18; ctx.shadowColor=glow;
  ctx.fillStyle=color;
  if (hero === "TITAN") {
    (ctx as any).roundRect?.(x-32,y-24,64,48,10) ?? ctx.fillRect(x-32,y-24,64,48);
  } else if (hero === "PHANTOM") {
    ctx.beginPath(); ctx.ellipse(x,y,36,22,0,0,Math.PI*2); ctx.fill();
  } else { // SURGE
    ctx.beginPath(); ctx.moveTo(x, y-26); ctx.lineTo(x+34, y+26); ctx.lineTo(x-34, y+26); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function drawPlayer(ctx:CanvasRenderingContext2D, p:Vec, vehicle:Vehicle, color:string, glow:string){
  ctx.save();
  if (vehicle === "FOOT") {
    // orb + nose
    ctx.shadowBlur=20; ctx.shadowColor=glow;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=color; ctx.fill();
    ctx.shadowBlur=0; ctx.lineWidth=3; ctx.strokeStyle="#163a66"; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(p.x, p.y-p.r-8); ctx.lineTo(p.x-10, p.y-4); ctx.lineTo(p.x+10, p.y-4);
    ctx.closePath(); ctx.fillStyle="#bfe1ff"; ctx.fill();
  } else if (vehicle === "HOVERBOARD") {
    // board deck
    ctx.shadowBlur=16; ctx.shadowColor=glow;
    ctx.fillStyle=color;
    (ctx as any).roundRect?.(p.x-34,p.y+10,68,10,5) ?? ctx.fillRect(p.x-34,p.y+10,68,10);
    // rider orb
    ctx.beginPath(); ctx.arc(p.x,p.y,20,0,Math.PI*2); ctx.fill();
  } else {
    // HOVERBIKE body
    ctx.shadowBlur=18; ctx.shadowColor=glow;
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.moveTo(p.x-36,p.y+6); ctx.lineTo(p.x+36,p.y+6); ctx.lineTo(p.x+14,p.y-10); ctx.lineTo(p.x-14,p.y-10);
    ctx.closePath(); ctx.fill();
    // canopy
    ctx.globalAlpha=0.9; ctx.fillStyle="#cfe9ff";
    ctx.beginPath(); ctx.ellipse(p.x,p.y-8,16,10,0,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}