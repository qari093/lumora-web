import fs from "fs";
import path from "path";

export type Tx = { id:string; at:number; device:string; action:"earn"|"spend"; amount:number; reason:string; opId?:string };
export type Ledger = { device:string; balance:number; history:Tx[] };
type RewardMeta = { lastByPlacement: Record<string, number>; dailyEarnCount: Record<string, number>; };
type StoreShape = { ledgers: Record<string, Ledger>; rewards: Record<string, RewardMeta>; };

const DATA_FILE = path.join(process.cwd(), ".data", "zen-store.json");
function load(): StoreShape { try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); } catch { return { ledgers:{}, rewards:{} }; } }
function save(db: StoreShape) { fs.mkdirSync(path.dirname(DATA_FILE), { recursive:true }); fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2)); }

const db: StoreShape = load();
function dayKey(ts:number){ const d=new Date(ts); return d.toISOString().slice(0,10); }

export function getLedger(device:string): Ledger {
  if(!db.ledgers[device]) db.ledgers[device] = { device, balance:0, history:[] };
  return db.ledgers[device];
}

export function addTx(device:string, tx: Omit<Tx,"id"|"device"|"at"> & {at?:number}): Ledger {
  const l = getLedger(device);
  const at = tx.at ?? Date.now();
  const id = "tx_"+Math.random().toString(36).slice(2,10);
  const full: Tx = { id, at, device, action:tx.action, amount:tx.amount, reason:tx.reason, opId:tx.opId };
  l.history.unshift(full);
  l.balance += (tx.action === "earn" ? tx.amount : -tx.amount);
  save(db);
  return l;
}

function getRewardMeta(device:string): RewardMeta {
  if(!db.rewards[device]) db.rewards[device] = { lastByPlacement:{}, dailyEarnCount:{} };
  return db.rewards[device];
}

export type Eligibility = { ok:boolean; reason?: "cooldown"|"daily_cap"; nextEligibleAt?: number; remainingToday?: number; };

export function checkEligibility(device:string, placement:string, now:number, cooldownSec:number, dailyCap:number): Eligibility {
  const meta = getRewardMeta(device);
  const last = meta.lastByPlacement[placement] ?? 0;
  const nextAt = last + cooldownSec*1000;
  if(now < nextAt){ return { ok:false, reason:"cooldown", nextEligibleAt: nextAt }; }
  const key = dayKey(now);
  const used = meta.dailyEarnCount[key] ?? 0;
  if(used >= dailyCap){
    return { ok:false, reason:"daily_cap", remainingToday:0, nextEligibleAt: new Date(key+"T23:59:59.999Z").getTime() };
  }
  return { ok:true, remainingToday: Math.max(0, dailyCap - used) };
}

export function stampReward(device:string, placement:string, now:number){
  const meta = getRewardMeta(device);
  meta.lastByPlacement[placement] = now;
  const key = dayKey(now);
  meta.dailyEarnCount[key] = (meta.dailyEarnCount[key] ?? 0) + 1;
  save(db);
}
