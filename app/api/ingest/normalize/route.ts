export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      schema:"unified-signal-v1",
      normalized:true,
      fields:["source","timestamp","velocity","tags"],
      enabled:true
    },
    ts:Date.now()
  });
}
