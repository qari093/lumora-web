export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      deduplication:true,
      strategy:"hash+timestamp",
      collisions:0,
      enabled:true
    },
    ts:Date.now()
  });
}
