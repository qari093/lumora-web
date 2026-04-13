import { integrityCheck } from "@/lib/feed/integrity/check";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:integrityCheck([{id:1}])}),{headers:{"content-type":"application/json"}});
}
