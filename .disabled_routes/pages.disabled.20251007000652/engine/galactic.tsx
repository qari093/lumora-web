import React,{useRef,useEffect} from "react";
export default function Page(){
  const r=useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{const c=r.current;if(!c)return;c.width=820;c.height=480;const k=c.getContext("2d")!;
    k.fillStyle="#03040a";k.fillRect(0,0,c.width,c.height);
    // stars
    k.fillStyle="#fff";for(let i=0;i<120;i++){k.fillRect(Math.random()*820,Math.random()*480,1,1);}
    // planets
    k.fillStyle="#3498db";k.beginPath();k.arc(220,260,40,0,Math.PI*2);k.fill();
    k.fillStyle="#e74c3c";k.beginPath();k.arc(560,180,28,0,Math.PI*2);k.fill();
    k.fillStyle="#fff";k.font="bold 16px sans-serif";k.fillText("Fleet: 5 | Sectors: 2",20,28);
  },[]);
  return (<div style={{padding:24,fontFamily:"sans-serif"}}><h1>Galactic Conquest Engine</h1><canvas ref={r} style={{border:"2px solid #445",borderRadius:12}}/></div>);
}
