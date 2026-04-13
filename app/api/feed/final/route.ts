import { finalizeFeed } from "@/lib/feed/final/engine";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:finalizeFeed([{id:1}]),ts:Date.now()}),{headers:{"content-type":"application/json"}});
}
