import React,{useRef,useEffect} from "react";
export default function Page(){
  const ref=useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{const c=ref.current;if(!c)return;c.width=840;c.height=460;const g=c.getContext("2d")!;
    g.fillStyle="#0a6a2b";g.fillRect(0,0,c.width,c.height); // field
    g.strokeStyle="#fff";g.lineWidth=2;g.strokeRect(40,40,760,380);
    g.beginPath();g.arc(420,230,60,0,Math.PI*2);g.stroke();
    g.fillStyle="#fff";g.font="bold 16px sans-serif";g.fillText("Score 1–0 | 68:23",20,28);
  },[]);
  return (<div style={{padding:24,fontFamily:"sans-serif"}}><h1>Sports Legends Engine</h1><canvas ref={ref} style={{border:"2px solid #396",borderRadius:12}}/></div>);
}
