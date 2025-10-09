import React,{useRef,useEffect} from "react";
export default function Page(){
  const ref=useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{const c=ref.current;if(!c)return;c.width=800;c.height=440;const s=c.getContext("2d")!;
    s.fillStyle="#0b0b0b";s.fillRect(0,0,c.width,c.height);
    s.fillStyle="rgba(255,255,255,.06)";for(let i=0;i<8;i++){s.fillRect(60+i*90,120,70,220);}
    // cone of vision
    s.fillStyle="rgba(255,0,0,.18)";s.beginPath();s.moveTo(500,220);s.lineTo(780,80);s.lineTo(780,360);s.closePath();s.fill();
    s.fillStyle="#fff";s.font="14px sans-serif";s.fillText("Noise: low | Visibility: medium",20,28);
  },[]);
  return (<div style={{padding:24,fontFamily:"sans-serif"}}><h1>Stealth Operative X Engine</h1><canvas ref={ref} style={{border:"2px solid #222",borderRadius:12}}/></div>);
}
