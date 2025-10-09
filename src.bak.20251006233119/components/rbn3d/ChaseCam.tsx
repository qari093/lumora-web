"use client";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import React, { useRef } from "react";

export default function ChaseCam({ target, offset=[-16, 12, 24], lookAt=[0,6,-10], stiffness=0.08 }:{
  target: React.MutableRefObject<THREE.Mesh>;
  offset?: [number,number,number];
  lookAt?: [number,number,number];
  stiffness?: number;
}){
  const { camera } = useThree();
  const vel = useRef(new THREE.Vector3());
  const off = new THREE.Vector3(...offset);
  const la  = new THREE.Vector3(...lookAt);
  useFrame((_,dt)=>{
    if(!target.current) return;
    const desired = new THREE.Vector3().copy(target.current.position).add(off);
    const to = new THREE.Vector3().subVectors(desired, camera.position).multiplyScalar(stiffness);
    vel.current.addScaledVector(to, dt*60);
    vel.current.multiplyScalar(0.9);
    camera.position.add(vel.current);
    camera.lookAt(new THREE.Vector3().copy(target.current.position).add(la));
  });
  return null;
}
