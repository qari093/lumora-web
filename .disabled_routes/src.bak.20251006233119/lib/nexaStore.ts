import fs from "fs";
import path from "path";
import { PLANS, todayTasks } from "./nexaPlans";

export type Profile = {
  device: string;
  planId?: string;
  dayIndex: number;        // 0-based
  streak: number;
  lastDoneAt?: number;
  lastViewedAt?: number;
};

type DBShape = { users: Record<string, Profile> };
const FILE = path.join(process.cwd(), ".data", "nexa-store.json");

function load(): DBShape {
  try { return JSON.parse(fs.readFileSync(FILE, "utf8")); }
  catch { return { users: {} }; }
}
function save(db: DBShape){ fs.mkdirSync(path.dirname(FILE), {recursive:true}); fs.writeFileSync(FILE, JSON.stringify(db,null,2)); }

const db: DBShape = load();

export function getProfile(device: string): Profile {
  if(!db.users[device]) db.users[device] = { device, dayIndex:0, streak:0 };
  return db.users[device];
}

export function listPlans(){ return PLANS; }

export function startPlan(device:string, planId:string){
  const p = getProfile(device);
  if(!PLANS.find(pl=>pl.id===planId)) throw new Error("Invalid planId");
  p.planId = planId;
  p.dayIndex = 0;
  p.streak = 0;
  p.lastDoneAt = undefined;
  save(db);
  return p;
}

export function today(device:string){
  const p = getProfile(device);
  if(!p.planId) return { assigned:false, message:"کوئی پلان منتخب نہیں۔", profile:p };
  const tasks = todayTasks(p.planId, p.dayIndex);
  return { assigned:true, planId:p.planId, dayIndex:p.dayIndex, streak:p.streak, tasks };
}

export function markProgress(device:string, done:boolean, metrics?:any){
  const p = getProfile(device);
  const now = Date.now();
  // ایک دن میں ایک ہی بار "done" قبول — اگر پہلے ہوچکا تو idempotent
  const dayKey = new Date(now).toISOString().slice(0,10);
  const lastKey = p.lastDoneAt ? new Date(p.lastDoneAt).toISOString().slice(0,10) : null;

  if(done){
    if(lastKey === dayKey){
      return { ok:true, repeated:true, profile:p };
    }
    // streak لاجک (سیدھی): اگر گزشتہ دن مکمل تھا تو +1 ورنہ reset
    let incStreak = 1;
    if(p.lastDoneAt){
      const prev = new Date(p.lastDoneAt); prev.setDate(prev.getDate()+1);
      const prevKey = prev.toISOString().slice(0,10);
      incStreak = (prevKey === dayKey) ? (p.streak+1) : 1;
    }
    p.streak = incStreak;
    p.lastDoneAt = now;
    p.dayIndex += 1; // اگلا دن/فیز
    save(db);
  }
  return { ok:true, profile:p, metrics };
}

export function summary(device:string){
  const p = getProfile(device);
  const has = !!p.planId;
  const nextAt = (()=>{ const d = new Date(); d.setHours(23,59,59,999); return d.getTime(); })();
  return { hasPlan:has, planId:p.planId, dayIndex:p.dayIndex, streak:p.streak, lastDoneAt:p.lastDoneAt, nextEligibleAt: nextAt };
}
