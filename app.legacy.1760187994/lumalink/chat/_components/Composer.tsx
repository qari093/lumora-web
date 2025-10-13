"use client";
import React from "react";

export default function Composer({
  value, onChange, onSend, onTyping,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onTyping: () => void;
}) {
  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    } else {
      onTyping();
    }
  };

  return (
    <div style={{
      display:"flex", gap:8, padding:12, borderTop:"1px solid rgba(255,255,255,0.10)",
      background:"rgba(255,255,255,0.04)"
    }}>
      <input
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        onKeyDown={onKey}
        placeholder="Type a message…"
        style={{
          flex:1, padding:"12px 14px", borderRadius:12,
          border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.06)", color:"#fff"
        }}
      />
      <button onClick={onSend} style={{
        padding:"12px 16px", borderRadius:12, border:"1px solid rgba(255,255,255,0.20)",
        background:"linear-gradient(180deg,#fbd34d,#d4a017)", color:"#111", fontWeight:900, cursor:"pointer"
      }}>Send</button>
    </div>
  );
}
