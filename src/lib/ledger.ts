import { LedgerEntry, UserId, Currency } from "@/types/economy";
const ledger: LedgerEntry[] = [];
const idem = new Set<string>();
export function credit(userId:UserId,currency:Currency,amount:number,memo:string,key?:string):LedgerEntry{
  if(amount<=0) throw new Error("credit amount must be > 0");
  if(key&&idem.has(key)) throw new Error("idempotent duplicate");
  const e:LedgerEntry={ id:String(ledger.length+1), userId,currency,delta:amount,memo,ts:Date.now(), idempotencyKey:key };
  ledger.push(e); if(key) idem.add(key); return e;
}
export function debit(userId:UserId,currency:Currency,amount:number,memo:string,key?:string):LedgerEntry{
  if(amount<=0) throw new Error("debit amount must be > 0");
  const bal=getBalance(userId,currency); if(bal<amount) throw new Error("insufficient funds");
  if(key&&idem.has(key)) throw new Error("idempotent duplicate");
  const e:LedgerEntry={ id:String(ledger.length+1), userId,currency,delta:-amount,memo,ts:Date.now(), idempotencyKey:key };
  ledger.push(e); if(key) idem.add(key); return e;
}
export function transfer(from:UserId,to:UserId,currency:Currency,amount:number,memo:string,key?:string){
  debit(from,currency,amount,'xfer -> '+to+': '+memo, key?key+':d':undefined);
  credit(to,currency,amount,'xfer <- '+from+': '+memo, key?key+':c':undefined);
}
export function getBalance(userId:UserId,currency:Currency){
  return ledger.filter(e=>e.userId===userId && e.currency===currency).reduce((s,e)=>s+e.delta,0);
}
export function getEntries(userId:UserId){ return ledger.filter(e=>e.userId===userId).slice(-200); }
