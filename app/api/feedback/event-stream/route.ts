export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      stream:true,
      target:"feedback-pipeline",
      transport:"async-queue",
      enabled:true
    },
    ts:Date.now()
  });
}
