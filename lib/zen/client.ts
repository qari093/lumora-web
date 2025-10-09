function device(): string {
  try{
    const k = "zen-device";
    const v = localStorage.getItem(k);
    if (v) return v;
    const d = "dev-"+Math.random().toString(36).slice(2,10);
    localStorage.setItem(k, d);
    return d;
  }catch{
    return "dev-local";
  }
}

export async function getBalance(): Promise<number> {
  try{
    const r = await fetch("/api/zen/ledger", { headers: {"x-device-id": device()}, cache: "no-store" });
    const j = await r.json();
    if (j?.ok) {
      const b = Number(j.balance || 0);
      if (typeof window!=="undefined") localStorage.setItem("zen_balance", String(b));
      return b;
    }
  }catch{}
  if (typeof window!=="undefined") return Number(localStorage.getItem("zen_balance")||"0");
  return 0;
}

export async function earn(amount:number, reason:string, opId?:string): Promise<{ok:boolean; balance?:number}> {
  try{
    const r = await fetch("/api/zen/ledger", {
      method: "POST",
      headers: {"Content-Type": "application/json", "x-device-id": device()},
      body: JSON.stringify({ action: "earn", amount, reason, opId })
    });
    const j = await r.json();
    if (j?.ok) {
      const b = Number(j.balance || 0);
      if (typeof window!=="undefined") localStorage.setItem("zen_balance", String(b));
      return { ok: true, balance: b };
    }
  }catch{}
  return { ok:false };
}

export async function spend(amount:number, reason:string, opId?:string): Promise<{ok:boolean; balance?:number; error?:string}> {
  try{
    const r = await fetch("/api/zen/ledger", {
      method: "POST",
      headers: {"Content-Type": "application/json", "x-device-id": device()},
      body: JSON.stringify({ action: "spend", amount, reason, opId })
    });
    const j = await r.json();
    if (j?.ok) {
      const b = Number(j.balance || 0);
      if (typeof window!=="undefined") localStorage.setItem("zen_balance", String(b));
      return { ok: true, balance: b };
    } else {
      return { ok:false, error: j?.error || "spend_failed" };
    }
  }catch(e:any){
    return { ok:false, error: String(e?.message || e || "spend_failed") };
  }
}

export async function batch(ops: {action:"earn"|"spend"|"refund"; amount:number; reason?:string; opId?:string}[]){
  try{
    const r = await fetch("/api/zen/batch", {
      method: "POST",
      headers: {"Content-Type": "application/json", "x-device-id": device()},
      body: JSON.stringify({ ops })
    });
    const j = await r.json();
    if (j?.ok) {
      const b = Number(j.balance || 0);
      if (typeof window!=="undefined") localStorage.setItem("zen_balance", String(b));
      return { ok:true, results: j.results, balance: b };
    }
    return { ok:false, error: j?.error || "batch_failed" };
  }catch(e:any){
    return { ok:false, error: String(e?.message||e) };
  }
}

export async function claimDaily(): Promise<{ok:boolean; balance?:number; error?:string}> {
  try{
    const r = await fetch("/api/zen/bonus", {
      method: "POST",
      headers: {"x-device-id": device()}
    });
    const j = await r.json();
    if (j?.ok) {
      const b = Number(j.balance || 0);
      if (typeof window!=="undefined") localStorage.setItem("zen_balance", String(b));
      return { ok:true, balance: b };
    } else {
      return { ok:false, error: j?.error || "bonus_failed" };
    }
  }catch(e:any){
    return { ok:false, error: String(e?.message||e) };
  }
}
