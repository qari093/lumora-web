import React,{useRef,useEffect} from "react";
export default function Page(){
  const r=useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{const c=r.current;if(!c)return;c.width=820;c.height=460;const t=c.getContext("2d")!;
    t.fillStyle="#2f2f2f";t.fillRect(0,0,c.width,c.height);
    t.fillStyle="#6b8e23";t.fillRect(0,340,c.width,120);
    t.fillStyle="#8b4513";t.fillRect(60,300,120,40);t.fillRect(640,300,120,40);
    t.fillStyle="#fff";t.font="bold 16px sans-serif";t.fillText("Supply Lines Secure",20,28);
  },[]);
  return (<div style={{padding:24,fontFamily:"sans-serif"}}><h1>Historical Warfront Engine</h1><canvas ref={r} style={{border:"2px solid #555",borderRadius:12}}/></div>);
}
