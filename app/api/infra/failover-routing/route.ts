export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      failoverRouting:true,
      routes:["primary","secondary","fallback"],
      decision:"health-based",
      enabled:true
    },
    ts:Date.now()
  });
}
