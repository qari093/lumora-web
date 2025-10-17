import React, { useRef, useEffect } from "react";
export default function Page(){
  const ref = useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    c.width=800;c.height=480;
    const ctx=c.getContext("2d")!;
    ctx.fillStyle="#222";ctx.fillRect(0,0,c.width,c.height);
    ctx.fillStyle="gray";ctx.fillRect(200,0,400,480);
    ctx.strokeStyle="white";ctx.setLineDash([20,20]);
    ctx.beginPath();ctx.moveTo(400,0);ctx.lineTo(400,480);ctx.stroke();
    ctx.fillStyle="yellow";ctx.fillRect(370,400,60,80);
    ctx.fillStyle="white";ctx.fillText("Speed: 120 km/h",20,30);
  },[]);
  return (
    <div style={{padding:24,fontFamily:"sans-serif"}}>
      <h1>Racing Overdrive Engine</h1>
      <canvas ref={ref} style={{border:"2px solid #333",borderRadius:12}}/>
    </div>
  );
}
