import { multiTouch } from "@/lib/interaction/multitouch/engine";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:multiTouch(),ts:Date.now()}),{headers:{"content-type":"application/json"}});
}
