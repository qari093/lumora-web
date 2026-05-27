export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      cache:"redis-layer",
      status:"initialized",
      enabled:true
    },
    ts:Date.now()
  });
}
