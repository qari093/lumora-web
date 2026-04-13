import { dedupeFeed } from "@/lib/feed/dedupe/engine";
export const dynamic="force-dynamic";
export async function GET(){
  const sample=[{id:"1"},{id:"1"},{id:"2"}];
  return new Response(JSON.stringify({ok:true,data:dedupeFeed(sample),ts:Date.now()}),{headers:{"content-type":"application/json"}});
}
