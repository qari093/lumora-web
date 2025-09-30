import { ReferralLink, ReferralMap, UserId } from "@/types/economy";
import { credit } from "@/lib/ledger";
const links=new Map<string,ReferralLink>();
const lifetime:ReferralMap={};
export function createLink(referrerId:UserId):ReferralLink{
  const code=Math.random().toString(36).slice(2,8);
  const l={code,referrerId,createdAt:Date.now()}; links.set(code,l); return l;
}
export function acceptLink(code:string,inviteeId:UserId, rate=0.01){
  const l=links.get(code); if(!l) throw new Error("invalid code");
  if(lifetime[inviteeId]) return lifetime[inviteeId];
  lifetime[inviteeId]={ referrerId:l.referrerId, rate}; return lifetime[inviteeId];
}
export function recordEarning(earner:UserId, amountZc:number, source:string){
  const rel=lifetime[earner]; if(!rel) return null;
  const kick=Math.max(0, Math.floor(amountZc*rel.rate)); if(kick<=0) return null;
  credit(rel.referrerId,"ZC",kick,`referral bonus from ${earner} (${source})`);
  return { referrerId:rel.referrerId, kick };
}
