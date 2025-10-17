"use client";
import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";

export default function AaaGamePage(){
  const [showIntro, setShowIntro] = useState(true);
  const [muted, setMuted] = useState(true);
  const [score,setScore] = useState(0);
  const [hp,setHp] = useState(100);
  const [gameOver,setGameOver] = useState(false);

  const videoRef = useRef<HTMLVideoElement|null>(null);
  const mountRef = useRef<HTMLDivElement|null>(null);
  const hudRef = useRef<HTMLDivElement|null>(null); // <- 3D emblem bg behind HUD

  // Unlock audio on first click (autoplay policy)
  useEffect(()=>{
    function unlock(){
      if(videoRef.current){ videoRef.current.muted=false; videoRef.current.play().catch(()=>{}); }
      window.removeEventListener("click", unlock);
    }
    window.addEventListener("click", unlock);
    return ()=>window.removeEventListener("click", unlock);
  },[]);

  // === 3D emblem background behind HUD (TorusKnot with glow-ish lighting) ===
  useEffect(()=>{
    if(!hudRef.current) return;
    const container = hudRef.current;
    // renderer
    const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true });
    const H = 120;
    const W = container.clientWidth || 600;
    renderer.setSize(W, H, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = `${H}px`;
    renderer.domElement.style.pointerEvents = "none";
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // scene & camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W/H, 0.1, 100);
    camera.position.set(0, 0, 6);

    // lights
    const key = new THREE.PointLight(0x77ccff, 2.0, 30); key.position.set(3,3,6); scene.add(key);
    const rim = new THREE.PointLight(0xff3366, 1.2, 30); rim.position.set(-4,0,3); scene.add(rim);
    scene.add(new THREE.AmbientLight(0x404040, 0.6));

    // emblem mesh
    const geo = new THREE.TorusKnotGeometry(1.2, 0.36, 200, 32);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x06263a,
      metalness: 0.7,
      roughness: 0.25
    });
    const emblem = new THREE.Mesh(geo, mat);
    scene.add(emblem);

    let raf = 0;
    const animate = ()=>{
      raf = requestAnimationFrame(animate);
      emblem.rotation.x += 0.007;
      emblem.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = ()=>{
      const newW = container.clientWidth || 600;
      const newH = H;
      camera.aspect = newW/newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH, false);
    };
    window.addEventListener("resize", onResize);

    return ()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      container.innerHTML = "";
    };
  },[]);

  // === GAME ===
  useEffect(()=>{
    if(showIntro || !mountRef.current) return;
    let animId = 0;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/(window.innerHeight*0.8), 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias:true });
    renderer.setSize(window.innerWidth, window.innerHeight*0.8);
    mountRef.current.innerHTML="";
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.PointLight(0xffffff, 1, 100); light.position.set(10,10,10); scene.add(light);
    const player = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({color:0x00ff88}));
    scene.add(player);
    camera.position.z = 6;

    const enemies:THREE.Mesh[] = [];
    const enemyBullets:THREE.Mesh[] = [];
    const projectiles:THREE.Mesh[] = [];

    function spawnEnemy(){
      const e = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshStandardMaterial({color:0xff3344}));
      e.position.set((Math.random()-0.5)*10, (Math.random()-0.5)*5, -16);
      (e as any)._shootCd = 0;
      scene.add(e); enemies.push(e);
    }
    const enemySpawner = setInterval(spawnEnemy, 1500);

    function enemyShoot(e:THREE.Object3D){
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.12,8,8), new THREE.MeshBasicMaterial({color:0xffaa00}));
      b.position.copy(e.position);
      (b as any)._vel = new THREE.Vector3().subVectors(player.position, e.position).normalize().multiplyScalar(0.12);
      scene.add(b); enemyBullets.push(b);
    }

    const keys:Record<string,boolean> = {};
    const onKeyDown=(e:KeyboardEvent)=>{ keys[e.key.toLowerCase()] = true; };
    const onKeyUp=(e:KeyboardEvent)=>{ keys[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const onClick=()=>{
      if(gameOver) return;
      const bullet = new THREE.Mesh(new THREE.SphereGeometry(0.1,8,8), new THREE.MeshBasicMaterial({color:0x33aaff}));
      bullet.position.copy(player.position);
      (bullet as any)._vel = new THREE.Vector3(0,0,-0.5);
      scene.add(bullet); projectiles.push(bullet);
    };
    window.addEventListener("click", onClick);

    const onResize=()=>{
      camera.aspect = window.innerWidth/(window.innerHeight*0.8);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight*0.8);
    };
    window.addEventListener("resize", onResize);

    let t=0;
    function loop(){
      animId = requestAnimationFrame(loop);
      if(gameOver){ renderer.render(scene,camera); return; }
      t += 1/60;

      // player
      if(keys["w"]) player.position.y += 0.08;
      if(keys["s"]) player.position.y -= 0.08;
      if(keys["a"]) player.position.x -= 0.08;
      if(keys["d"]) player.position.x += 0.08;

      // enemies
      for(let i=enemies.length-1;i>=0;i--){
        const e = enemies[i];
        e.position.z += 0.06;
        (e as any)._shootCd += 1/60;
        if((e as any)._shootCd > 1.2){
          (e as any)._shootCd = 0;
          enemyShoot(e);
        }
        if(e.position.distanceTo(player.position) < 1){
          setScore(s=>s+10);
          setHp(h=>Math.max(0,h-10));
          scene.remove(e); enemies.splice(i,1);
        }
        if(e.position.z > 8){ scene.remove(e); enemies.splice(i,1); }
      }

      // enemy bullets
      for(let i=enemyBullets.length-1;i>=0;i--){
        const b = enemyBullets[i];
        b.position.add((b as any)._vel);
        if(b.position.distanceTo(player.position) < 0.8){
          setHp(h=>Math.max(0,h-15));
          scene.remove(b); enemyBullets.splice(i,1);
        } else if(b.position.z > 8 || b.position.z < -30){ scene.remove(b); enemyBullets.splice(i,1); }
      }

      // player bullets
      for(let i=projectiles.length-1;i>=0;i--){
        const p = projectiles[i];
        p.position.add((p as any)._vel);
        for(let j=enemies.length-1;j>=0;j--){
          const e = enemies[j];
          if(p.position.distanceTo(e.position) < 0.8){
            setScore(s=>s+20);
            scene.remove(e); enemies.splice(j,1);
            scene.remove(p); projectiles.splice(i,1);
            break;
          }
        }
        if(p.position.z < -40){ scene.remove(p); projectiles.splice(i,1); }
      }

      if(hp<=0 && !gameOver){ setGameOver(true); }

      // subtle camera shake when low HP
      const shake = hp<40 ? 0.02 : 0.0;
      camera.position.x = Math.sin(t*20)*shake;
      camera.position.y = Math.cos(t*16)*shake;
      camera.lookAt(player.position);

      renderer.render(scene, camera);
    }
    loop();

    return ()=>{
      cancelAnimationFrame(animId);
      clearInterval(enemySpawner);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[showIntro, gameOver]);

  return (
    <div style={{background:"#000",color:"#eee",minHeight:"100vh",position:"relative"}}>
      {showIntro ? (
        <div style={{position:"relative"}}>
          <video
            ref={videoRef}
            src="/videos/intro.mp4"
            autoPlay
            playsInline
            muted={muted}
            onEnded={()=>setShowIntro(false)}
            style={{width:"100%",height:"100vh",objectFit:"cover"}}
          />
          <div style={{position:"absolute",bottom:20,right:20,display:"flex",gap:12}}>
            <button onClick={()=>{setMuted(m=>!m); if(videoRef.current){videoRef.current.muted=!videoRef.current.muted; videoRef.current.play().catch(()=>{});}}}
              style={{padding:"8px 12px",borderRadius:10,background:"#111827",color:"#e5e7eb",cursor:"pointer"}}>
              {muted ? "🔇 Unmute" : "🔊 Mute"}
            </button>
            <button onClick={()=>setShowIntro(false)}
              style={{padding:"8px 12px",borderRadius:10,background:"#111827",color:"#e5e7eb",cursor:"pointer"}}>
              ⏭ Skip Intro
            </button>
          </div>
        </div>
      ) : (
        <div style={{padding:"16px", position:"relative"}}>
          {/* 3D emblem background container */}
          <div ref={hudRef} style={{
            position:"absolute",
            left:0, right:0, top:0, height:120,
            zIndex:0, opacity:0.9,
            filter:"drop-shadow(0 0 12px rgba(0,229,255,0.35))"
          }}/>
          {/* HUD foreground */}
          <div style={{position:"relative", zIndex:1}}>
            <h1 style={{fontSize:22,fontWeight:800,margin:"6px 0"}}>⚔️ Royale Battle Nexus</h1>
            <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:8}}>
              <div>Score: <b>{score}</b> ��</div>
              <div>HP: <b style={{color: hp>60 ? "#22c55e" : hp>30 ? "#eab308" : "#ef4444"}}>{hp}</b></div>
              <div style={{opacity:.7}}>WASD move • Click shoot</div>
            </div>
          </div>
          <div ref={mountRef} style={{marginTop:8}}></div>
          {gameOver && (
            <div style={{
              position:"absolute", inset:"0 0 auto 0", top:140, margin:"10px auto", maxWidth:520,
              padding:"10px 12px", background:"#1a1a1a", border:"1px solid #333", borderRadius:10, color:"#fca5a5"
            }}>
              💀 You were eliminated.
              <button
                onClick={()=>{setHp(100); setScore(0); setGameOver(false);}}
                style={{marginLeft:10,padding:"6px 10px",borderRadius:8,border:"1px solid #444",background:"#0f1115",color:"#e5e7eb",cursor:"pointer"}}
              >Restart</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
