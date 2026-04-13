import { enforceDiversity } from "@/lib/feed/diversity/engine";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:enforceDiversity([{a:1},{b:2}]),ts:Date.now()}),{headers:{"content-type":"application/json"}});
}
