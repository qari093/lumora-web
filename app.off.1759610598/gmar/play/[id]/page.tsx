"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import RunnerEngine from "../../../../components/gmar/RunnerEngine";
import FlappyEngine from "../../../../components/gmar/FlappyEngine";
import ShooterEngine from "../../../../components/gmar/ShooterEngine";
import HUD from "../../../../components/gmar/HUD";
import TouchControls from "../../../../components/gmar/TouchControls";
import { GAMES } from "../../../../lib/gmar/games";
import { loadBest, saveBest, addCoins as offlineAdd, loadAch, earnAch, resetAll, loadSettings, saveSettings, exportAll, importAll, spendCoins as offlineSpend, addItem, loadInv } from "../../../../lib/gmar/offline";
import { getBalance as zenGet, earn as zenEarn, spend as zenSpend } from "../../../../lib/zen/client";

export default function PlayPage(){
  const { id } = useParams<{id:string}>();
  const game = GAMES.find(g=>g.id===id) || GAMES[0];

  const [score,setScore]=useState(0);
  const [best,setBest]=useState(0);
  const [coins,setCoins]=useState(0);
  const [paused,setPaused]=useState(false);
  const [ach,setAch]=useState<{id:string; title:string; desc:string; earnedAt?:number}[]>([]);
  const [orderOpen,setOrderOpen]=useState(false);
  const [email,setEmail]=useState("");
  const [receipt,setReceipt]=useState<any|null>(null);
  const [shopOpen,setShopOpen]=useState(false);
  const [settings,setSettings]=useState(loadSettings());
  const [inv,setInv]=useState(loadInv());

  // On mount: migrate offline coins (once), then fetch Zen balance
  useEffect(()=>{
    (async()=>{
      setBest(loadBest(game.id));
      setAch(loadAch());
      setInv(loadInv());
      setSettings(loadSettings());

      try {
        const migrated = localStorage.getItem("zen_migrated_v1") === "1";
        const inv = loadInv();
        if (!migrated && inv.coins && inv.coins > 0) {
          const val = Number(inv.coins || 0);
          const r = await zenEarn(val, "offline_migrate");
          if (r.ok) {
            // reset offline coins to 0 (we migrated)
            localStorage.setItem("zen_migrated_v1","1");
            const copy = { ...inv, coins: 0 };
            localStorage.setItem("gmar_inv", JSON.stringify(copy));
          }
        }
      } catch {}

      const b = await zenGet();
      setCoins(b);
    })();
  },[game.id]);

  // Update achievements by score thresholds
  useEffect(()=>{
    if(score>=200){ if(earnAch({id:`${game.id}_200`,title:"Score 200!",desc:"Reached 200 points"})) setAch(loadAch()); }
    if(score>=500){ if(earnAch({id:`${game.id}_500`,title:"Score 500!",desc:"Reached 500 points"})) setAch(loadAch()); }
    if(score>=1000){ if(earnAch({id:`${game.id}_1000`,title:"Score 1000!",desc:"Reached 1000 points"})) setAch(loadAch()); }
  },[score,game.id]);

  function onScore(s:number){
    setScore(s);
    if(s>best){ setBest(s); saveBest(game.id,s); }
  }

  // When engine reports a coin pickup
  async function onCoin(n:number){
    // optimistic UI update
    setCoins(c => c + n);
    const r = await zenEarn(n, "coin_pickup");
    if(!r.ok){
      // fallback to offline if API fails
      const total = offlineAdd(n);
      setCoins(total);
    } else if (typeof r.balance === "number"){
      setCoins(r.balance);
    }
    if((coins+n)>=50){ if(earnAch({id:"rich_50",title:"Coin Collector",desc:"Collected 50+ coins"})) setAch(loadAch()); }
  }

  function goFull(){ const el=document.getElementById("gamebox"); if(el && (el as any).requestFullscreen) (el as any).requestFullscreen(); }
  function doReset(){ if(confirm("Reset local progress (best, inv, ach)?")){ resetAll(); setBest(0); setCoins(0); setAch([]); setInv(loadInv()); setSettings(loadSettings()); } }
  async function saveScoreCloud(){ try{ await fetch("/api/gmar/score",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({gameId:game.id,player:"guest",score:best})}); alert("Score saved to leaderboard"); }catch{} }

  function action(a:"jump"|"shoot"){ window.dispatchEvent(new CustomEvent("gmar:action",{ detail:a })); }
  function exportProgress(){ const blob=new Blob([JSON.stringify(exportAll(),null,2)],{type:"application/json"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="gmar-progress.json"; a.click(); }
  function importProgress(ev:any){ const f=ev.target.files?.[0]; if(!f) return; const rd=new FileReader(); rd.onload=()=>{ try{ const j=JSON.parse(String(rd.result)); if(importAll(j)){ alert("Imported! Reloading"); location.reload(); } }catch{ alert("Invalid file"); } }; rd.readAsText(f); }
  function toggleMute(){ const s={...settings, mute:!settings.mute}; setSettings(s); saveSettings(s); alert("SFX "+(s.mute?"muted":"enabled")); }

  // Shop purchase
  async function buyItem(id:string, price:number){
    if(inv.items.includes(id)){ alert("Owned"); return; }
    // optimistic subtract
    setCoins(c=> c - price);
    const r = await zenSpend(price, "buy:"+id);
    if(r.ok){
      addItem(id);
      const nv=loadInv(); setInv(nv);
      if(typeof r.balance==="number") setCoins(r.balance);
      alert("Purchased!");
    } else {
      // rollback and offline fallback
      setCoins(c=> c + price);
      if(offlineSpend(price)){
        addItem(id); const nv=loadInv(); setInv(nv); setCoins(nv.coins); alert("Purchased (offline fallback).");
      } else {
        alert("Not enough coins.");
      }
    }
  }

  // Order flow (unchanged; product is static)
  async function placeOrder(){
    const product = { title:"Creatine Pro Stack", price:29, currency:"€" };
    try{
      const r = await fetch("/api/gmar/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,product,total:product.price})});
      const j = await r.json();
      if(j?.ok){ setReceipt(j.receipt || { id:"local", email, product, total:product.price }); setOrderOpen(false); }
      else { setReceipt({ id:"local", email, product, total:product.price }); setOrderOpen(false); }
    }catch{ setReceipt({ id:"local", email, product, total:product.price }); setOrderOpen(false); }
  }

  return (
    <main style={{padding:"16px", color:"#e5e7eb", background:"#0a0a0a", minHeight:"100vh"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
        <Link href="/gmar" style={{color:"#8b5cf6"}}>← GMAR</Link>
        <div style={{opacity:.8}}>Game: {game.title}</div>
        <div style={{marginLeft:"auto", display:"flex", gap:8}}>
          <button onClick={()=>setPaused(p=>!p)} style={{background:"#3f3f46", color:"#fff", padding:"6px 10px", borderRadius:6}}>{paused?"Resume":"Pause"}</button>
          <button onClick={goFull} style={{background:"#3f3f46", color:"#fff", padding:"6px 10px", borderRadius:6}}>Fullscreen</button>
          <button onClick={toggleMute} style={{background:"#3f3f46", color:"#fff", padding:"6px 10px", borderRadius:6}}>{settings.mute?"Unmute":"Mute SFX"}</button>
          <button onClick={()=>setShopOpen(true)} style={{background:"#22c55e", color:"#fff", padding:"6px 10px", borderRadius:6}}>Shop</button>
          <button onClick={doReset} style={{background:"#ef4444", color:"#fff", padding:"6px 10px", borderRadius:6}}>Reset</button>
        </div>
      </div>

      <div id="gamebox" style={{maxWidth:980, margin:"0 auto", background:"#111214", border:"1px solid #26272b", borderRadius:12, padding:12, position:"relative"}}>
        <HUD score={score} best={best} coins={coins} onFull={goFull}/>
        {game.engine==="runner" && <RunnerEngine onScore={onScore} onEvent={()=>{}} paused={paused} onCoin={onCoin}/>}
        {game.engine==="flappy" && <FlappyEngine onScore={onScore} onEvent={()=>{}} paused={paused} onCoin={onCoin}/>}
        {game.engine==="shooter" && <ShooterEngine onScore={onScore} onEvent={()=>{}} paused={paused} onCoin={onCoin}/>}

        <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
          <div style={{opacity:.7, fontSize:12}}>Controls: <b>Space</b> to jump/flap; <b>Mouse + Space</b> to shoot; Touch buttons on mobile.</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={saveScoreCloud} style={{background:"#4f46e5", color:"#fff", padding:"6px 10px", borderRadius:6}}>Save Score</button>
            <button onClick={()=>setOrderOpen(true)} style={{background:"#22c55e", color:"#fff", padding:"6px 10px", borderRadius:6}}>Buy</button>
          </div>
        </div>

        <TouchControls onJump={()=>action("jump")} onShoot={()=>action("shoot")}/>
      </div>

      {/* Achievements */}
      <div style={{marginTop:14}}>
        <div style={{opacity:.8, fontSize:13, marginBottom:8}}>Achievements</div>
        <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
          {ach.length===0 && <div style={{opacity:.6}}>No achievements yet.</div>}
          {ach.map(a=>(
            <div key={a.id} style={{background:"#18181b", border:"1px solid #27272a", padding:"8px 10px", borderRadius:8}}>
              <div style={{fontWeight:700}}>{a.title}</div>
              <div style={{opacity:.8, fontSize:12}}>{a.desc}</div>
              {a.earnedAt && <div style={{opacity:.6, fontSize:11, marginTop:4}}>{new Date(a.earnedAt).toLocaleString()}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Export/Import */}
      <div style={{marginTop:12, display:"flex", gap:8}}>
        <button onClick={()=>exportProgress()} style={{background:"#3f3f46", color:"#fff", padding:"6px 10px", borderRadius:8}}>Export Progress</button>
        <label style={{background:"#3f3f46", color:"#fff", padding:"6px 10px", borderRadius:8, cursor:"pointer"}}>
          Import Progress <input type="file" accept="application/json" onChange={(e)=>importProgress(e)} style={{display:"none"}} />
        </label>
      </div>

      {/* Simple Shop Modal (uses zenSpend) */}
      {shopOpen && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"grid", placeItems:"center"}}>
          <div style={{background:"#0b0b0f", border:"1px solid #26272b", borderRadius:12, padding:16, width:360}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <div style={{fontWeight:800}}>Zen Shop</div>
              <button onClick={()=>setShopOpen(false)} style={{background:"#3f3f46", color:"#fff", padding:"6px 10px", borderRadius:8}}>Close</button>
            </div>
            <div style={{opacity:.8, fontSize:12, marginTop:6}}>Coins: {coins}</div>
            <div style={{marginTop:10, display:"grid", gap:8}}>
              {[{id:"boost_small",title:"Small Boost",desc:"+5% speed",price:10},
                {id:"boost_big",title:"Big Boost",desc:"+15% speed",price:25},
                {id:"skin_blue",title:"Blue Skin",desc:"Cosmetic",price:12}
              ].map(it=>(
                <div key={it.id} style={{background:"#111214", border:"1px solid #27272a", borderRadius:8, padding:"10px"}}>
                  <div style={{display:"flex",justifyContent:"space-between"}}>
                    <div>
                      <div style={{fontWeight:700}}>{it.title}</div>
                      <div style={{opacity:.8,fontSize:12}}>{it.desc}</div>
                    </div>
                    <div style={{fontWeight:700}}>{it.price}c</div>
                  </div>
                  <div style={{marginTop:8}}>
                    <button onClick={()=>buyItem(it.id,it.price)} style={{background:"#22c55e", color:"#fff", padding:"6px 10px", borderRadius:8}}>
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Order overlay */}
      {orderOpen && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"grid", placeItems:"center"}}>
          <div style={{background:"#0b0b0f", border:"1px solid #26272b", borderRadius:12, padding:16, width:320}}>
            <div style={{fontWeight:800, marginBottom:8}}>Checkout</div>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{width:"100%", padding:"8px 10px", background:"#111214", color:"#fff", border:"1px solid #26272b", borderRadius:8}}/>
            <div style={{display:"flex", gap:8, marginTop:12, justifyContent:"flex-end"}}>
              <button onClick={()=>setOrderOpen(false)} style={{background:"#3f3f46", color:"#fff", padding:"6px 10px", borderRadius:8}}>Cancel</button>
              <button onClick={placeOrder} disabled={!email} style={{background:"#22c55e", color:"#fff", padding:"6px 10px", borderRadius:8}}>Place Order</button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt overlay */}
      {receipt && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", display:"grid", placeItems:"center"}}>
          <div style={{background:"#0b0b0f", border:"1px solid #26272b", borderRadius:12, padding:16, width:340}}>
            <div style={{fontWeight:800, marginBottom:8}}>Order placed</div>
            <div style={{opacity:.8,fontSize:13}}>We sent a receipt to: <b>{receipt.email}</b></div>
            <div style={{marginTop:8}}>
              <div style={{fontWeight:700}}>{receipt.product.title}</div>
              <div style={{marginTop:6}}>Total: <b>{receipt.product.currency}{receipt.total}</b></div>
              <div style={{opacity:.8, fontSize:12, marginTop:6}}>Order ID: {receipt.id}</div>
            </div>
            <div style={{display:"flex", justifyContent:"flex-end", marginTop:12}}>
              <button onClick={()=>setReceipt(null)} style={{background:"#22c55e", color:"#fff", padding:"8px 12px", borderRadius:8}}>Okay</button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
