"use client";
import { useEffect, useState } from "react";

type Row = { id:string; ts:number; from:string|null; to:string; amount:number; memo:string|null };

export default function LedgerTable({ userId, limit=10 }: { userId:string; limit?:number }) {
  const [rows, setRows] = useState<Row[] | null>(null);

  async function refresh() {
    const res = await fetch(`/api/coin/ledger?userId=${encodeURIComponent(userId)}&limit=${limit}`);
    const data = await res.json();
    setRows(data.ledger ?? []);
  }

  useEffect(() => { refresh(); }, [userId, limit]);

  return (
    <div style={{border:"1px solid #e5e7eb", borderRadius:12, padding:16}}>
      <div style={{fontWeight:600, marginBottom:8}}>Recent activity</div>
      <table style={{width:"100%", borderCollapse:"collapse"}}>
        <thead>
          <tr>
            <th style={{textAlign:"left", padding:"6px 4px"}}>Time</th>
            <th style={{textAlign:"left", padding:"6px 4px"}}>From</th>
            <th style={{textAlign:"left", padding:"6px 4px"}}>To</th>
            <th style={{textAlign:"right", padding:"6px 4px"}}>Amount</th>
            <th style={{textAlign:"left", padding:"6px 4px"}}>Memo</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map(r => (
            <tr key={r.id} style={{borderTop:"1px solid #e5e7eb"}}>
              <td style={{padding:"6px 4px"}}>{new Date(r.ts).toLocaleString()}</td>
              <td style={{padding:"6px 4px"}}>{r.from ?? "system"}</td>
              <td style={{padding:"6px 4px"}}>{r.to}</td>
              <td style={{padding:"6px 4px", textAlign:"right"}}>{r.amount}</td>
              <td style={{padding:"6px 4px"}}>{r.memo ?? ""}</td>
            </tr>
          ))}
          {rows && rows.length === 0 && (
            <tr><td colSpan={5} style={{padding:"8px", color:"#6b7280"}}>No activity yet.</td></tr>
          )}
        </tbody>
      </table>
      <button onClick={refresh} style={{marginTop:8, padding:"6px 10px", border:"1px solid #e5e7eb", borderRadius:8}}>
        Refresh
      </button>
    </div>
  );
}
