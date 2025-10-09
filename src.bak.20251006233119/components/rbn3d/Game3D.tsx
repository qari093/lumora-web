// File: src/components/rbn3d/Game3D.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { Sky, StatsGl, Billboard, Text, Sparkles } from "@react-three/drei";
import { useGameStore } from "@/lib/gmar/store";
import { finalizeSession, getBalance, startSession } from "@/lib/zen/client";

/* ============================================================
   Royale Battle Nexus — WebGL 3D Prototype (+ Zen Economy)
   Features:
   - 3rd-person capsule player with WASD + Sprint (Shift)
   - Weapons: BLASTER (1), SPREAD (2), RAIL (3), ROCKET (4)
   - Ally Drone (T): circles player and auto-fires
   - Enemy waves + drop pods + pickups (CRED orbs)
   - HUD with Zen/Cred/Shards, weapon, wave, kill count
   - Victory → server finalize + rewards to wallet
   ============================================================ */

type Weapon = "BLASTER" | "SPREAD" | "RAIL" | "ROCKET";
type Enemy = { pos: THREE.Vector3; vel: THREE.Vector3; hp: number; alive: boolean; mesh?: THREE.Mesh };
type Bullet = { mesh: THREE.Mesh; vel: THREE.Vector3; dmg: number; owner: "player" | "ally" | "enemy"; pierce?: number };
type DropPod = { pos: THREE.Vector3; vy: number; mesh?: THREE.Mesh; alive: boolean };

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function useKeys() {
  const pressed = useRef<Record<string, boolean>>({});
  useEffect(() => {
    const on = (d: boolean) => (e: KeyboardEvent) => {
      pressed.current[e.key.toLowerCase()] = d;
    };
    addEventListener("keydown", on(true));
    addEventListener("keyup", on(false));
    return () => {
      removeEventListener("keydown", on(true));
      removeEventListener("keyup", on(false));
    };
  }, []);
  return pressed;
}

/* ---------- Terrain (cheap heightmap) ---------- */
function Terrain() {
  const geom = useMemo(() => new THREE.PlaneGeometry(2400, 2400, 200, 200), []);
  geom.rotateX(-Math.PI / 2);
  const pos = geom.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const h = (Math.sin(x * 0.01) + Math.cos(z * 0.01)) * 2 + Math.sin((x + z) * 0.005) * 4;
    pos.setY(i, h);
  }
  pos.needsUpdate = true;
  return (
    <mesh geometry={geom} receiveShadow>
      <meshStandardMaterial color="#1e2b23" roughness={1} />
    </mesh>
  );
}

/* ---------- Effects ---------- */
function Boom({ at, color = "#ff6b6b" }: { at: THREE.Vector3; color?: string }) {
  // quick one-shot ring
  const ref = useRef<THREE.Mesh>(null!);
  const start = useRef(performance.now());
  useFrame(() => {
    const t = (performance.now() - start.current) / 1000;
    const s = 1 + t * 6;
    if (ref.current) {
      ref.current.scale.setScalar(s);
      (ref.current.material as THREE.MeshBasicMaterial).opacity = clamp(1 - t, 0, 1);
    }
  });
  return (
    <mesh position={at} ref={ref}>
      <ringGeometry args={[1.5, 2.6, 32]} />
      <meshBasicMaterial color={color} transparent />
    </mesh>
  );
}

/* ---------- Enemies / Pods ---------- */
function useEnemyWave(group: React.MutableRefObject<THREE.Group>, bullets: React.MutableRefObject<Bullet[]>) {
  const list = useRef<Enemy[]>([]);
  const pods = useRef<DropPod[]>([]);
  const wave = useRef(1);
  const kills = useRef(0);

  const spawnEnemy = (x: number, z: number) => {
    const m = new THREE.Mesh(
      new THREE.DodecahedronGeometry(6),
      new THREE.MeshStandardMaterial({ color: "#ff4757", roughness: 0.9 })
    );
    m.castShadow = true;
    m.position.set(x, 6, z);
    group.current.add(m);
    list.current.push({
      pos: m.position.clone(),
      vel: new THREE.Vector3(rand(-1, 1), 0, rand(6, 10)),
      hp: 3,
      alive: true,
      mesh: m,
    });
  };

  const spawnWave = () => {
    const n = 12 + wave.current * 4;
    for (let i = 0; i < n; i++) {
      spawnEnemy(rand(-900, 900), -rand(300, 1400));
    }
    // pods
    const p = 3 + Math.floor(wave.current / 2);
    for (let i = 0; i < p; i++) {
      pods.current.push({
        pos: new THREE.Vector3(rand(-900, 900), 260 + rand(0, 120), -rand(400, 1200)),
        vy: -rand(24, 36),
        alive: true,
      });
    }
  };

  const nextWave = () => {
    wave.current++;
    spawnWave();
  };

  const update = (dt: number) => {
    // pods fall then burst enemies
    pods.current.forEach((pod) => {
      if (!pod.alive) return;
      pod.pos.y += pod.vy * dt;
      if (pod.pos.y <= 8) {
        pod.alive = false;
        // burst: 4-7 enemies
        const n = 4 + Math.floor(Math.random() * 4);
        for (let i = 0; i < n; i++) spawnEnemy(pod.pos.x + rand(-18, 18), pod.pos.z + rand(-18, 18));
      }
    });

    // basic march forward; wrap when across player
    list.current.forEach((en) => {
      if (!en.alive || !en.mesh) return;
      en.pos.addScaledVector(en.vel, dt * 5);
      if (en.pos.x < -1200 || en.pos.x > 1200) en.vel.x *= -1;
      if (en.pos.z > 300) en.pos.z = -1400;
      en.mesh.position.copy(en.pos);
    });

    // bullets hit enemies
    bullets.current.forEach((b) => {
      if (b.owner === "enemy") return;
      list.current.forEach((en) => {
        if (!en.alive || !en.mesh) return;
        if (b.mesh.position.distanceTo(en.pos) < 9) {
          en.hp -= b.dmg;
          if (b.pierce) b.pierce -= 1;
          if (!b.pierce || b.pierce <= 0) b.mesh.userData.dead = true;
          if (en.hp <= 0) {
            en.alive = false;
            kills.current += 1;
            en.mesh.visible = false;
            en.mesh.userData.boom = true;
          }
        }
      });
    });

    // clean bullets
    bullets.current = bullets.current.filter((b) => {
      const p = b.mesh.position;
      const keep = !b.mesh.userData.dead && p.length() < 5000 && Math.abs(p.y) < 800;
      if (!keep) b.mesh.removeFromParent();
      return keep;
    });

    // all dead? trigger next
    if (list.current.every((e) => !e.alive)) nextWave();
  };

  return { list, pods, wave, kills, spawnWave, update };
}

/* ---------- Ally Drone ---------- */
function AllyDrone({
  player,
  bullets,
}: {
  player: React.MutableRefObject<THREE.Mesh>;
  bullets: React.MutableRefObject<Bullet[]>;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const t = useRef(0);
  useFrame((_, dt) => {
    t.current += dt;
    const r = 28, h = 24;
    const px = player.current.position.x + Math.cos(t.current * 1.8) * r;
    const pz = player.current.position.z + Math.sin(t.current * 1.8) * r;
    ref.current.position.set(px, player.current.position.y + h, pz);

    // auto fire forward occasionally
    if (Math.random() < 0.033) {
      const cyl = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 10, 6),
        new THREE.MeshBasicMaterial({ color: "#7dffda" })
      );
      cyl.rotation.x = Math.PI / 2;
      cyl.position.copy(ref.current.position).add(new THREE.Vector3(0, -2, -6));
      ref.current.parent?.add(cyl);
      bullets.current.push({ mesh: cyl, vel: new THREE.Vector3(0, 0, -260), dmg: 1, owner: "ally", pierce: 0 });
    }
  });
  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[3.2, 16, 16]} />
      <meshStandardMaterial color="#00ffc8" emissive="#00ffc8" emissiveIntensity={0.4} />
      <Sparkles size={2} scale={4} count={20} speed={2} />
    </mesh>
  );
}

/* ---------- Player ---------- */
function PlayerRig({
  bullets,
  enemiesGroup,
  onStats,
}: {
  bullets: React.MutableRefObject<Bullet[]>;
  enemiesGroup: React.MutableRefObject<THREE.Group>;
  onStats: (s: { kills: number; minutes: number; wave: number }) => void;
}) {
  const player = useRef<THREE.Mesh>(null!);
  const keys = useKeys();
  const start = useRef(performance.now());
  const [weapon, setWeapon] = useState<Weapon>("BLASTER");
  const [droneOn, setDroneOn] = useState<boolean>(true);
  const droneAnchor = useRef<THREE.Group>(null!);

  // allow parent to access player
  (PlayerRig as any).playerRef = player;

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "1") setWeapon("BLASTER");
      if (k === "2") setWeapon("SPREAD");
      if (k === "3") setWeapon("RAIL");
      if (k === "4") setWeapon("ROCKET");
      if (k === "t") setDroneOn((v) => !v);
    };
    addEventListener("keydown", on);
    return () => removeEventListener("keydown", on);
  }, []);

  useFrame((_, dt) => {
    const k = keys.current;
    const m = player.current;
    const speed = (k["shift"] ? 130 : 80) * dt;
    if (k["w"] || k["arrowup"]) m.position.z -= speed;
    if (k["s"] || k["arrowdown"]) m.position.z += speed;
    if (k["a"] || k["arrowleft"]) m.position.x -= speed;
    if (k["d"] || k["arrowright"]) m.position.x += speed;

    // Fire
    if (k[" "]) {
      if (weapon === "BLASTER") {
        fireBullet(m, bullets, new THREE.Vector3(0, 0, -320), 1);
      } else if (weapon === "SPREAD") {
        const spread = [-0.25, 0, 0.25];
        spread.forEach((ang) => {
          const vel = new THREE.Vector3(Math.sin(ang) * 260, 0, -Math.cos(ang) * 260);
          fireBullet(m, bullets, vel, 1);
        });
      } else if (weapon === "RAIL") {
        // piercing beam
        const rail = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.8, 16, 4, 8),
          new THREE.MeshBasicMaterial({ color: "#bde3ff" })
        );
        rail.position.copy(m.position).add(new THREE.Vector3(0, 0, -10));
        m.parent?.add(rail);
        bullets.current.push({ mesh: rail, vel: new THREE.Vector3(0, 0, -540), dmg: 2, owner: "player", pierce: 4 });
      } else {
        // ROCKET (slow, aoe)
        const rocket = new THREE.Mesh(
          new THREE.ConeGeometry(2.2, 8, 10),
          new THREE.MeshStandardMaterial({ color: "#ffaa00", emissive: "#ff8800", emissiveIntensity: 0.4 })
        );
        rocket.position.copy(m.position).add(new THREE.Vector3(0, 0, -10));
        rocket.rotation.x = Math.PI / 2;
        m.parent?.add(rocket);
        rocket.userData.aoe = true;
        bullets.current.push({ mesh: rocket, vel: new THREE.Vector3(0, 0, -200), dmg: 3, owner: "player" });
      }
    }

    // Clamp
    m.position.x = clamp(m.position.x, -1150, 1150);
    m.position.z = clamp(m.position.z, -1200, 400);

    // End condition (demo): if player reaches far north and no enemies remain
    const allGone = enemiesGroup.current.children.every((c) => !c.visible);
    if (allGone && m.position.z < -1150) {
      const minutes = (performance.now() - start.current) / 60000;
      onStats({ kills: (window as any).__RBN_KILLS__ || 0, minutes, wave: (window as any).__RBN_WAVE__ || 1 });
    }

    // attach drone anchor to player
    if (droneAnchor.current) {
      droneAnchor.current.position.copy(m.position);
    }
  });

  return (
    <group>
      <mesh ref={player} position={[0, 9, 220]} castShadow>
        <capsuleGeometry args={[6, 12, 12, 20]} />
        <meshStandardMaterial color="#4aa3ff" roughness={0.6} metalness={0.15} />
      </mesh>
      <group ref={droneAnchor}>{droneOn && <AllyDrone player={player} bullets={bullets} />}</group>
      <Billboard position={[0, 26, 220]}>
        <Text fontSize={3} color="#cfe9ff">You</Text>
      </Billboard>
    </group>
  );
}

function fireBullet(origin: THREE.Mesh, bulletsRef: React.MutableRefObject<Bullet[]>, vel: THREE.Vector3, dmg: number) {
  const cyl = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 10, 6),
    new THREE.MeshBasicMaterial({ color: "#ffffff" })
  );
  cyl.rotation.x = Math.PI / 2;
  cyl.position.copy(origin.position).add(new THREE.Vector3(0, 6, -8));
  origin.parent?.add(cyl);
  bulletsRef.current.push({ mesh: cyl, vel, dmg, owner: "player" });
}

/* ---------- Main Scene ---------- */
export default function Game3D() {
  const { paused } = useGameStore();
  const [hud, setHud] = useState<{ zen: number; cred: number; shards: number }>({ zen: 0, cred: 0, shards: 0 });
  const [session, setSession] = useState<{ id?: string }>({});
  const [overlay, setOverlay] = useState<string | null>(null);

  const bullets = useRef<Bullet[]>([]);
  const effects = useRef<THREE.Group>(null!);
  const enemiesGroup = useRef<THREE.Group>(null!);

  const waveState = useRef({ wave: 1, kills: 0 });
  (window as any).__RBN_WAVE__ = waveState.current.wave;

  // Economy
  useEffect(() => {
    getBalance().then(setHud).catch(() => {});
    startSession().then((s) => setSession({ id: s.sessionId })).catch(() => {});
  }, []);

  // Enemy wave controller
  const { list, pods, wave, kills, spawnWave, update } = useEnemyWave(enemiesGroup, bullets);

  useEffect(() => {
    spawnWave();
  }, []); // initial

  useFrame((_, dt) => {
    if (paused || overlay) return;

    // advance bullets
    bullets.current.forEach((b) => {
      b.mesh.position.addScaledVector(b.vel, dt);
      // rocket splash
      if (b.mesh.userData.aoe && Math.random() < 0.01) {
        effects.current.add(<Boom at={b.mesh.position.clone()} /> as any);
      }
    });

    // enemy AI / hits
    update(dt);

    // cleanup enemy booms
    enemiesGroup.current.children.forEach((m) => {
      if ((m as any).userData?.boom) {
        const v = new THREE.Vector3().copy(m.position);
        const fx = new THREE.Mesh(
          new THREE.RingGeometry(1.8, 3.0, 32),
          new THREE.MeshBasicMaterial({ color: "#ff8080", transparent: true })
        );
        fx.position.copy(v);
        effects.current.add(fx);
        (m as any).userData.boom = false;
        // kill counter
        (window as any).__RBN_KILLS__ = ((window as any).__RBN_KILLS__ || 0) + 1;
      }
    });

    // track wave/kills
    waveState.current.wave = wave.current;
    waveState.current.kills = kills.current;
    (window as any).__RBN_WAVE__ = wave.current;
  });

  const onFinish = async (stats: { kills: number; minutes: number; wave: number }) => {
    if (!session.id) return setOverlay("Victory! (no session)");
    try {
      const r = await finalizeSession(session.id, { kills: stats.kills, rank: 1, minutes: stats.minutes });
      if (r?.wallet) setHud(r.wallet);
      setOverlay(`🎉 Victory! +${r?.reward?.cred ?? 0} CRED ${r?.reward?.zen ? " +1 ZEN" : ""}`);
    } catch {
      setOverlay("Victory! (reward error)");
    }
  };

  // Expose finish to PlayerRig via prop
  const handleFinish = (s: { kills: number; minutes: number; wave: number }) => onFinish(s);

  return (
    <div style={{ position: "relative", width: "100%", height: "72vh", border: "1px solid #1b2836", borderRadius: 16, background: "#02040a" }}>
      <Canvas shadows camera={{ position: [-80, 120, 280], fov: 55 }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[120, 220, 160]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
        <Sky sunPosition={[100, 20, 100]} turbidity={8} />
        <fog attach="fog" args={["#0b1117", 220, 1700]} />

        <group ref={effects} />
        <group ref={enemiesGroup} />

        <Terrain />

        {/* Player + controller */}
        <PlayerRig bullets={bullets} enemiesGroup={enemiesGroup} onStats={handleFinish} />

        {/* Visual stars for drama */}
        <Sparkles size={2.5} scale={[2400, 10, 2400]} position={[0, 120, -400]} count={300} speed={0.4} />
        <StatsGl />
      </Canvas>

      {/* HUD */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          color: "#e6eef7",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
        }}
      >
        <div style={{ position: "absolute", top: 10, left: 14, display: "flex", gap: 16 }}>
          <div>ZEN: <b>{hud.zen}</b></div>
          <div>CRED: <b>{hud.cred}</b></div>
          <div>SHARDS: <b>{hud.shards}</b></div>
        </div>
        <div style={{ position: "absolute", top: 10, right: 14, textAlign: "right" }}>
          <div>Wave: <b>{waveState.current.wave}</b></div>
          <div>Kills: <b>{waveState.current.kills}</b></div>
          <div style={{ opacity: 0.8, fontSize: 12 }}>
            1-4 switch weapon • T toggle drone • WASD move • Space shoot • Shift sprint
          </div>
        </div>

        {overlay && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,.6)",
              display: "grid",
              placeItems: "center",
              pointerEvents: "auto",
            }}
            onClick={() => setOverlay(null)}
          >
            <div style={{ background: "#0b1117", border: "1px solid #1b2836", padding: 16, borderRadius: 12 }}>
              {overlay}
              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>(click to continue)</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}