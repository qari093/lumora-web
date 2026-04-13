import { cooldownNotice } from "@/lib/fomo/cooldown/notifications";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:cooldownNotice(),ts:Date.now()}),{headers:{"content-type":"application/json"}});
}
