"use client";
import React from "react";
import { useGameStore } from "@/lib/gmar/store";
export default function HUD(){
  const { score, coins, lives, paused, dispatch, reset } = useGameStore();
  return (
    <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}}>
      <button onClick={()=>dispatch({type:"PAUSE",on:!paused})}>{paused?"Resume (P)":"Pause (P)"}</button>
      <button onClick={()=>reset()}>Reset (R)</button>
      <span>Score: <b>{score}</b></span>
      <span>Coins: <b>{coins}</b></span>
      <span>Lives: <b>{lives}</b></span>
    </div>
  );
}
