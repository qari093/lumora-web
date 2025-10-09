"use client";
import React, { useState } from "react";

type Campaign = {
  id: number;
  type: string;
  result: number; // growth achieved
  target: number; // growth expected
  status: "success" | "fail";
  notes: string;
};

export default function AegisPrime() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [target, setTarget] = useState(100000); // daily target
  const [achieved, setAchieved] = useState(0);
  const [suggestion, setSuggestion] = useState<string>("");

  function runCampaign(type: string) {
    // simulate random result
    const result = Math.floor(Math.random() * (target * 0.8 - target * 0.3) + target * 0.3);
    const status = result >= target ? "success" : "fail";
    const notes = status === "fail" ? "Did not meet growth, adjust strategy" : "Good performance";
    const newCampaign: Campaign = {
      id: Date.now(),
      type,
      result,
      target,
      status,
      notes
    };
    setCampaigns([newCampaign, ...campaigns]);
    setAchieved(result);

    // learning logic: adjust suggestion based on failures
    if (status === "fail") {
      if (type === "Video Push") setSuggestion("Try shorter videos + Double Coin Reward");
      else if (type === "Referral Boost") setSuggestion("Increase referral reward % and add viral video");
      else if (type === "Game Challenge") setSuggestion("Shorter rounds + higher Zencoin prize");
      else setSuggestion("Combine campaigns for stronger effect");
    } else {
      setSuggestion("Repeat this campaign style or scale it up");
    }
  }

  return (
    <div style={{ padding:20, color:"#fff", background:"#111", minHeight:"100vh" }}>
      <h1 style={{ fontSize:28, fontWeight:800, marginBottom:20 }}>🧠 Lumora Aegis Prime — Simulation</h1>

      <div style={{ marginBottom:20 }}>
        🎯 Daily Target: <b>{target.toLocaleString()}</b> users<br/>
        ✅ Achieved: <b>{achieved.toLocaleString()}</b>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        <button onClick={()=>runCampaign("Video Push")} style={btn}>Run Video Push</button>
        <button onClick={()=>runCampaign("Referral Boost")} style={btn}>Run Referral Boost</button>
        <button onClick={()=>runCampaign("Game Challenge")} style={btn}>Run Game Challenge</button>
        <button onClick={()=>runCampaign("Shop Flash Sale")} style={btn}>Run Shop Flash Sale</button>
      </div>

      {suggestion && (
        <div style={{ background:"#222", padding:12, borderRadius:8, marginBottom:20 }}>
          💡 <b>AI Suggestion:</b> {suggestion}
        </div>
      )}

      <h2 style={{ fontSize:20, fontWeight:700, marginBottom:10 }}>📜 Campaign History & Mistakes</h2>
      {campaigns.length === 0 && <div>No campaigns run yet.</div>}
      {campaigns.map(c=>(
        <div key={c.id} style={{
          background:c.status==="success"?"rgba(0,255,0,0.1)":"rgba(255,0,0,0.1)",
          padding:10, borderRadius:8, marginBottom:8
        }}>
          <b>{c.type}</b> → Result: {c.result.toLocaleString()} / {c.target.toLocaleString()} → 
          <span style={{ color:c.status==="success"?"lime":"crimson", fontWeight:700 }}>
            {c.status.toUpperCase()}
          </span>
          <br/>
          <small>{c.notes}</small>
        </div>
      ))}
    </div>
  );
}

const btn: React.CSSProperties = {
  padding:"8px 14px",
  borderRadius:6,
  border:"none",
  background:"gold",
  color:"#000",
  fontWeight:700,
  cursor:"pointer"
};
