import { latencyGuard } from "@/lib/feed/latency/guard";
export const dynamic="force-dynamic";
export async function GET(){
  return new Response(JSON.stringify({ok:true,data:latencyGuard()}),{headers:{"content-type":"application/json"}});
}
