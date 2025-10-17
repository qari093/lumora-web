"use client";
import { useEffect, useState } from "react";

export function useLowPower(){
  const [lowPower,setLow] = useState(false);
  useEffect(()=>{
    const read=()=> setLow(typeof window!=="undefined" && localStorage.getItem("lumora.lowPower")==="true");
    read();
    const on=()=>read();
    window.addEventListener("lumora:lowPowerChanged", on);
    return ()=>window.removeEventListener("lumora:lowPowerChanged", on);
  },[]);
  const setLowPower=(v:boolean)=>{
    if(typeof window==="undefined") return;
    localStorage.setItem("lumora.lowPower", v ? "true" : "false");
    setLow(v);
    window.dispatchEvent(new Event("lumora:lowPowerChanged"));
  };
  return { lowPower, setLowPower };
}
