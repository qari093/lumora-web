"use client";

type Snapshot = {
  unitsTimestamps: number[]; // ms
  limiter: Record<string, number>;
};

const state: Snapshot = { unitsTimestamps: [], limiter: {} };
const subs = new Set<() => void>();

function notify(){ subs.forEach(fn => { try{ fn(); }catch{} }); }

export function recordUnits(n: number){
  const now = Date.now();
  for(let i=0;i<Math.max(0, Math.floor(n)); i++){
    state.unitsTimestamps.push(now);
  }
  // keep last 5 min
  const cut = now - 5*60*1000;
  state.unitsTimestamps = state.unitsTimestamps.filter(t => t >= cut);
  notify();
}

export function recordLimiter(type: string){
  state.limiter[type] = (state.limiter[type] || 0) + 1;
  notify();
}

export function getSnapshot(): Snapshot {
  // return shallow copy
  return { unitsTimestamps: [...state.unitsTimestamps], limiter: { ...state.limiter } };
}

export function subscribe(cb: () => void){
  subs.add(cb);
  return () => subs.delete(cb);
}
