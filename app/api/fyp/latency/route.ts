export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      latencyTracking:true,
      targets:["p50","p95","p99"],
      thresholdMs:200,
      enabled:true
    },
    ts:Date.now()
  });
}
