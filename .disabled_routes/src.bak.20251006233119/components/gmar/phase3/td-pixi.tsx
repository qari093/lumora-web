"use client";
import React, { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { io } from "socket.io-client";

export default function TdPixiEngine({ paused=false }: { paused?: boolean }) {
  const mountRef = useRef<HTMLDivElement|null>(null);
  const appRef = useRef<PIXI.Application|null>(null);
  const [coins, setCoins] = useState(0);
  const [kills, setKills] = useState(0);

  // 🧩 Live gifts → coins
  useEffect(() => {
    const socket = io("http://localhost:4000", { transports: ["websocket"] });
    const giftToCoins: Record<string, number> = {
      Sparkle: 10,
      Firestorm: 50,
      Diamond: 100,
      Phoenix: 500,
      Galaxy: 1000,
      Dragon: 2000,
    };
    socket.on("giftReceived", ({ giftType, value }: { giftType: string; value: number }) => {
      const base = giftToCoins[giftType] ?? Math.max(1, Math.round(value / 10));
      setCoins(c => c + base);
    });
    return () => { socket.close(); };
  }, []);

  useEffect(() => {
    let destroyed = false;
    const app = new PIXI.Application({ resizeTo: window, background: "#0b1220", antialias: true });
    appRef.current = app;
    if (!mountRef.current) return;
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(app.view as HTMLCanvasElement);

    // Simple enemy
    const enemy = new PIXI.Graphics().circle(0,0,20).fill({ color:0xff4444 });
    enemy.x = 100; enemy.y = 200;
    app.stage.addChild(enemy);

    app.ticker.add(() => {
      if (paused || destroyed) return;
      enemy.x += 1.5;
      if (enemy.x > app.renderer.width + 20) enemy.x = -20;
    });

    return () => {
      destroyed = true;
      app.destroy(true, { children:true });
    };
  }, [paused]);

  // Layout: canvas + HUD
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:16, width:"100%" }}>
      <div ref={mountRef} style={{ width:"100%", height:"100%", minHeight:480, borderRadius:12, overflow:"hidden" }} />
      <div style={{ padding:16, color:"#cbd5e1", background:"#0b1220", borderRadius:12, border:"1px solid #1e293b", fontFamily:"Inter, system-ui, sans-serif" }}>
        <h3 style={{ margin:"0 0 12px 0", color:"#e2e8f0" }}>HUD</h3>
        <div style={{ lineHeight:"1.9" }}>
          <div>🎯 Kills: <b>{kills}</b></div>
          <div>🪙 Coins: <b>{coins}</b></div>
          <div>⏱️ Status: <b>{paused ? "Paused" : "Running"}</b></div>
          <hr style={{ borderColor:"#1e293b", margin:"12px 0" }} />
          <div style={{ fontSize:13, color:"#94a3b8" }}>
            Controls: <kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> to move, <kbd>Space</kbd> to shoot
          </div>
        </div>
      </div>
    </div>
  );
}
