export type Ach = { id:string; title:string; desc:string; earnedAt?:number };
export type Inv = { coins:number; items:string[] };

function lsGet(key:string, fallback:any){
  if (typeof window==="undefined") return fallback;
  try{ const raw = localStorage.getItem(key); return raw? JSON.parse(raw) : fallback; } catch{ return fallback; }
}
function lsSet(key:string, value:any){
  if (typeof window==="undefined") return;
  try{ localStorage.setItem(key, JSON.stringify(value)); }catch{}
}

export function loadBest(gameId:string){ const o = lsGet("gmar_best", {} as Record<string,number>); return o[gameId] || 0; }
export function saveBest(gameId:string, score:number){ const o = lsGet("gmar_best", {} as Record<string,number>); if (score > (o[gameId]||0)) { o[gameId]=score; lsSet("gmar_best", o); return true; } return false; }

export function loadInv():Inv{ return lsGet("gmar_inv", {coins:0, items:[]} as Inv); }
export function saveInv(inv:Inv){ lsSet("gmar_inv", inv); }

export function addCoins(n:number){ const inv=loadInv(); inv.coins = Math.max(0,(inv.coins||0)+n); saveInv(inv); return inv.coins; }

export function loadAch():Ach[]{ return lsGet("gmar_ach", [] as Ach[]); }
export function earnAch(a:Ach){
  const arr=loadAch();
  if(!arr.some(x=>x.id===a.id)){
    a.earnedAt=Date.now();
    arr.push(a); lsSet("gmar_ach", arr);
    return true;
  }
  return false;
}
export function resetAll(){ lsSet("gmar_best", {}); lsSet("gmar_inv", {coins:0,items:[]}); lsSet("gmar_ach", []); }
