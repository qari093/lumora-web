"use client";
export const tap = { whileTap: { scale: 0.96 } };
export const fadeSlide = { initial:{opacity:0,y:6}, animate:{opacity:1,y:0}, transition:{duration:.18} };
export const stagger = { animate:{ transition:{ staggerChildren: .06 } } };
export const chipVar = { initial:{opacity:0, x:-10}, animate:{opacity:1, x:0} };
export function haptic(ms=12){ if(typeof navigator!=="undefined" && "vibrate" in navigator){ try{ navigator.vibrate(ms); }catch{} } }
