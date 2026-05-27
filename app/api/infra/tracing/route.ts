export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      tracingSystem:true,
      spans:["ingestion","ranking","feed","personalization"],
      correlationId:true,
      enabled:true
    },
    ts:Date.now()
  });
}
