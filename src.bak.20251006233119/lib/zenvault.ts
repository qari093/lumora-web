import { UserId } from "@/types/economy";
import { credit, debit } from "@/lib/ledger";
export type Direction = "BUY_ZC_WITH_ZCPLUS" | "SELL_ZC_FOR_ZCPLUS";
export interface Quote { direction:Direction; rate:number; ts:number }
export function getQuote(direction:Direction):Quote{
  const base = direction==="BUY_ZC_WITH_ZCPLUS" ? 100 : 0.01;
  return { direction, rate: base, ts: Date.now() };
}
export function exchange(userId:UserId, direction:Direction, amount:number, complianceToken:string){
  if(!complianceToken) throw new Error("missing compliance token");
  const q = getQuote(direction);
  if (direction === "BUY_ZC_WITH_ZCPLUS"){
    credit(userId, "ZC", Math.floor(amount * q.rate), "ZC+ -> ZC (ZenVault)");
  } else {
    debit(userId, "ZC", amount, "ZC -> ZC+ (ZenVault)");
  }
  return { ok:true, rate:q.rate };
}
