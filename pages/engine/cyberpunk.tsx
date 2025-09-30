import React,{useRef,useEffect} from "react";
export default function Page(){
  const ref=useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{const c=ref.current;if(!c)return;c.width=820;c.height=420;const y=c.getContext("2d")!;
    y.fillStyle="#06080f";y.fillRect(0,0,c.width,c.height);
    y.strokeStyle="#39ff14";y.setLineDash([6,6]);y.strokeRect(40,40,740,340);y.setLineDash([]);
    y.fillStyle="#39ff14";y.font="14px monospace";y.fillText("HACK: 78% — breach window open",56,64);
    // nodes
    for(let i=0;i<8;i++){const px=80+i*85,py=120+(i%2)*120;y.fillRect(px,py,6,6);}
  },[]);
  return (<div style={{padding:24,fontFamily:"sans-serif"}}><h1>Cyberpunk Infiltrator Engine</h1><canvas ref={ref} style={{border:"2px solid #0f0",borderRadius:12}}/></div>);
}
