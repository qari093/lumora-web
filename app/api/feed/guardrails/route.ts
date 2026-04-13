import { applyGuardrails } from "@/lib/feed/guardrails/engine";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:applyGuardrails(Array.from({length:100}))}),{headers:{"content-type":"application/json"}});
}
