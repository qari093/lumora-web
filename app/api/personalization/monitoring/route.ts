export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      monitoring:true,
      checks:["latency","drift","coverage","cache-hit"],
      enabled:true
    },
    ts:Date.now()
  });
}
