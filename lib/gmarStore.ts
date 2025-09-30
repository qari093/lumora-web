import fs from "node:fs/promises";
import path from "node:path";

type Event = { id:string; gameId:string; type:string; device:string; at:number; meta?:any; variant?:string };
type Score = { player:string; score:number; device:string; at:number };

type Store = {
  events: Event[];
  scores: Record<string, Score[]>;
  ab: Record<string, "holo"|"banner">;               // device -> variant
  caps: Record<string, Record<string,{ count:number; since:number }>>;  // device -> game -> cap
};

const file = path.join(process.cwd(), ".data", "gmar.json");

async function read(): Promise<Store> {
  try {
    const raw = await fs.readFile(file, "utf8");
    const j = JSON.parse(raw);
    // ensure shape
    return {
      events: Array.isArray(j?.events) ? j.events : [],
      scores: j?.scores || {},
      ab: j?.ab || {},
      caps: j?.caps || {}
    };
  } catch {
    return { events: [], scores: {}, ab: {}, caps: {} };
  }
}
async function write(s:Store) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(s,null,2), "utf8");
}

// ---- events ----
export async function addEvent(ev: Omit<Event,"id"|"at">){
  const st = await read();
  st.events.push({ id: "e_"+Math.random().toString(36).slice(2,10), at: Date.now(), ...ev });
  // keep last 10k
  if (st.events.length > 10000) st.events.splice(0, st.events.length-10000);
  await write(st);
  return true;
}
export async function getEvents(limit=200){
  const st = await read();
  const n = Math.max(1, Math.min(limit, 1000));
  return st.events.slice(-n).reverse();
}

// ---- scores ----
export async function addScore(gameId:string, player:string, score:number, device:string){
  const st = await read();
  const gs = st.scores[gameId] || [];
  gs.push({ player, score, device, at: Date.now() });
  // keep top 100 by score
  gs.sort((a,b)=> b.score - a.score);
  st.scores[gameId] = gs.slice(0, 100);
  await write(st);
  return true;
}
export async function topScores(gameId:string, limit=20){
  const st = await read();
  const gs = st.scores[gameId] || [];
  return gs.slice(0, Math.min(limit, 100));
}

// ---- ads AB + caps ----
function windowSec(){ return 10*60; } // 10 min window
export async function pickVariantFor(device:string): Promise<"holo"|"banner"> {
  const st = await read();
  if (st.ab[device]) return st.ab[device];
  const v = Math.random() < 0.6 ? "holo" : "banner";
  st.ab[device] = v;
  await write(st);
  return v;
}
export async function capAllow(device:string, game:string): Promise<boolean> {
  const st = await read();
  const now = Math.floor(Date.now()/1000);
  st.caps[device] = st.caps[device] || {};
  const cap = st.caps[device][game] || { count:0, since: now };
  if ((now - cap.since) > windowSec()) {
    cap.count = 0; cap.since = now;
  }
  const allowed = cap.count < 3; // max 3 per window per game per device
  if (allowed) cap.count += 1;
  st.caps[device][game] = cap;
  await write(st);
  return allowed;
}
