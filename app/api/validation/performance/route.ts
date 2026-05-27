export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      latencyMs:120,
      fpsTarget:60,
      passed:true,
      enabled:true
    },
    ts:Date.now()
  });
}
