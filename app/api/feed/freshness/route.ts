import { applyFreshness } from "@/lib/feed/freshness/engine";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:applyFreshness([{id:1}]),ts:Date.now()}),{headers:{"content-type":"application/json"}});
}
