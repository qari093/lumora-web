import { decayAlert } from "@/lib/fomo/decay/alerts";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:decayAlert(),ts:Date.now()}),{headers:{"content-type":"application/json"}});
}
