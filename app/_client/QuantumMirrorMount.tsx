"use client";
import dynamic from "next/dynamic";
const QuantumMirror = dynamic(() => import("./quantum-mirror"), { ssr: false, loading: () => null });
export default function QuantumMirrorMount(){ return <QuantumMirror/>; }
