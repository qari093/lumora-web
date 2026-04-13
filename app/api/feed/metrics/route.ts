import { collectMetrics } from "@/lib/feed/metrics/collector";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:collectMetrics([{id:1},{id:2}])}),{headers:{"content-type":"application/json"}});
}
