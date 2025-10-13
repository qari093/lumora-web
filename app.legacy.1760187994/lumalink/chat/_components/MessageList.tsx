"use client";
import React, { useEffect, useRef } from "react";
import type { Message } from "../../_lib/useChat";

export default function MessageList({
  items, typingFrom,
}: { items: Message[]; typingFrom?: string | null; }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior:"smooth" }); }, [items, typingFrom]);

  return (
    <div ref={ref} style={{ flex:1, overflowY:"auto", padding:"12px 16px" }}>
      {items.map(m => (
        <div key={m.id} style={{ display:"flex", justifyContent: m.mine ? "flex-end" : "flex-start", marginBottom: 8 }}>
          <div style={{
            maxWidth:"72%", padding:"8px 12px", borderRadius: 12,
            background: m.mine ? "linear-gradient(180deg,#fbd34d,#d4a017)" : "rgba(255,255,255,0.08)",
            color: m.mine ? "#111" : "#fff", border: m.mine ? "none" : "1px solid rgba(255,255,255,0.10)"
          }}>
            <div style={{fontSize:13, opacity:.8, marginBottom:2}}>{m.mine ? "You" : m.from}</div>
            <div style={{whiteSpace:"pre-wrap"}}>{m.text}</div>
          </div>
        </div>
      ))}
      {typingFrom ? (
        <div style={{ opacity:.8, fontSize:12, marginTop:6 }}>✍️ {typingFrom} is typing…</div>
      ) : null}
    </div>
  );
}
