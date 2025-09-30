export type GEvent = { id:string; at:number; gameId?:string; type:string; device?:string; meta?:any };
export type Session = { sessionId:string; gameId:string; device:string; startedAt:number; lastBeat:number };

const G:any = global as any;
G.__GMAR_EVENTS__ = G.__GMAR_EVENTS__ || [] as GEvent[];
G.__GMAR_SESS__   = G.__GMAR_SESS__   || new Map<string,Session>();
const MAX = 200;

export function listEvents(){ return G.__GMAR_EVENTS__.slice(-MAX); }
export function pushEvent(e:GEvent){ const a=G.__GMAR_EVENTS__; a.push(e); if(a.length>1000) a.splice(0,a.length-1000); }

export function startSession(sessionId:string, data:{gameId:string; device:string}){
  G.__GMAR_SESS__.set(sessionId, { sessionId, gameId:data.gameId, device:data.device, startedAt: Date.now(), lastBeat: Date.now() });
}
export function heartbeat(sessionId:string){ const s=G.__GMAR_SESS__.get(sessionId); if(!s) return false; s.lastBeat=Date.now(); return true; }
export function stopSession(sessionId:string){ const s=G.__GMAR_SESS__.get(sessionId); if(!s) return null; const d=Math.round((Date.now()-s.startedAt)/1000); G.__GMAR_SESS__.delete(sessionId); return { sessionId, gameId:s.gameId, device:s.device, durationSec:d }; }
export function listSessions(){ return [...G.__GMAR_SESS__.values()]; }
