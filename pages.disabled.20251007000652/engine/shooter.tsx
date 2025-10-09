import React, { useRef, useEffect } from "react";
export default function Page(){
  const ref = useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    c.width=800;c.height=480;
    const ctx=c.getContext("2d")!;
    ctx.fillStyle="#111";ctx.fillRect(0,0,c.width,c.height);
    // target
    const x=400,y=240;
    ctx.beginPath();ctx.arc(x,y,40,0,Math.PI*2);
    ctx.fillStyle="red";ctx.fill();
    ctx.fillStyle="white";ctx.font="bold 18px sans-serif";ctx.fillText("Target",x-30,y+5);
  },[]);
  return (
    <div style={{padding:24,fontFamily:"sans-serif"}}>
      <h1>Shooter Arena Engine</h1>
      <canvas ref={ref} style={{border:"2px solid #444",borderRadius:12}}/>
    </div>
  );
}
