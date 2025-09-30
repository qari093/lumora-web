import { create } from "zustand";
export type GameEvent =
  | { type:"SCORE"; by:number }
  | { type:"COIN"; amount:number }
  | { type:"HIT" }
  | { type:"PAUSE"; on:boolean };
type GameState = { score:number; coins:number; paused:boolean; lives:number; dispatch:(e:GameEvent)=>void; reset:()=>void; };
export const useGameStore = create<GameState>((set)=>({
  score:0, coins:0, paused:false, lives:3,
  dispatch:(e)=>set((s)=>{ switch(e.type){
    case "SCORE": return { ...s, score:s.score+e.by };
    case "COIN": return { ...s, coins:s.coins+e.amount };
    case "HIT": return { ...s, lives:Math.max(0,s.lives-1) };
    case "PAUSE": return { ...s, paused:e.on };
    default: return s; } }),
  reset:()=>set({ score:0, coins:0, paused:false, lives:3 })
}));
