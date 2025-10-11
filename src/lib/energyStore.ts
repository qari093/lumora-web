import { getOrSetUid } from "@/lib/uid";

type Wallet = {
  energy: number;         // personal
  streakDays: number;     // continuous days active
  lastActiveISO: string;  // last active ISO date
};
type Pool = { energy: number; updatedAt: number };

const wallets = new Map<string, Wallet>();
const pool: Pool = { energy: 0, updatedAt: Date.now() };

function todayKey(d=new Date()){ return d.toISOString().slice(0,10); }

export function getWallet(uid?:string){
  const id = uid || getOrSetUid();
  let w = wallets.get(id);
  if(!w){
    w = { energy: 0, streakDays: 0, lastActiveISO: "" };
    wallets.set(id, w);
  }
  return { id, w };
}

function touchStreak(w: Wallet){
  const today = todayKey();
  const last = w.lastActiveISO ? w.lastActiveISO.slice(0,10) : "";
  // soft decay if inactive > 36h
  if(w.lastActiveISO){
    const lastTime = new Date(w.lastActiveISO).getTime();
    if(Date.now() - lastTime > 36*60*60*1000){
      w.streakDays = Math.max(0, Math.floor(w.streakDays * 0.75));
    }
  }
  if(last !== today){
    w.streakDays += 1;
    w.lastActiveISO = new Date().toISOString();
  }else{
    w.lastActiveISO = new Date().toISOString();
  }
}

export type EarnType = "WATCH"|"LIKE"|"COMMENT"|"SHARE";

/** Base earn schedule (can be boosted later by events) */
function earnSchedule(t: EarnType){
  switch(t){
    case "WATCH":   return { personal: 1, pool: 1 };
    case "LIKE":    return { personal: 2, pool: 1 };
    case "COMMENT": return { personal: 1, pool: 1 };
    case "SHARE":   return { personal: 4, pool: 3 };
  }
}

/** Award energy to user + global pool. Returns deltas so caller can credit crew. */
export function award(type: EarnType, uid?: string){
  const { id, w } = getWallet(uid);
  const g = earnSchedule(type);
  const addedPersonal = g.personal;
  const addedPool = g.pool;

  w.energy += addedPersonal;
  pool.energy += addedPool;
  pool.updatedAt = Date.now();
  touchStreak(w);

  return { id, wallet: w, pool, addedPersonal, addedPool };
}

export function snapshotMe(uid?:string){
  const { id, w } = getWallet(uid);
  return { id, wallet: w };
}
export function snapshotPool(){
  return { energy: pool.energy, updatedAt: pool.updatedAt };
}
