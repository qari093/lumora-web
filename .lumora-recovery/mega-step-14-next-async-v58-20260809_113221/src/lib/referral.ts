import { getRedis } from "./redis";
import { cookies } from "next/headers";
function uid(){ let id=cookies().get("lumora_uid")?.value; if(!id){ id=crypto.randomUUID(); cookies().set({name:"lumora_uid",value:id,path:"/",sameSite:"lax",httpOnly:true,maxAge:31536000}); } return id; }
function codeFor(u:string){ return u.replace(/-/g,"").slice(0,8).toUpperCase(); }
export async function issueReferral(){ const id=uid(); return { code: codeFor(id) }; }
export async function claimReferral(code:string){
  const id = uid(); const r = getRedis();
  if(!code) return { ok:false as const, error:"bad_code" };
  if(r){
    const ownerKey = `ref:owner:${code}`;
    const owner = await r.get(ownerKey);
    if(!owner){ await r.set(ownerKey, id, "EX", 365*24*3600); return { ok:false as const, error:"self_code_init" }; }
    if(owner===id) return { ok:false as const, error:"self_ref" };
    const claimed = await r.set(`ref:claimed:${id}:${code}`, "1", "EX", 365*24*3600, "NX");
    if(claimed!=="OK") return { ok:false as const, error:"already_claimed" };
    const ownerEarn = await r.incrby(`ref:earn:${owner}`, 5);
    const joinEarn  = await r.incrby(`ref:earn:${id}`, 3);
    return { ok:true as const, owner, addedOwner:5, addedJoiner:3, ownerTotal:ownerEarn, joinerTotal:joinEarn };
  }
  return { ok:true as const, owner:"mem", addedOwner:5, addedJoiner:3, ownerTotal:5, joinerTotal:3 };
}
