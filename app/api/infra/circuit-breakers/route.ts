export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      circuitBreakers:true,
      policies:["open","half-open","closed"],
      targets:["ingestion","ranking","notifications"],
      enabled:true
    },
    ts:Date.now()
  });
}
