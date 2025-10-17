"use client";
import React from "react";
import { useLocalState } from "@/lib/zbn3d/useLocalState";

type Stat = "HP" | "ATK" | "DEF" | "SPD";
type Slot = "Head" | "Chest" | "Arms" | "Legs" | "Core";

const DEFAULT_STATS: Record<Stat, number> = { HP:120, ATK:18, DEF:12, SPD:10 };
const DEFAULT_EQ: Record<Slot, string|null> = { Head:null, Chest:null, Arms:null, Legs:null, Core:null };

export default function LoadoutPanel(){
  const [hero] = useLocalState<string | null>("heroLab.hero", null);
  const [stats, setStats] = useLocalState<Record<Stat, number>>("heroLab.stats", DEFAULT_STATS);
  const [eq, setEq] = useLocalState<Record<Slot, string|null>>("heroLab.eq", DEFAULT_EQ);

  function bump(k: Stat, d:number){ setStats({ ...stats, [k]: Math.max(0, (stats[k]??0)+d) }); }
  function setSlot(s: Slot, v: string){ setEq({ ...eq, [s]: v || null }); }
  const slots: Slot[] = ["Head","Chest","Arms","Legs","Core"];

  return (
    <div style={{
      position:"fixed", bottom:16, left:"50%", transform:"translateX(-50%)",
      width:"min(1100px, 94vw)", background:"#0b0f12", border:"1px solid #232323",
      borderRadius:16, padding:12, zIndex:40, color:"#e5e7eb"
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
        <div style={{ minWidth:260 }}>
          <div style={{ fontWeight:800, fontSize:16, marginBottom:6 }}>Loadout {hero ? `— ${hero}` : ""}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:8 }}>
            {(Object.keys(DEFAULT_STATS) as Stat[]).map(k=>(
              <div key={k} style={{ border:"1px solid #2a2a2a", borderRadius:12, padding:8 }}>
                <div style={{ fontSize:12, opacity:.75 }}>{k}</div>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:6 }}>
                  <button onClick={()=>bump(k,-1)} style={miniBtn}>-</button>
                  <div style={{ fontWeight:800 }}>{stats[k]}</div>
                  <button onClick={()=>bump(k,1)} style={miniBtn}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:16, marginBottom:6 }}>Equipment</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:8 }}>
            {slots.map(s=>(
              <div key={s} style={{ border:"1px solid #2a2a2a", borderRadius:12, padding:8 }}>
                <div style={{ fontSize:12, opacity:.75 }}>{s}</div>
                <input placeholder={"Item for "+s}
                  defaultValue={eq[s] ?? ""} onBlur={(e)=>setSlot(s, e.currentTarget.value)}
                  style={{ marginTop:6, width:"100%", padding:"8px 10px", borderRadius:8, background:"#0f1115", color:"#e5e7eb", border:"1px solid #2a2a2a" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const miniBtn: React.CSSProperties = {
  width:28, height:28, borderRadius:8, border:"1px solid #374151", background:"#1f2937",
  color:"#e5e7eb", cursor:"pointer", fontWeight:900
};
