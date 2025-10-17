// src/components/rbn3d/Game3DPlus.tsx
"use client";
import React from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Sky, StatsGl, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useGameStore } from "@/lib/gmar/store";
import { finalizeSession, getBalance, startSession } from "@/lib/zen/client";
import CinematicIntro from "@/components/rbn3d/CinematicIntro";
import { t } from "@/lib/i18n/rbn";

/* =========================[ INLINE HERO LOADER ]========================= */

type HeroName = "Aurora" | "Raven" | "Blaze" | "Hawk";

const HERO_PATHS: Record<HeroName, string> = {
  Aurora: "/models/heroes/Aurora/Hero_Aurora.glb",
  Raven:  "/models/heroes/Raven/Hero_Raven.glb",
  Blaze:  "/models/heroes/Blaze/Hero_Blaze.glb",
  Hawk:   "/models/heroes/Hawk/Hero_Hawk.glb",
};

function useAssetExists(url: string) {
  const [ok, setOk] = React.useState<boolean>(false);
  React.useEffect(() => {
    let alive = true;
    fetch(url, { method: "HEAD" })
      .then((r) => alive && setOk(r.ok))
      .catch(() => alive && setOk(false));
    return () => { alive = false; };
  }, [url]);
  return ok;
}

/** Fallback capsule hero (stylized) */
function HeroFallback({
  name,
  position = [0, 9, 220],
  scale = 2.4,
}: {
  name: HeroName;
  position?: [number, number, number];
  scale?: number;
}) {
  const tint: Record<HeroName, string> = {
    Aurora: "#5bc0ff",
    Raven: "#2b2b2b",
    Blaze: "#ff8c00",
    Hawk: "#9bb6ff",
  };
  return (
    <mesh castShadow position={position as any} scale={scale}>
      <capsuleGeometry args={[8, 26, 8, 16]} />
      <meshStandardMaterial color={tint[name]} metalness={0.1} roughness={0.55} />
    </mesh>
  );
}

/** Actual GLTF hero loader (safe to use hooks inside because component is mounted conditionally) */
function HeroGLB({
  url,
  position = [0, 9, 220],
  scale = 2.4,
}: {
  url: string;
  position?: [number, number, number];
  scale?: number;
}) {
  const { scene } = useGLTF(url) as any; // Suspense-friendly in R3F
  return <primitive object={scene} position={position as any} scale={scale} castShadow />;
}

/** Wrapper that uses fallback or GLB */
function HeroGLTF({
  name,
  position = [0, 9, 220],
  scale = 2.4,
}: {
  name: HeroName;
  position?: [number, number, number];
  scale?: number;
}) {
  const url = HERO_PATHS[name];
  const ok = useAssetExists(url);
  if (!ok) {
    return <HeroFallback name={name} position={position} scale={scale} />;
  }
  return <HeroGLB url={url} position={position} scale={scale} />;
}

// Preload (no-op if files missing)
try {
  useGLTF.preload?.(HERO_PATHS.Aurora);
  useGLTF.preload?.(HERO_PATHS.Raven);
  useGLTF.preload?.(HERO_PATHS.Blaze);
  useGLTF.preload?.(HERO_PATHS.Hawk);
} catch {}

/* =============================[ TERRAIN ]================================ */

function Terrain() {
  const g = React.useMemo(() => {
    const geom = new THREE.PlaneGeometry(2400, 2400, 200, 200);
    geom.rotateX(-Math.PI / 2);
    const p = geom.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      p.setY(i, (Math.sin(x * 0.01) + Math.cos(z * 0.01)) * 2 + Math.sin((x + z) * 0.005) * 4);
    }
    p.needsUpdate = true;
    return geom;
  }, []);
  return (
    <mesh geometry={g} receiveShadow>
      <meshStandardMaterial color="#1e2b23" roughness={1} />
    </mesh>
  );
}

/* =============================[ GAMEPLAY ]=============================== */

function Gameplay({ onFinish }: { onFinish: (kills: number) => void }) {
  const heroRef = React.useRef<THREE.Object3D>(null!);
  const sceneRef = React.useRef<THREE.Group>(null!);

  React.useEffect(() => {
    // Ensure the hero reference exists at the same position as the visible model
    if (heroRef.current) {
      heroRef.current.position.set(0, 9, 220);
    }

    const scene = sceneRef.current;
    const enemies: Array<{ m: THREE.Mesh; v: THREE.Vector3; hp: number }> = [];
    for (let i = 0; i < 22; i++) {
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(6, 16, 16),
        new THREE.MeshStandardMaterial({ color: "#ff4757" })
      );
      m.castShadow = true;
      m.position.set((Math.random() - 0.5) * 900, 8, -Math.random() * 1200);
      scene.add(m);
      enemies.push({ m, v: new THREE.Vector3((Math.random() - 0.5) * 1, 0, 2 + Math.random() * 6), hp: 3 });
    }

    const bullets: Array<{ mesh: THREE.Mesh; vel: THREE.Vector3; dmg: number }> = [];

    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        const cyl = new THREE.Mesh(
          new THREE.CylinderGeometry(1, 1, 10, 6),
          new THREE.MeshBasicMaterial({ color: "#ffffff" })
        );
        cyl.rotation.x = Math.PI / 2;
        const start =
          heroRef.current?.position?.clone() ??
          new THREE.Vector3(0, 9, 220);
        cyl.position.copy(start).add(new THREE.Vector3(0, 6, -8));
        scene.add(cyl);
        bullets.push({ mesh: cyl, vel: new THREE.Vector3(0, 0, -320), dmg: 1 });
      }
    };
    addEventListener("keydown", onKey);

    let kills = 0;
    (window as any).__RBN_KILLS__ = 0;
    const clock = new THREE.Clock();
    let stopped = false;

    function loop() {
      if (stopped) return;
      const dt = clock.getDelta();

      enemies.forEach((e) => {
        if (e.hp <= 0) return;
        e.m.position.addScaledVector(e.v, dt * 5);
        if (e.m.position.z > 300) e.m.position.z = -1200;
      });

      bullets.forEach((b) => {
        b.mesh.position.addScaledVector(b.vel, dt);
        enemies.forEach((e) => {
          if (e.hp > 0 && b.mesh.position.distanceTo(e.m.position) < 9) {
            e.hp -= 1;
            b.mesh.userData.dead = true;
            if (e.hp <= 0) {
              e.m.visible = false;
              kills++;
              (window as any).__RBN_KILLS__ = kills;
            }
          }
        });
      });

      for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].mesh.userData.dead || bullets[i].mesh.position.length() > 5000) {
          bullets[i].mesh.removeFromParent();
          bullets.splice(i, 1);
        }
      }

      if (kills >= 22) {
        stopped = true;
        onFinish(kills);
        return;
      }
      requestAnimationFrame(loop);
    }
    loop();

    return () => {
      removeEventListener("keydown", onKey);
      stopped = true;
    };
  }, [onFinish]);

  return (
    <group ref={sceneRef}>
      <Terrain />
      <group ref={heroRef as any} />
    </group>
  );
}

/* ===========================[ MAIN COMPONENT ]=========================== */

export default function Game3DPlus() {
  const L = t();
  const { paused } = useGameStore();

  const [hud, setHud] = React.useState({ zen: 0, cred: 0, shards: 0 });
  const [session, setSession] = React.useState<{ id?: string }>({});
  const [showCine, setShowCine] = React.useState(true);
  const [currentHero, setCurrentHero] = React.useState<HeroName>(() => {
    try {
      return (localStorage.getItem("rbn:hero3d") as HeroName) || "Aurora";
    } catch {
      return "Aurora";
    }
  });

  React.useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key === "1") setCurrentHero("Aurora");
      if (e.key === "2") setCurrentHero("Raven");
      if (e.key === "3") setCurrentHero("Blaze");
      if (e.key === "4") setCurrentHero("Hawk");
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);
  React.useEffect(() => {
    try { localStorage.setItem("rbn:hero3d", currentHero); } catch {}
  }, [currentHero]);

  React.useEffect(() => {
    getBalance().then(setHud).catch(() => {});
    startSession()
      .then((s) => setSession({ id: s.sessionId }))
      .catch(() => {});
  }, []);

  const onFinish = React.useCallback(
    async (kills: number) => {
      try {
        if (!session.id) return;
        const r = await finalizeSession(session.id, { kills, rank: 1, minutes: 1 });
        if (r?.wallet) setHud(r.wallet);
        alert(`Victory! +${r?.reward?.cred ?? 0} CRED${r?.reward?.zen ? " +1 ZEN" : ""}`);
      } catch {
        // ignore
      }
    },
    [session.id]
  );

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "72vh",
        border: "1px solid #1b2836",
        borderRadius: 16,
        background: "#02040a",
      }}
    >
      {showCine ? (
        <CinematicIntro zen={hud.zen} onDone={() => setShowCine(false)} />
      ) : (
        <Canvas shadows camera={{ position: [-80, 120, 280], fov: 55 }}>
          <ambientLight intensity={0.35} />
          <directionalLight position={[120, 220, 160]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
          <Sky sunPosition={[100, 20, 100]} turbidity={8} />
          <fog attach="fog" args={["#0b1117", 220, 1700]} />

          <Gameplay onFinish={onFinish} />
          <HeroGLTF name={currentHero} position={[0, 9, 220]} />

          <EffectComposer>
            <Bloom mipmapBlur intensity={0.8} radius={0.6} luminanceThreshold={0.6} />
          </EffectComposer>
          <StatsGl />
        </Canvas>
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          color: "#e6eef7",
          fontFamily: "system-ui,-apple-system,Segoe UI,Roboto",
        }}
      >
        <div style={{ position: "absolute", top: 10, left: 14, display: "flex", gap: 16 }}>
          <div>ZEN: <b>{hud.zen}</b></div>
          <div>CRED: <b>{hud.cred}</b></div>
          <div>SHARDS: <b>{hud.shards}</b></div>
        </div>

        {!showCine && (
          <div style={{ position: "absolute", top: 10, right: 14, textAlign: "right", opacity: 0.85 }}>
            {L.hudTips} • 1/2/3/4: switch hero
          </div>
        )}
      </div>
    </div>
  );
}