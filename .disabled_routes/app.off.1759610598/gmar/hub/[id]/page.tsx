"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GAMES_HUB } from "../../../../src/lib/hub/manifest";
import { EngineSwitchHub } from "../../../../src/components/gmar/hub/engine-switch";
import type { HubEvent, HubSettings } from "../../../../src/lib/hub/sdk";
import { addCoins as ecoAddCoins, loadCoins as ecoLoadCoins, loadBest, saveBest } from "../../../../src/lib/hub/economy";

export default function HubPlay(){
  const { id } = useParams<{id:string}>();
  const game = useMemo(()=> GAMES_HUB.find(x=>x.id===id) || GAMES_HUB[0], [id]);

  const [paused, setPaused] = useState(false);
  const [coins, setCoins] = useState(ecoLoadCoins());
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(loadBest(game.id));
  const [settings, setSettings] = useState<HubSettings>({ difficulty:"normal", sfx:true, haptics:true, leftHanded:false });

  const emit = (ev:HubEvent)=>{
    if (ev.type==="coins") {
      const c = ecoAddCoins(ev.delta);
      setCoins(c);
    } else if (ev.type==="score") {
      setScore(ev.value);
      if (ev.value>best){ setBest(ev.value); saveBest(game.id, ev.value); }
    }
  };

  return (
    <div style={{padding:16,color:"#e5e7eb",background:"#020617",minHeight:"100vh"}}>
      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
        <Link href="/gmar/hub" style={{color:"#93c5fd",textDecoration:"underline"}}>← Hub</Link>
        <div style={{opacity:.7,fontSize:12}}>{game.title}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:12}}>
        <div>
          <EngineSwitchHub engine={game.engine as any} paused={paused} settings={settings} emit={emit}/>
        </div>
        <div style={{display:"grid",gap:10}}>
          <div style={{border:"1px solid #1f2937",borderRadius:12,padding:10,background:"#0b1220"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:8,alignItems:"center"}}>
              <div style={{fontWeight:700}}>{game.title}</div>
              <div>Score: <b>{score}</b></div>
              <div>Best: <b>{best}</b></div>
              <div>Coins: <b>{coins}</b></div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <button onClick={()=>setPaused(p=>!p)} style={btnStyle}>{paused?"Resume":"Pause"}</button>
              <button onClick={()=>setScore(0)} style={btnStyle}>Reset Score</button>
            </div>
          </div>

          <div style={{border:"1px solid #1f2937",borderRadius:12,padding:10,background:"#0b1220"}}>
            <div style={{fontWeight:700,marginBottom:6}}>Settings</div>
            <div style={{display:"grid",gap:8}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span>Difficulty:</span>
                <select value={settings.difficulty} onChange={e=>setSettings(s=>({...s, difficulty: e.target.value as HubSettings["difficulty"]}))}
                  style={{padding:"6px 8px",borderRadius:8,border:"1px solid #1f2937",background:"#0f172a",color:"#e5e7eb"}}>
                  <option value="easy">easy</option>
                  <option value="normal">normal</option>
                  <option value="hard">hard</option>
                </select>
              </div>
              <label style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="checkbox" checked={!!settings.sfx} onChange={e=>setSettings(s=>({...s, sfx:e.target.checked}))}/>
                SFX
              </label>
              <label style={{display:"flex",gap:8,alignItems:"center"}}>
                <input type="checkbox" checked={!!settings.haptics} onChange={e=>setSettings(s=>({...s, haptics:e.target.checked}))}/>
                Haptics
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding:"8px 12px", border:"1px solid #1f2937", borderRadius:8, background:"#0f172a", color:"#e5e7eb", cursor:"pointer"
};
