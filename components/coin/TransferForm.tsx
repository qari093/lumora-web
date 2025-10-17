"use client";
import { useState } from "react";

export default function TransferForm({ defaultFrom }: { defaultFrom: string }) {
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [memo, setMemo] = useState("");
  const [msg, setMsg] = useState<string>("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("Sending…");
    const res = await fetch("/api/coin/transfer", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ from, to, amount: Number(amount), memo }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setMsg(data.error || "error");
    } else {
      setMsg(`Sent ${amount} → ${to}`);
      setTo("");
      setAmount(0);
      setMemo("");
    }
  }

  async function mintDemo() {
    setMsg("Minting…");
    const res = await fetch("/api/coin/transfer", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ from: "system", to: defaultFrom, amount: 50, memo: "mint" }),
    });
    const data = await res.json();
    setMsg(res.ok && data.ok ? "Minted +50" : (data.error || "error"));
  }

  return (
    <form onSubmit={submit} style={{border:"1px solid #e5e7eb", borderRadius:12, padding:16}}>
      <div style={{fontWeight:600, marginBottom:8}}>Transfer</div>
      <div style={{display:"grid", gap:8}}>
        <label>From
          <input value={from} onChange={e=>setFrom(e.target.value)} placeholder="sender"
                 style={{width:"100%", border:"1px solid #e5e7eb", borderRadius:8, padding:8}} />
        </label>
        <label>To
          <input value={to} onChange={e=>setTo(e.target.value)} placeholder="receiver"
                 style={{width:"100%", border:"1px solid #e5e7eb", borderRadius:8, padding:8}} />
        </label>
        <label>Amount
          <input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))}
                 style={{width:"100%", border:"1px solid #e5e7eb", borderRadius:8, padding:8}} />
        </label>
        <label>Memo
          <input value={memo} onChange={e=>setMemo(e.target.value)} placeholder="note"
                 style={{width:"100%", border:"1px solid #e5e7eb", borderRadius:8, padding:8}} />
        </label>
        <div style={{display:"flex", gap:8}}>
          <button type="submit" style={{padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:8}}>Send</button>
          <button type="button" onClick={mintDemo} style={{padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:8}}>Mint +50 (demo)</button>
        </div>
        <div style={{fontSize:12, color:"#6b7280"}}>{msg}</div>
      </div>
    </form>
  );
}
