export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      queryOptimization:true,
      tactics:["projection","pagination","cache-first"],
      enabled:true
    },
    ts:Date.now()
  });
}
