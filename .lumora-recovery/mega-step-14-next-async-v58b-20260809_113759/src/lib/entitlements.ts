import { cookies } from "next/headers";
export function getEntitlements(){ try{ return JSON.parse(cookies().get("lumora_entitlements")?.value||"{}"); }catch{ return {}; } }
export function setPro(val:boolean){
  cookies().set({ name:"lumora_entitlements", value: JSON.stringify({ pro: !!val }),
    httpOnly:true, sameSite:"lax", path:"/", maxAge:60*60*24*365 });
}
