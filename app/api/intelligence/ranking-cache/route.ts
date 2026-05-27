export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      cache:"ranking-cache",
      ttlSec:120,
      invalidation:"event-driven",
      enabled:true
    },
    ts:Date.now()
  });
}
