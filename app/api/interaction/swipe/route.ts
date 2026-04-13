import { swipeAction } from "@/lib/interaction/swipe/engine";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:swipeAction(),ts:Date.now()}),{headers:{"content-type":"application/json"}});
}
