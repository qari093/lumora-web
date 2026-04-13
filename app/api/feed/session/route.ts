import { sessionMemory } from "@/lib/feed/session/engine";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:sessionMemory([{id:1}]),ts:Date.now()}),{headers:{"content-type":"application/json"}});
}
