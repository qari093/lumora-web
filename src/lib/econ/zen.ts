import fs from "node:fs";
import path from "node:path";
type Z = { balance:number };
const P = path.resolve(process.cwd(), ".lumora-zen.json");
function load():Z{ try{ return JSON.parse(fs.readFileSync(P,"utf8")); }catch{ return { balance:0 }; } }
function save(z:Z){ fs.writeFileSync(P, JSON.stringify(z,null,2)); }
export async function balance(){ return load().balance; }
export async function credit(amount:number){ const z=load(); const a=Math.max(0,Math.floor(amount||0)); z.balance+=a; save(z); return { ok:true as const, balance:z.balance }; }
export async function debit(amount:number){ const z=load(); const a=Math.max(0,Math.floor(amount||0)); if(a>z.balance) return { ok:false as const, error:"INSUFFICIENT_FUNDS", balance:z.balance }; z.balance-=a; save(z); return { ok:true as const, balance:z.balance }; }

export async function snapshot(){ try{ const j=JSON.parse(fs.readFileSync(P,"utf8")); return { balance: Number(j?.balance||0) }; } catch { return { balance: 0 }; } }

export async function zenCredit(raw:number){
  const a = Math.max(0, Math.floor(raw||0));
  const j = load();
  j.balance = Number(j.balance||0) + a;
  save(j);
  return { ok:true as const, balance: j.balance };
}

export async function zenDebit(raw:number){
  const a = Math.max(0, Math.floor(raw||0));
  const j = load();
  if (a > Number(j.balance||0)) return { ok:false as const, error:"INSUFFICIENT_ZEN", balance: j.balance };
  j.balance = Number(j.balance||0) - a;
  save(j);
  return { ok:true as const, balance: j.balance };
}
