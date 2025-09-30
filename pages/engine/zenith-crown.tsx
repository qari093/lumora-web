import React,{useRef,useEffect} from "react";
export default function Page(){
  const a=useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{const c=a.current;if(!c)return;c.width=860;c.height=420;const z=c.getContext("2d")!;
    const g=z.createLinearGradient(0,0,860,420);g.addColorStop(0,"#1b1a2e");g.addColorStop(1,"#162447");
    z.fillStyle=g;z.fillRect(0,0,c.width,c.height);
    // dynasty axes
    z.strokeStyle="#ffd700";z.lineWidth=2;z.strokeRect(60,60,740,300);
    z.fillStyle="#ffd700";z.font="bold 16px sans-serif";z.fillText("Emotion ↔️ Strategy Matrix",72,84);
    // point
    z.fillStyle="#ffca28";z.beginPath();z.arc(430,210,6,0,Math.PI*2);z.fill();
  },[]);
  return (<div style={{padding:24,fontFamily:"sans-serif"}}><h1>Zenith Crown Engine</h1><canvas ref={a} style={{border:"2px solid #dd0",borderRadius:12}}/></div>);
}
