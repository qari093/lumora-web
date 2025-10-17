import React, { useRef, useEffect } from "react";
export default function Page(){
  const ref = useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    c.width=600;c.height=600;
    const ctx=c.getContext("2d")!;
    ctx.fillStyle="#fafafa";ctx.fillRect(0,0,c.width,c.height);
    ctx.strokeStyle="#333";
    for(let i=0;i<10;i++){ctx.beginPath();ctx.moveTo(i*60,0);ctx.lineTo(i*60,600);ctx.stroke();}
    for(let j=0;j<10;j++){ctx.beginPath();ctx.moveTo(0,j*60);ctx.lineTo(600,j*60);ctx.stroke();}
    ctx.fillStyle="blue";ctx.fillRect(0,0,60,60);
    ctx.fillStyle="green";ctx.fillRect(540,540,60,60);
  },[]);
  return (
    <div style={{padding:24,fontFamily:"sans-serif"}}>
      <h1>Puzzle Labyrinth Engine</h1>
      <canvas ref={ref} style={{border:"2px solid #999",borderRadius:12}}/>
    </div>
  );
}
