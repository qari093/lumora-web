export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      metrics:["throughput","latency","failure-rate","dedup-rate"],
      collection:"enabled",
      enabled:true
    },
    ts:Date.now()
  });
}
