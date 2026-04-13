import { scrollVelocity } from "@/lib/interaction/scroll/engine";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:scrollVelocity(),ts:Date.now()}),{headers:{"content-type":"application/json"}});
}
