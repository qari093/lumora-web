import React,{useRef,useEffect} from "react";
export default function Page(){
  const ref=useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{const c=ref.current;if(!c)return;c.width=820;c.height=480;const g=c.getContext("2d")!;
    const grd=g.createLinearGradient(0,0,0,480);grd.addColorStop(0,"#2c003e");grd.addColorStop(1,"#12001a");
    g.fillStyle=grd;g.fillRect(0,0,c.width,c.height);
    // crown
    g.fillStyle="#ffd700";g.beginPath();g.moveTo(160,340);g.lineTo(300,200);g.lineTo(360,340);g.lineTo(220,340);g.closePath();g.fill();
    g.fillStyle="#fff";g.font="bold 16px sans-serif";g.fillText("Crown charge ready",20,28);
  },[]);
  return (<div style={{padding:24,fontFamily:"sans-serif"}}><h1>Fantasy Crown Wars Engine</h1><canvas ref={ref} style={{border:"2px solid #533",borderRadius:12}}/></div>);
}
