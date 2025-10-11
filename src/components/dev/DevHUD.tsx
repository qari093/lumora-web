"use client";
import React from "react";
import MicroInsights from "./MicroInsights";

const KEY = "lumora_devhud_visible";

export default function DevHUD(){
  const [visible, setVisible] = React.useState<boolean>(() => {
    try{ const v = localStorage.getItem(KEY); return v ? v === "1" : true; }catch{ return true; }
  });
  React.useEffect(()=>{
    const onKey = (e: KeyboardEvent) => {
      if(e.shiftKey && (e.key === "I" || e.key === "i")){
        e.preventDefault();
        setVisible(v => {
          const nv = !v; try{ localStorage.setItem(KEY, nv ? "1":"0"); }catch{}
          return nv;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return ()=>window.removeEventListener("keydown", onKey);
  }, []);
  if(!visible) return null;
  return <MicroInsights />;
}
