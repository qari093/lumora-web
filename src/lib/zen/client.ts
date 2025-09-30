export type Wallet = { zen:number; cred:number; shards:number };
export async function getBalance(){ const r=await fetch("/api/wallet/balance",{cache:"no-store"}); if(!r.ok) throw new Error("balance"); return r.json(); }
export async function startSession(){ const r=await fetch("/api/gmar/session",{method:"POST"}); if(!r.ok) throw new Error("session"); return r.json(); }
export async function finalizeSession(sessionId:string, stats:{kills:number;rank:number;minutes:number}) {
  const r=await fetch("/api/gmar/score",{method:"POST",headers:{'content-type':'application/json'},body:JSON.stringify({sessionId,stats})});
  if(!r.ok) throw new Error("finalize"); return r.json();
}
