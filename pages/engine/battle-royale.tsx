import React,{useRef,useEffect} from "react";
export default function Page(){
  const ref=useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{const c=ref.current;if(!c)return;c.width=800;c.height=480;const x=c.getContext("2d")!;
    x.fillStyle="#0e1222";x.fillRect(0,0,c.width,c.height);
    // shrinking circle
    x.strokeStyle="#ff4757";x.lineWidth=4;x.beginPath();x.arc(400,240,180,0,Math.PI*2);x.stroke();
    x.strokeStyle="#ffa502";x.setLineDash([8,8]);x.beginPath();x.arc(400,240,260,0,Math.PI*2);x.stroke();x.setLineDash([]);
    x.fillStyle="#fff";x.font="bold 16px sans-serif";x.fillText("Safe Zone shrinking…",20,28);
  },[]);
  return (<div style={{padding:24,fontFamily:"sans-serif"}}><h1>Battle Royale Nexus Engine</h1><canvas ref={ref} style={{border:"2px solid #333",borderRadius:12}}/></div>);
}
