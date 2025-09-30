import React,{useRef,useEffect} from "react";
export default function Page(){
  const ref=useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{const c=ref.current;if(!c)return;c.width=820;c.height=440;const h=c.getContext("2d")!;
    const grd=h.createLinearGradient(0,0,0,440);grd.addColorStop(0,"#000");grd.addColorStop(1,"#120");h.fillStyle=grd;h.fillRect(0,0,c.width,c.height);
    h.fillStyle="rgba(255,0,0,.08)";for(let i=0;i<6;i++){h.fillRect(80+i*120,180,60,180);}
    h.fillStyle="#fff";h.font="bold 16px sans-serif";h.fillText("Sanity 64% — find light",20,28);
  },[]);
  return (<div style={{padding:24,fontFamily:"sans-serif"}}><h1>Horror Survival Realm Engine</h1><canvas ref={ref} style={{border:"2px solid #400",borderRadius:12}}/></div>);
}
