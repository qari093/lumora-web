"use client";
import React, { useEffect, useState } from "react";

type Order = {
  id:string; at:number; gameId:string; device:string;
  product:string; qty:number; price:number; currency:string;
  customer?:{ name:string; email:string; address:string };
};

export default function OrdersPage(){
  const [items,setItems]=useState<Order[]>([]);
  const [busy,setBusy]=useState(false);

  async function load(){
    try{
      setBusy(true);
      const r = await fetch("/api/gmar/orders",{cache:"no-store"}); 
      const j = await r.json();
      setItems(j.items||[]);
    }finally{ setBusy(false); }
  }
  useEffect(()=>{ load(); },[]);

  return (
    <main style={{padding:16,color:"#e5e7eb",background:"#0a0a0a",minHeight:"100vh",fontFamily:"ui-sans-serif,system-ui"}}>
      <h1 style={{fontWeight:900,fontSize:20,marginBottom:8}}>Orders</h1>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <button onClick={load} disabled={busy} style={{background:"#3f3f46",color:"#fff",padding:"6px 10px",borderRadius:8}}>{busy?"Refreshing…":"Refresh"}</button>
        <a href="/api/gmar/export/orders" style={{background:"#4f46e5",color:"#fff",padding:"6px 10px",borderRadius:8,textDecoration:"none"}}>Export CSV</a>
      </div>
      <div style={{background:"#111214",border:"1px solid #26272b",borderRadius:12}}>
        <div style={{display:"grid",gridTemplateColumns:"180px 1fr 100px 80px 120px 220px",padding:"10px 12px",borderBottom:"1px solid #26272b",opacity:.8}}>
          <div>Time</div><div>Product</div><div>Qty</div><div>Price</div><div>Game</div><div>Customer</div>
        </div>
        {items.map(o=>(
          <div key={o.id} style={{display:"grid",gridTemplateColumns:"180px 1fr 100px 80px 120px 220px",padding:"10px 12px",borderBottom:"1px solid #26272b"}}>
            <div>{new Date(o.at).toLocaleString()}</div>
            <div>{o.product}</div>
            <div>{o.qty}</div>
            <div>{o.currency}{o.price}</div>
            <div>{o.gameId}</div>
            <div style={{opacity:.85}}>{o.customer?.name||"-"}<br/>{o.customer?.email||""}</div>
          </div>
        ))}
        {items.length===0 && <div style={{padding:12,opacity:.7}}>No orders yet.</div>}
      </div>
    </main>
  );
}
