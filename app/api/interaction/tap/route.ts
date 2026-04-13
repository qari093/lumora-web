import { tapAction } from "@/lib/interaction/tap/engine";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:tapAction(),ts:Date.now()}),{headers:{"content-type":"application/json"}});
}
