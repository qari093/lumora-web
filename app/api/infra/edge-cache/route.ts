export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      edgeCaching:true,
      rules:["cache-first","stale-while-revalidate"],
      ttlSec:120,
      enabled:true
    },
    ts:Date.now()
  });
}
