import fs from "node:fs/promises";
import path from "node:path";

const DIR = () => path.join(process.cwd(), ".data", "zen");
const F_BAL = () => path.join(DIR(), "balances.json");
const F_OPS = () => path.join(DIR(), "ops.json");
const F_LED = () => path.join(DIR(), "ledger.jsonl");
const F_ADS = () => path.join(DIR(), "ads.json");
const F_STREAK = () => path.join(DIR(), "streak.json");

type Balances = Record<string, number>;
type Ops = Record<string, Record<string, number>>; // device -> opId -> at

async function ensure(){
  await fs.mkdir(DIR(), { recursive: true });
  for (const p of [F_BAL(), F_OPS(), F_LED(), F_ADS(), F_STREAK()]) {
    try{ await fs.access(p); } catch { await fs.writeFile(p, p.endsWith(".jsonl") ? "" : "{}", "utf8"); }
  }
}

function todayISO(){
  const d = new Date(); return d.toISOString().slice(0,10);
}

export async function getDevice(req:Request){
  const h = new Headers(req.headers);
  return (h.get("x-device-id") || "").trim() || "dev-local";
}

async function readJSON<T>(p:string, def:T):Promise<T>{
  try{ const s = await fs.readFile(p,"utf8"); return s ? JSON.parse(s) as T : def; } catch { return def; }
}
async function writeJSON<T>(p:string, obj:T){ await fs.writeFile(p, JSON.stringify(obj,null,2), "utf8"); }

export async function getBalance(device:string){
  await ensure();
  const bal = await readJSON<Balances>(F_BAL(), {});
  return bal[device] || 0;
}

async function setBalance(device:string, value:number){
  const bal = await readJSON<Balances>(F_BAL(), {});
  bal[device] = value;
  await writeJSON(F_BAL(), bal);
}

async function seenOp(device:string, opId:string){
  const ops = await readJSON<Ops>(F_OPS(), {});
  const d = ops[device] || {};
  return !!d[opId];
}
async function markOp(device:string, opId:string){
  const ops = await readJSON<Ops>(F_OPS(), {});
  const d = ops[device] || {};
  d[opId] = Date.now();
  ops[device] = d;
  await writeJSON(F_OPS(), ops);
}

async function appendLedger(device:string, action:"earn"|"spend"|"refund", amount:number, reason:string, opId?:string){
  await ensure();
  if (amount <= 0) return { ok:false, balance: await getBalance(device), duplicate:false };
  if (opId && await seenOp(device, opId)) return { ok:true, balance: await getBalance(device), duplicate:true };

  const before = await getBalance(device);
  const after = action === "earn" || action==="refund" ? before + amount : Math.max(0, before - amount);

  const entry = { id: "tx_"+Math.random().toString(36).slice(2,10), at: Date.now(), device, action, amount, reason, opId: opId || null };
  await fs.appendFile(F_LED(), JSON.stringify(entry)+"\n", "utf8");
  await setBalance(device, after);
  if (opId) await markOp(device, opId);

  return { ok:true, balance: after, duplicate:false };
}

export async function ledgerEarn(device:string, amount:number, reason:string, opId?:string){
  return appendLedger(device, "earn", amount, reason, opId);
}
export async function ledgerSpend(device:string, amount:number, reason:string, opId?:string){
  return appendLedger(device, "spend", amount, reason, opId);
}

export async function getHistory(device:string, limit=50){
  await ensure();
  try{
    const raw = await fs.readFile(F_LED(), "utf8");
    const lines = raw.trim().split(/\n+/).filter(Boolean);
    const entries = lines.map(s=> JSON.parse(s)).filter(e=> e.device===device);
    return entries.slice(-limit);
  } catch { return []; }
}

export async function adRedeem(device:string, adId:string, kind:"view"|"click"){
  await ensure();
  const p = F_ADS();
  const j = await readJSON<Record<string, {counts:Record<string,number>}>>(p, {});
  const rec = j[device] || { counts: { view:0, click:0 } };
  rec.counts[kind] = (rec.counts[kind]||0) + 1;
  j[device] = rec;
  await writeJSON(p, j);
  const opId = `ad:${adId}:${kind}:${todayISO()}`;
  const r = await ledgerEarn(device, 1, `ad_${kind}:${adId}`, opId);
  return { ...r, counts: rec.counts, total: (rec.counts.view||0)+(rec.counts.click||0) };
}

export async function streakClaim(device:string){
  await ensure();
  const p = F_STREAK();
  const j = await readJSON<Record<string,{last:string; streak:number}>>(p, {});
  const rec = j[device] || { last:"", streak:0 };
  const today = todayISO();
  if (rec.last === today) {
    return { ok:true, duplicate:true, streak:rec.streak, amount:0, balance: await getBalance(device) };
  }
  const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
  if (rec.last === yesterday) rec.streak += 1; else rec.streak = 1;
  rec.last = today;
  j[device] = rec;
  await writeJSON(p, j);
  const amount = Math.min(10, 5 + rec.streak); // e.g. 6..10
  const r = await ledgerEarn(device, amount, "streak_bonus", `streak:${today}`);
  return { ok:true, duplicate:false, streak:rec.streak, amount, balance:r.balance };
}
