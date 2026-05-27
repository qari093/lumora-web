export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      retries:3,
      backoffMs:250,
      jitter:true,
      enabled:true
    },
    ts:Date.now()
  });
}
