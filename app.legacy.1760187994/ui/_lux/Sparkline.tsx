"use client";
import React from "react";
export default function Sparkline({ data, width=200, height=48, stroke="rgba(255,255,255,.9)" }:{
  data: number[], width?: number, height?: number, stroke?: string
}) {
  const pad = 4;
  const w = width, h = height;
  const min = Math.min(...data), max = Math.max(...data);
  const norm = (v:number) => max===min ? 0.5 : (v-min)/(max-min);
  const pts = data.map((v,i)=>{
    const x = pad + (i*(w-2*pad))/(data.length-1||1);
    const y = h - pad - norm(v)*(h-2*pad);
    return ;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={} role="img" aria-label="sparkline">
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
