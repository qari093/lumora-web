export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      metrics:["connections","latency","errors","cpu"],
      collection:"enabled",
      enabled:true
    },
    ts:Date.now()
  });
}
