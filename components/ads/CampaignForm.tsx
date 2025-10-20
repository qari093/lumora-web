"use client";
import React from "react";
type Props = { initial?: { id?: string; name?: string; budgetCents?: number }; onSaved?: (d:any)=>void; };
export default function CampaignForm({ initial, onSaved }: Props){
  const [name,setName]=React.useState(initial?.name??"");
  const [budget,setBudget]=React.useState((initial?.budgetCents??0)/100);
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSaved?.({name, budgetCents:Math.round((+budget||0)*100)});}} style={{display:"grid",gap:10,maxWidth:520}}>
      <label style={{display:"grid",gap:6}}><span>Name</span><input value={name} onChange={e=>setName(e.target.value)} /></label>
      <label style={{display:"grid",gap:6}}><span>Budget (EUR)</span>
        <input type="number" step="0.01" value={budget} onChange={e=>setBudget(parseFloat(e.target.value||"0"))} />
      </label>
      <button type="submit" style={{padding:"8px 12px",border:"1px solid #222",borderRadius:6}}>Save</button>
    </form>
  );
}
