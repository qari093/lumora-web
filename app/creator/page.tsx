"use client";
import React from "react";

export default function CreatorPage() {
  async function call(path: string, init?: RequestInit) {
    const res = await fetch(path, init);
    const json = await res.json();
    alert(JSON.stringify(json, null, 2));
  }
  return (
    <div style={{ padding: 24 }}>
      <h1>Creator</h1>
      <p>If you can see this, <code>/creator</code> is working.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => call("/api/creator/publish", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ title: "Laser Maze", templateId: "arena-shooter", ownerId: "demo-user" })
        })}>Publish</button>
        <button onClick={() => call("/api/creator/modqueue")}>View Mod Queue</button>
        <button onClick={() => call("/api/creator/moderate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "APPROVE" })
        })}>Approve Latest</button>
        <button onClick={() => call("/api/creator/games?ownerId=demo-user")}>My Games</button>
      </div>
    </div>
  );
}
