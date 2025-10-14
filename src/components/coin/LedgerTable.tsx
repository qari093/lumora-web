"use client";
import { useEffect, useState } from "react";

type Row = { id:string; ts:number; from:string|null; to:string; amount:number; memo?:string|null };

export default function LedgerTable({ userId, limit=10 }: { userId: string; limit?: number }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/coin/ledger?userId=${encodeURIComponent(userId)}&limit=${limit}`, { cache: "no-store" });
      const data = await res.json();
      setRows(data.ledger ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [userId, limit]);

  return (
    <div style={{padding:16,border:"1px solid #333",borderRadius:8}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{fontSize:18,fontWeight:600}}>Recent activity</div>
        <button onClick={load} disabled={loading} style={{padding:"6px 10px"}}>{loading ? "Refreshing…" : "Refresh"}</button>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead>
          <tr>
            <th style={th}>When</th>
            <th style={th}>From</th>
            <th style={th}>To</th>
            <th style={thR}>Amount</th>
            <th style={th}>Memo</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={5} style={{padding:8,opacity:.7}}>No transactions yet</td></tr>
          ) : rows.map(r => (
            <tr key={r.id}>
              <td style={td}>{new Date(r.ts).toLocaleString()}</td>
              <td style={td}>{r.from ?? "system"}</td>
              <td style={td}>{r.to}</td>
              <td style={tdR}>{r.amount}</td>
              <td style={td}>{r.memo ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { textAlign:"left" as const, borderBottom:"1px solid #333", padding:"6px 8px" };
const thR = { ...th, textAlign:"right" as const };
const td = { padding:"6px 8px", borderBottom:"1px solid #222" };
const tdR = { ...td, textAlign:"right" as const };
