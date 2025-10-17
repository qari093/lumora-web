"use client";
import { useEffect, useState } from "react";
type BatteryInfo = { supported:boolean; level:number; charging:boolean; saver:boolean; };
export function useBattery(): BatteryInfo {
  const [info,setInfo]=useState<BatteryInfo>({supported:false,level:1,charging:true,saver:false});
  useEffect(()=>{
    let mounted=true;
    (async ()=>{
      try{
        const nav:any = navigator;
        if(nav.getBattery){
          const b = await nav.getBattery();
          const update = ()=> mounted && setInfo({
            supported:true,
            level: typeof b.level==="number" ? b.level : 1,
            charging: !!b.charging,
            saver: ("connection" in navigator && (navigator as any).connection?.saveData) || false
          });
          b.addEventListener("levelchange", update);
          b.addEventListener("chargingchange", update);
          update();
          return;
        }
      }catch{}
      const saver = (navigator as any)?.connection?.saveData === true;
      if(mounted) setInfo({supported:false, level:1, charging:true, saver});
    })();
    return ()=>{ mounted=false; };
  },[]);
  return info;
}
