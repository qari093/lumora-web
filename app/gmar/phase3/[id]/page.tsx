"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import EngineSwitchPhase3 from "../../../../src/components/gmar/phase3/engine-switch";
import { loadCoins, loadInv } from "../../../../src/components/gmar/phase3/economy";
export default function GamePage(){
  const { id } = useParams<{id:string}>();
  const coins = loadCoins();
  const inv = loadInv();
  return (
    <div style={{padding:16,color:"#e5e7eb",background:"#020617",minHeight:"100vh"}}>
      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
        <Link href="/gmar/phase3" style={{color:"#93c5fd",textDecoration:"underline"}}>← Back</Link>
        <div style={{opacity:.6,fontSize:12}}>AA+ Engines · Zen Economy</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:14}}>
        <div style={{minHeight:420}}>
          <EngineSwitchPhase3 id={id!} paused={false} settings={{difficulty:"normal"}} onScore={()=>{}} />
        </div>
        <div style={{display:"grid",gap:10}}>
          <div style={{border:"1px solid #1f2937",borderRadius:10,padding:"10px 12px",background:"#0b1220"}}>
            <div style={{fontWeight:700,marginBottom:6}}>HUD</div>
            <div>Coins: <b>{coins}</b></div>
            <div>Items: <b>{inv.items?.length||0}</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}
