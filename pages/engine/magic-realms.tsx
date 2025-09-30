import React,{useRef,useEffect} from "react";
export default function Page(){
  const r=useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{const c=r.current;if(!c)return;c.width=820;c.height=460;const m=c.getContext("2d")!;
    m.fillStyle="#0c0830";m.fillRect(0,0,c.width,c.height);
    // spell circle
    m.strokeStyle="#7d5fff";m.lineWidth=3;m.beginPath();m.arc(410,230,120,0,Math.PI*2);m.stroke();
    m.strokeStyle="rgba(125,95,255,.4)";m.beginPath();m.arc(410,230,80,0,Math.PI*2);m.stroke();
    m.fillStyle="#fff";m.font="bold 16px sans-serif";m.fillText("Mana: 72% | Rune: Arcana",20,28);
  },[]);
  return (<div style={{padding:24,fontFamily:"sans-serif"}}><h1>Magic Realms Online Engine</h1><canvas ref={r} style={{border:"2px solid #75f",borderRadius:12}}/></div>);
}
