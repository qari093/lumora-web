import fs from "fs";
import path from "path";

const ledgerFile = path.join(process.cwd(), ".data", "zen", "ledger.jsonl");
const stateFile  = path.join(process.cwd(), ".data", "zen", "state.json");

// ---------- Ledger ----------
export function appendTx(tx:any){
  try{
    fs.mkdirSync(path.dirname(ledgerFile), { recursive: true });
    fs.appendFileSync(ledgerFile, JSON.stringify(tx)+"\\n");
  }catch(e){ console.error("appendTx", e); }
}

export function readAll(){
  try{
    if(!fs.existsSync(ledgerFile)) return [];
    return fs.readFileSync(ledgerFile, "utf8")
      .split("\\n")
      .filter(Boolean)
      .map((x)=> JSON.parse(x));
  }catch(e){ console.error("readAll", e); return []; }
}

export function readLedger(device:string){
  return readAll().filter((x:any)=> x.device === device);
}

export function balance(device:string){
  const items = readLedger(device);
  let b = 0;
  for(const tx of items){
    if(tx.action === "earn" || tx.action === "refund") b += Number(tx.amount||0);
    if(tx.action === "spend") b -= Number(tx.amount||0);
  }
  return b;
}

// ---------- State (streak + ad caps per day) ----------
type AdCounts = { [adId:string]: { view:number; click:number } };
type DeviceAd = { day:string; counts: AdCounts; total:number };
type DeviceStreak = { lastClaim?:string; count:number };

type State = {
  ad: { [device:string]: DeviceAd };
  streak: { [device:string]: DeviceStreak };
};

function todayStr(){ return new Date().toISOString().slice(0,10); }

function readState(): State {
  try{
    if(!fs.existsSync(stateFile)) return { ad:{}, streak:{} };
    const raw = fs.readFileSync(stateFile, "utf8");
    return JSON.parse(raw);
  }catch{ return { ad:{}, streak:{} }; }
}
function writeState(s:State){
  try{
    fs.mkdirSync(path.dirname(stateFile), { recursive: true });
    fs.writeFileSync(stateFile, JSON.stringify(s, null, 2), "utf8");
  }catch(e){ console.error("writeState", e); }
}

// Get streak info
export function getStreak(device:string){
  const s = readState();
  const rec = s.streak[device] || { lastClaim: undefined, count: 0 };
  const today = todayStr();
  const todayClaimed = rec.lastClaim === today;
  return { streak: rec.count, lastClaim: rec.lastClaim, todayClaimed };
}

// Apply streak claim: + (5 + min(15,streak)) coins
export function claimStreak(device:string){
  const s = readState();
  const rec = s.streak[device] || { lastClaim: undefined, count: 0 };
  const today = todayStr();
  if(rec.lastClaim === today){
    return { ok:false, duplicate:true, streak: rec.count, amount:0, balance: balance(device) };
  }
  // simple logic: if yesterday claimed, increment; else reset to 1
  const prev = rec.lastClaim;
  const y = new Date(); y.setDate(y.getDate()-1);
  const ystr = y.toISOString().slice(0,10);
  if(prev === ystr) rec.count = Math.min(365, (rec.count||0)+1);
  else rec.count = 1;
  rec.lastClaim = today;
  s.streak[device] = rec;
  writeState(s);

  const reward = 5 + Math.min(15, rec.count);
  const tx = { id:"tx_"+Math.random().toString(36).slice(2,10), at: Date.now(), device, action:"earn", amount: reward, reason:"streak", opId: "streak:"+today };
  appendTx(tx);
  return { ok:true, duplicate:false, streak: rec.count, amount: reward, balance: balance(device) };
}

// Handle ad reward with caps
// Rules: per-day, per-device caps:
// - view: +1 coin up to 3/ad/day
// - click: +3 coins up to 5/ad/day
// - global max per day: 20 coins via ad rewards
export function redeemAd(device:string, adId:string, kind:"view"|"click"){
  const s = readState();
  const today = todayStr();
  const rec = s.ad[device] || { day: today, counts: {}, total: 0 };
  if(rec.day !== today){
    rec.day = today; rec.counts = {}; rec.total = 0;
  }
  const per = rec.counts[adId] || { view:0, click:0 };
  let reward = 0;
  if (kind === "view"){
    if (per.view >= 3) return { ok:false, reason:"cap_per_ad_view", balance: balance(device), counts: per, total: rec.total };
    if (rec.total >= 20) return { ok:false, reason:"cap_daily_total", balance: balance(device), counts: per, total: rec.total };
    per.view += 1; reward = 1; rec.total += reward;
  } else {
    if (per.click >= 5) return { ok:false, reason:"cap_per_ad_click", balance: balance(device), counts: per, total: rec.total };
    if (rec.total >= 20) return { ok:false, reason:"cap_daily_total", balance: balance(device), counts: per, total: rec.total };
    per.click += 1; reward = 3; rec.total += reward;
  }
  rec.counts[adId] = per;
  s.ad[device] = rec;
  writeState(s);

  const tx = { id:"tx_"+Math.random().toString(36).slice(2,10), at: Date.now(), device, action:"earn", amount: reward, reason:"ad_"+kind, opId: "ad:"+today+":"+adId+":"+kind+":"+per[kind] };
  appendTx(tx);
  return { ok:true, amount: reward, balance: balance(device), counts: per, total: rec.total };
}
