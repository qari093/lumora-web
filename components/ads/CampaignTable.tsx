"use client";
import React from "react";
type Row={id:string; name:string; status?:string; budgetCents?:number};
export default function CampaignTable({rows=[] as Row[]}) {
  return (
    <table style={{width:"100%",borderCollapse:"collapse"}}>
      <thead><tr>
        <th style={{textAlign:"left",padding:8}}>ID</th>
        <th style={{textAlign:"left",padding:8}}>Name</th>
        <th style={{textAlign:"left",padding:8}}>Status</th>
        <th style={{textAlign:"right",padding:8}}>Budget</th>
      </tr></thead>
      <tbody>
        {rows.map(r=>(
          <tr key={r.id} style={{borderTop:"1px solid #333"}}>
            <td style={{padding:8,fontFamily:"monospace"}}>{r.id}</td>
            <td style={{padding:8}}>{r.name}</td>
            <td style={{padding:8}}>{r.status??"—"}</td>
            <td style={{padding:8,textAlign:"right"}}>
              {new Intl.NumberFormat(undefined,{style:"currency",currency:"EUR"}).format((r.budgetCents??0)/100)}
            </td>
          </tr>
        ))}
        {rows.length===0 && <tr><td colSpan={4} style={{padding:12,opacity:.75}}>No campaigns yet.</td></tr>}
      </tbody>
    </table>
  );
}
