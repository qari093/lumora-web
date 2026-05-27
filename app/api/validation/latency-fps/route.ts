export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      apiLatencyMs:120,
      fpsTarget:60,
      passed:true
    },
    ts:Date.now()
  });
}
