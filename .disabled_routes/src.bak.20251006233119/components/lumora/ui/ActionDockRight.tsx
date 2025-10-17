"use client";
import React from "react";

type Props = {
  onLike?: ()=>void;
  onComment?: ()=>void;
  onShare?: ()=>void;
  onEarn?: ()=>void;
};

export default function ActionDockRight({ onLike, onComment, onShare, onEarn }: Props){
  const btn = (label:string, on?:()=>void, small=false) => (
    <button
      onClick={on}
      style={{
        width:56, height:56, borderRadius:16, border:"1px solid #2a2a2a",
        background:"#0f1115", color:"#e5e7eb", cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontWeight:700, fontSize: small? 11:13, opacity:.95, boxShadow:"0 6px 18px rgba(0,0,0,.35)"
      }}
    >{label}</button>
  );
  return (
    <div style={{
      position:"fixed", right:14, top:"50%", transform:"translateY(-50%)",
      display:"flex", flexDirection:"column", gap:10, zIndex:50,
    }}>
      {btn("Like", onLike)}
      {btn("Cmnt", onComment)}
      {btn("Share", onShare)}
      {btn("Earn", onEarn, true)}
    </div>
  );
}
