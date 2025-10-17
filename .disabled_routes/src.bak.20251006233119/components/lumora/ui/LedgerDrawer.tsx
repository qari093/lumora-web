"use client";
import React from "react";
import { Tx } from "@/lib/zbn3d/useLedger";

type Props = {
  open: boolean;
  onClose: () => void;
  items: Tx[];
  onClear: () => void;
};

export default function LedgerDrawer({ open, onClose, items, onClear }: Props) {
  function exportJson(){
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "zencoin-ledger.json"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:100,
      pointerEvents: open? "auto":"none",
    }}>
      {/* backdrop */}
      <div onClick={onClose} style={{
        position:"absolute", inset:0, background:"rgba(0,0,0,.45)",
        opacity: open? 1:0, transition:"opacity .18s ease"
      }} />
      {/* panel */}
      <div style={{
        position:"absolute", left:16, top:"50%", transform:"translateY(-50%)",
        width: 420, maxWidth: "92vw",
        background:"#0b0f12", border:"1px solid #232323", borderRadius:16,
        padding:14, color:"#e5e7eb",
        boxShadow:"0 20px 60px rgba(0,0,0,.45)",
        opacity: open? 1:0, transition:"opacity .18s ease",
      }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
          <div style={{ fontWeight:900, fontSize:16 }}>Zencoin+ Ledger</div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={exportJson} style={miniBtn}>Export</button>
            <button onClick={onClear} style={miniBtn}>Clear</button>
            <button onClick={onClose} style={miniBtn}>Close</button>
          </div>
        </div>

        <div style={{ fontSize:12, opacity:.75, marginBottom:8 }}>
          Showing latest {items.length} entr{items.length===1?"y":"ies"}
        </div>

        <div style={{ display:"grid", gap:8, maxHeight: "60vh", overflow:"auto" }}>
          {items.length === 0 ? (
            <div style={{ padding:12, border:"1px dashed #2a2a2a", borderRadius:12, color:"#9ca3af" }}>
              No transactions yet. Make a purchase to see entries here.
            </div>
          ) : items.map((t)=>(
            <div key={t.id} style={{ border:"1px solid #2a2a2a", borderRadius:12, padding:10, background:"#0f1115" }}>
              <div style={{ display:"flex", justifyContent:"space-between", gap:8 }}>
                <div style={{ fontWeight:800 }}>{t.amount} {t.currency}</div>
                <div style={{ fontSize:12, opacity:.7 }}>{new Date(t.ts).toLocaleString()}</div>
              </div>
              <div style={{ fontSize:12, marginTop:6 }}>
                {t.note || "Purchase"}{t.campaign ? ` — ${t.campaign}` : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const miniBtn: React.CSSProperties = {
  padding:"6px 10px",
  borderRadius:8,
  background:"#1f2937",
  color:"#e5e7eb",
  border:"1px solid #374151",
  cursor:"pointer",
  fontSize:12,
  fontWeight:700
};
