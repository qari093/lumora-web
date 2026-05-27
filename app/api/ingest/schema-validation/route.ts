export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      schema:"signal-v1",
      valid:true,
      rejected:0,
      enabled:true
    },
    ts:Date.now()
  });
}
