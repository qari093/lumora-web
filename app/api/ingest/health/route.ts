export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      health:"green",
      latencyMs:120,
      failures:0,
      enabled:true
    },
    ts:Date.now()
  });
}
