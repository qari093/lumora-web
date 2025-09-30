import React from "react";

const links:[string,string][] = [
  ["shooter","Shooter Arena Engine"],
  ["racing","Racing Overdrive Engine"],
  ["battle-royale","Battle Royale Nexus Engine"],
  ["fantasy-crown","Fantasy Crown Wars Engine"],
  ["cyberpunk","Cyberpunk Infiltrator Engine"],
  ["galactic","Galactic Conquest Engine"],
  ["stealth-x","Stealth Operative X Engine"],
  ["sports","Sports Legends Engine"],
  ["dojo","Martial Arts Dojo Engine"],
  ["puzzle","Puzzle Labyrinth Engine"],
  ["horror","Horror Survival Realm Engine"],
  ["magic-realms","Magic Realms Online Engine"],
  ["historical","Historical Warfront Engine"],
  ["zenith-crown","Zenith Crown Engine"],
  ["rhythm","Music Rhythm Saga Engine"],
];

export default function Page(){
  return (
    <div style={{ padding:24, fontFamily:"ui-sans-serif, system-ui, -apple-system" }}>
      <h1 style={{ marginBottom:16 }}>Lumora — Engines</h1>
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill, minmax(260px,1fr))",
        gap:12
      }}>
        {links.map(([slug,label])=>(
          <a key={slug} href={`/engine/${slug}`} style={{
            textDecoration:"none",
            background:"linear-gradient(180deg,#111827,#0b1020)",
            border:"1px solid rgba(255,255,255,.12)",
            borderRadius:12,
            padding:14,
            display:"grid",
            gap:6,
            boxShadow:"0 6px 16px rgba(0,0,0,.18)"
          }}>
            <div style={{
              fontWeight:800, color:"#fff"
            }}>{label}</div>
            <div style={{
              fontSize:12, color:"rgba(255,255,255,.7)"
            }}>Status: <span style={{
              background:"linear-gradient(90deg,#ffd700,#ffb100)",
              color:"#2b2100",
              padding:"2px 8px",
              borderRadius:999,
              fontWeight:900
            }}>Scaffolded</span></div>
          </a>
        ))}
      </div>
    </div>
  );
}
