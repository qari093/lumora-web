export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      personalizationCache:true,
      ttlSec:300,
      cacheKeys:["profile","intent","mix"],
      enabled:true
    },
    ts:Date.now()
  });
}
