"use client";
import React, { forwardRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";

type Props = { running:boolean; firing:boolean; position?:[number,number,number] };
export type HeroHandle = THREE.Mesh;

function CapsuleFallback(props:any){
  return (
    <mesh {...props} castShadow>
      <capsuleGeometry args={[6,12,12,20]} />
      <meshStandardMaterial color="#4aa3ff" roughness={0.6} metalness={0.15} />
    </mesh>
  );
}

export const Hero = forwardRef<HeroHandle, Props>(function Hero({ running, firing, position=[0,9,220] }, ref) {
  let gltf:any=null, error:any=null;
  try { gltf = useGLTF("/models/hero.glb"); } catch(e){ error=e; }
  const group = React.useRef<THREE.Group>(null!);
  let mixer:THREE.AnimationMixer|undefined, actions:Record<string,THREE.AnimationAction> = {};

  if (gltf?.animations?.length){
    const anim = useAnimations(gltf.animations, group);
    mixer = anim.mixer;
    actions = anim.actions as any;
    useEffect(()=>{
      const idle = actions["Idle"]||actions["idle"]; idle?.reset().fadeIn(0.2).play();
      return ()=>{ Object.values(actions).forEach(a=>a?.stop()); };
    },[]);
    useEffect(()=>{
      const idle=actions["Idle"]||actions["idle"];
      const run =actions["Run"] ||actions["run"] ||actions["Running"];
      if(running){ run?.reset().fadeIn(0.15).play(); idle?.fadeOut(0.15);}
      else { idle?.reset().fadeIn(0.15).play(); run?.fadeOut(0.15); }
    },[running]);
    useEffect(()=>{
      const shoot=actions["Shoot"]||actions["shoot"];
      if(firing) shoot?.reset().fadeIn(0.05).play(); else shoot?.fadeOut(0.15);
    },[firing]);
    useFrame((_,dt)=>{ mixer?.update(dt); });
  }

  useFrame(()=>{
    if(ref && (ref as any).current && group.current){
      (ref as any).current.position.copy(group.current.position);
    }
  });

  if(!gltf || error){
    return <CapsuleFallback ref={ref as any} position={position} />;
  }

  return (
    <group ref={group} position={position} castShadow>
      <primitive object={gltf.scene} />
      {/* invisible mesh to expose a .position ref like a Mesh */}
      <mesh ref={ref as any} position={[0,0,0]} visible={false}/>
    </group>
  );
});
useGLTF.preload("/models/hero.glb");
