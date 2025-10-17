import React,{useRef,useEffect} from "react";
export default function Page(){
  const cRef=useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{const c=cRef.current;if(!c)return;c.width=800;c.height=420;const d=c.getContext("2d")!;
    d.fillStyle="#221100";d.fillRect(0,0,c.width,c.height);
    d.fillStyle="#8b4513";for(let i=0;i<8;i++){d.fillRect(60+i*85,300,60,16);}
    d.fillStyle="#fff";d.font="bold 16px sans-serif";d.fillText("Combo: 3 | Stamina: 82%",20,28);
  },[]);
  return (<div style={{padding:24,fontFamily:"sans-serif"}}><h1>Martial Arts Dojo Engine</h1><canvas ref={cRef} style={{border:"2px solid #642",borderRadius:12}}/></div>);
}
