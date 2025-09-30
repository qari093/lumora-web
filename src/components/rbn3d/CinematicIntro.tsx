"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import React, { useEffect, useState } from "react";

export default function CinematicIntro({ onFinish }:{ onFinish?:()=>void }) {
  const [done,setDone] = useState(false);

  useEffect(()=>{
    const timer=setTimeout(()=>{
      setDone(true);
      onFinish?.();
    }, 5000); // 5 seconds cinematic
    return ()=>clearTimeout(timer);
  },[]);

  if(done) return null;

  return (
    <div style={{position:"absolute", inset:0, background:"black", zIndex:20}}>
      <Canvas camera={{ position:[0,0,8], fov:60 }}>
        <OrbitControls enableZoom={false} enablePan={false} />
        <ambientLight intensity={0.8}/>
        <directionalLight position={[5,5,5]} />
        <Text fontSize={1.2} color="gold" anchorX="center" anchorY="middle">
          Royale Battle Nexus
        </Text>
      </Canvas>
    </div>
  );
}
