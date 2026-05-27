export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      discovery:true,
      sources:["trending","cross-platform","emerging"],
      enabled:true
    },
    ts:Date.now()
  });
}
