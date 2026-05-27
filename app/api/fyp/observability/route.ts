export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      observability:true,
      metrics:["latency","throughput","errors","engagement"],
      enabled:true
    },
    ts:Date.now()
  });
}
