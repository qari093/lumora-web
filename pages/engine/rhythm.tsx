import React, { useRef, useEffect } from "react";
export default function Page(){
  const ref = useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    c.width=800;c.height=300;
    const ctx=c.getContext("2d")!;
    ctx.fillStyle="#000";ctx.fillRect(0,0,c.width,c.height);
    ctx.strokeStyle="lime";ctx.lineWidth=2;
    ctx.beginPath();for(let x=0;x<800;x+=20){
      const y=150+Math.sin(x*0.05)*50;
      ctx.lineTo(x,y);
    }ctx.stroke();
    ctx.fillStyle="white";ctx.font="16px sans-serif";ctx.fillText("Beat Line",20,20);
  },[]);
  return (
    <div style={{padding:24,fontFamily:"sans-serif"}}>
      <h1>Music Rhythm Saga Engine</h1>
      <canvas ref={ref} style={{border:"2px solid #0f0",borderRadius:12}}/>
    </div>
  );
}
