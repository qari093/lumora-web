// Location: app/lumaspace/memory/page.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useState } from "react";

function MemoryNode({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
    </mesh>
  );
}

function MemoryPalace() {
  const [nodes] = useState(
    Array.from({ length: 25 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 12,
      ] as [number, number, number],
      color: `hsl(${Math.random() * 360}, 80%, 60%)`,
    }))
  );

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} />
      <Stars radius={80} depth={50} count={1000} factor={4} fade speed={1} />
      {nodes.map((node, i) => (
        <MemoryNode key={i} position={node.position} color={node.color} />
      ))}
    </>
  );
}

export default function MemoryPalacePage() {
  return (
    <main className="w-full h-screen bg-black text-white">
      <h1 className="absolute top-5 left-5 text-xl font-semibold">Memory Palace — Deep View</h1>
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <Suspense fallback={null}>
          <MemoryPalace />
          <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={1.5} />
        </Suspense>
      </Canvas>
    </main>
  );
}

console.log("Step 16.44 — Memory Palace Deep View loaded");