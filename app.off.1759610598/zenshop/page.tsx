"use client";
import React from "react";

type Prod = { id:string; title:string; priceZen:number; type:string; hero?:string; qty?:number };
async function getJSON(url:string, opt?:RequestInit){ const r=await fetch(url,opt); return r.json(); }

export default function ZenShopPage(){
  const [items,setItems]=React.useState<Prod[]>([]);
  const [inv,setInv]=React.useState<any>(null);
  const [bal,setBal]=React.useState<number>(0);
  const dev="dev1"; // for demo; you can wire real device id

  async function loadAll(){
    const a=await getJSON("/api/zenshop/products");
    const b=await getJSON("/api/zenshop/inventory",{ headers:{ "x-device-id":dev } as any });
    const c=await getJSON("/api/zen/ledger",{ headers:{ "x-device-id":dev } as any });
    setItems(a.items||[]);
    setInv(b.inventory||null);
    setBal(c.balance||0);
  }
  React.useEffect(()=>{ loadAll(); },[]);

  async function buy(id:string){
    const r=await getJSON("/api/zenshop/checkout",{method:"POST", headers:{ "Content-Type":"application/json", "x-device-id":dev } as any, body: JSON.stringify({ productId: id, payment:"zen" })});
    if(r?.ok){ alert("Purchased "+id+"!"); loadAll(); } else { alert("Failed: "+(r?.error||"unknown")); }
  }

  return (
    <main style={{padding:20, color:"#e5e7eb", background:"#0a0a0a", minHeight:"100vh", fontFamily:"ui-sans-serif,system-ui"}}>
      <h1 style={{fontWeight:900, fontSize:24, marginBottom:12}}>ZenShop</h1>
      <div style={{marginBottom:12}}>Device: <b>{dev}</b> • Balance: <b>{bal} ZEN</b></div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:12}}>
        {items.map(p=>(
          <div key={p.id} style={{background:"#111214", border:"1px solid #26272b", borderRadius:12, padding:12}}>
            <div style={{fontWeight:700}}>{p.title}</div>
            <div style={{opacity:.75, fontSize:12, marginTop:4}}>Price: {p.priceZen} ZEN{p.type==="boost" && p.qty ? \` • x\${p.qty}\` : ""}</div>
            <div style={{marginTop:8}}>
              <button onClick={()=>buy(p.id)} style={{background:"#22c55e", color:"#fff", padding:"6px 10px", borderRadius:8}}>Buy</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{marginTop:16}}>
        <div style={{fontWeight:800, marginBottom:6}}>Your Inventory</div>
        {!inv ? <div style={{opacity:.7}}>Loading…</div> : (
          <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
            <div style={{background:"#18181b", border:"1px solid #27272a", borderRadius:8, padding:"8px 10px"}}>Boosts: {inv.boosts||0}</div>
            {(inv.items||[]).map((id:string)=>(
              <div key={id} style={{background:"#18181b", border:"1px solid #27272a", borderRadius:8, padding:"8px 10px"}}>{id}</div>
            ))}
            {(inv.items||[]).length===0 && <div style={{opacity:.7}}>No items owned yet.</div>}
          </div>
        )}
      </div>
    </main>
  );
}
