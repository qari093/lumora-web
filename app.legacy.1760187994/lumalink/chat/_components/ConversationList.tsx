"use client";
import React from "react";
import type { Room } from "../../_lib/useChat";

export default function ConversationList({
  rooms, activeId, onSelect,
}: { rooms: Room[]; activeId: string|null; onSelect: (id: string) => void; }) {
  return (
    <div style={{
      width: 280, minWidth: 240, background: "rgba(255,255,255,0.04)",
      borderRight: "1px solid rgba(255,255,255,0.10)", height: "100dvh", overflowY: "auto"
    }}>
      <div style={{ padding: 12, position:"sticky", top:0, background:"rgba(0,0,0,0.35)", backdropFilter:"blur(6px)" }}>
        <input placeholder="Search…" style={{
          width:"100%", padding:"10px 12px", borderRadius:8,
          border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.06)", color:"#fff"
        }}/>
      </div>
      <div>
        {rooms.map(r => (
          <button key={r.id}
            onClick={()=>onSelect(r.id)}
            style={{
              display:"block", width:"100%", textAlign:"left", padding:"12px",
              border:"none", background: r.id===activeId ? "rgba(255,255,255,0.10)" : "transparent",
              color:"#fff", cursor:"pointer", borderBottom:"1px solid rgba(255,255,255,0.06)"
            }}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
              <strong>{r.title || r.id}</strong>
              {!!r.unread && <span style={{
                fontSize:12, padding:"2px 8px", borderRadius:999,
                background:"#16a34a", color:"#0b0f12", fontWeight:900
              }}>{r.unread}</span>}
            </div>
            <div style={{opacity:.7, fontSize:13, marginTop:4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
              {r.last || "—"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
