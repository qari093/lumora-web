"use client";

import { useEffect } from "react";

export default function useSerenityTilt() {

useEffect(()=>{

const shell=document.querySelector(
".lumaspace-runtime-shell"
) as HTMLElement | null;

if(!shell) return;

let x=0;
let y=0;

const move=(e:DeviceOrientationEvent)=>{

const gx=(e.gamma ?? 0)*0.35;
const gy=(e.beta ?? 0)*0.18;

x=gx;
y=gy;

shell.style.setProperty(
"--tilt-x",
`${x}px`
);

shell.style.setProperty(
"--tilt-y",
`${y}px`
);

};

window.addEventListener(
"deviceorientation",
move,
true
);

return ()=>{

window.removeEventListener(
"deviceorientation",
move,
true
);

};

},[]);

}
