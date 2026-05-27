export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      edgeCaching:true,
      ttlSec:60,
      strategy:"cache-then-refresh",
      enabled:true
    },
    ts:Date.now()
  });
}
