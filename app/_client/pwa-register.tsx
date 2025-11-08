"use client";
import { useEffect } from "react";
export default function PwaRegister(){
  useEffect(()=>{
    if(typeof window==="undefined" || !("serviceWorker" in navigator)) return;
    (async ()=>{
      try{
        const reg = await navigator.serviceWorker.register("/sw.js",{scope:"/"});
        reg.addEventListener("updatefound", ()=>{
          const nw = reg.installing; if(!nw) return;
          nw.addEventListener("statechange", ()=>{
            if(nw.state==="installed" && navigator.serviceWorker.controller){
              document.dispatchEvent(new CustomEvent("pwa:update-available"));
            }
          });
        });
      }catch(e){ console.warn("SW register failed:", e); }
    })();
  },[]);
  return null;
}
