export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      crashFree:true,
      runtimeErrors:0,
      passed:true,
      enabled:true
    },
    ts:Date.now()
  });
}
