"use client";
import { useState } from "react";

export default function TransferForm({ defaultFrom }: { defaultFrom?: string }) {
  const [from, setFrom] = useState<string>(defaultFrom ?? "");
  const [to, setTo] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [memo, setMemo] = useState<string>("");
  const [msg, setMsg] = useState<string>("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const body: any = { to, amount: Number(amount), memo: memo || undefined };
    if (from) body.from = from;
    try {
      const res = await fetch("/api/coin/transfer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMsg(`Error: ${data.error || res.statusText}`);
      } else {
        setMsg(`OK: tx ${data.tx.id} (${amount} → ${to})`);
      }
    } catch (err: any) {
      setMsg(`Error: ${err?.message || "network"}`);
    }
  }

  return (
    <form onSubmit={submit} style={{padding:16,border:"1px solid #333",borderRadius:8,display:"grid",gap:8}}>
      <div style={{fontSize:18,fontWeight:600}}>Transfer</div>
      <label>From (leave blank for system mint)</label>
      <input value={from} onChange={(e)=>setFrom(e.target.value)} placeholder="system or userId" />

      <label>To</label>
      <input value={to} onChange={(e)=>setTo(e.target.value)} placeholder="recipient userId" required />

      <label>Amount</label>
      <input type="number" min={1} value={amount} onChange={(e)=>setAmount(Number(e.target.value))} required />

      <label>Memo (optional)</label>
      <input value={memo} onChange={(e)=>setMemo(e.target.value)} placeholder="note…" />

      <button type="submit" style={{marginTop:8,padding:"8px 12px"}}>Send</button>
      {msg && <div style={{marginTop:6,fontSize:12}}>{msg}</div>}
    </form>
  );
}
