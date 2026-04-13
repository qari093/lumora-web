import { voiceTrigger } from "@/lib/interaction/voice/engine";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:voiceTrigger(),ts:Date.now()}),{headers:{"content-type":"application/json"}});
}
