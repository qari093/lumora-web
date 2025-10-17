"use client";
import React, { useState } from "react";
import { spendCoins, addItem, loadCoins } from "./economy";

/**
 * ShopModal — named export (keeps your page.tsx import working)
 * Also exported as default for flexibility.
 *
 * Props:
 *  - onClose(): close overlay
 *  - coins: number (not strictly required; we re-read latest coins for accuracy)
 *  - onPurchased(): callback to let parent refresh HUD/inventory
 */
export default function ShopModal({ onClose, coins, onPurchased }:{
  onClose: ()=>void;
  coins: number;
  onPurchased: ()=>void;
}){
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState<string|null>(null);

  const buy = async (id: string, title: string, price: number) => {
    if (busy) return;
    setBusy(id);
    try {
      const remain = spendCoins(price);
      if (remain === null) {
        alert(`Not enough coins. Need ${price}, you have ${loadCoins()}.`);
        return;
      }
      // economy.addItem signature: (id, title, qty)
      addItem(id, title, 1);
      onPurchased(); // let parent refresh UI
      alert(`Purchased: ${title} (remaining coins: ${remain})`);
    } catch (e:any) {
      console.error("Shop purchase error:", e);
      alert("Purchase failed. See console for details.");
    } finally {
      setBusy(null);
    }
  };

  const CATALOG = [
    { id: "boost_xs", title: "Boost XS (+5 start)", price: 5 },
    { id: "boost_m",  title: "Boost M (+15 start)", price: 15 },
    { id: "revive",   title: "Revive (1 per run)",  price: 25 },
    { id: "skin_neon",title: "Neon Skin",           price: 20 },
  ] as const;

  const curCoins = loadCoins();

  const Btn = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) =>
    <button {...props} style={{padding:"8px 12px",borderRadius:8,border:"1px solid #1f2937",background:"#0b1220",color:"#e5e7eb",cursor:"pointer"}}/>;

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"grid",placeItems:"center",zIndex:60}}>
      <div style={{width:"min(680px,92vw)",maxHeight:"80vh",overflow:"auto",border:"1px solid #1f2937",background:"#0b1220",color:"#e5e7eb",borderRadius:12,padding:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <b>Zen Shop (offline)</b>
          <Btn onClick={onClose}>Close</Btn>
        </div>
        <div style={{marginBottom:8}}>Coins: <b>{curCoins}</b></div>
        <div style={{display:"grid",gap:8}}>
          {CATALOG.map(it=>(
            <div key={it.id} style={{border:"1px solid #1f2937",borderRadius:10,padding:10,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
              <div>
                <div style={{fontWeight:600}}>{it.title}</div>
                <div style={{opacity:.7,fontSize:12}}>Price: {it.price} coins</div>
              </div>
              <Btn onClick={()=>buy(it.id,it.title,it.price)} disabled={busy!==null || curCoins < it.price}>
                {busy===it.id ? "Buying…" : "Buy"}
              </Btn>
            </div>
          ))}
        </div>
        <div style={{marginTop:10,opacity:.8,fontSize:12}}>
          <div>Email (optional for receipt):</div>
          <input
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{marginTop:6,width:"100%",border:"1px solid #1f2937",borderRadius:8,background:"#0b1220",color:"#e5e7eb",padding:"8px 10px"}}
          />
        </div>
      </div>
    </div>
  );
}

// default export for flexibility (not required by your page)
export default ShopModal;
