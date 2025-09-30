import fs from "node:fs/promises";
import path from "node:path";

type ScoreRec = { id:string; at:number; gameId:string; player:string; score:number; device?:string };
type EventRec = { id:string; at:number; gameId?:string; type:string; device?:string; meta?:any };
type SessionStart = { at:number; sessionId:string; gameId:string; device:string };
type SessionStop  = { at:number; sessionId:string; durationSec:number };

const dir = () => path.join(process.cwd(), ".data", "gmar");
const fEvents = () => path.join(dir(), "events.jsonl");
const fScores = () => path.join(dir(), "scores.jsonl");
const fSessions = () => path.join(dir(), "sessions.jsonl");
const fTop = () => path.join(dir(), "top.json");

const G:any = global as any;
G.__GMAR_TOP__ = G.__GMAR_TOP__ || new Map<string,{player:string;score:number;at:number}[]>();
const TOP: Map<string,{player:string;score:number;at:number}[]> = G.__GMAR_TOP__;

async function init(){
  await fs.mkdir(dir(),{recursive:true});
  for (const p of [fEvents(),fScores(),fSessions()]) { try{ await fs.access(p); } catch{ await fs.writeFile(p,"","utf8"); } }
  try{ const raw=await fs.readFile(fTop(),"utf8"); const j=JSON.parse(raw); for(const k of Object.keys(j)) TOP.set(k,j[k]); }catch{}
}
init().catch(()=>{});

export async function appendEvent(e:EventRec){ await fs.appendFile(fEvents(), JSON.stringify(e)+"\n", "utf8"); }
export async function appendScore(s:ScoreRec){
  await fs.appendFile(fScores(), JSON.stringify(s)+"\n", "utf8");
  const arr = TOP.get(s.gameId) || [];
  arr.push({ player:s.player, score:s.score, at:s.at });
  arr.sort((a,b)=> b.score - a.score || a.at - b.at);
  TOP.set(s.gameId, arr.slice(0,100));
  await flushTop();
}
async function flushTop(){
  const o:any = {}; for(const [k,v] of TOP.entries()) o[k]=v;
  await fs.writeFile(fTop(), JSON.stringify(o,null,2), "utf8");
}
export async function getTopScores(gameId:string, limit=50){ return (TOP.get(gameId)||[]).slice(0, limit); }
export async function logSessionStart(s:SessionStart){ await fs.appendFile(fSessions(), JSON.stringify({ kind:"start", ...s })+"\n", "utf8"); }
export async function logSessionStop(s:SessionStop){ await fs.appendFile(fSessions(), JSON.stringify({ kind:"stop", ...s })+"\n", "utf8"); }
