export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      retries:3,
      backoffMs:500,
      strategy:"exponential",
      enabled:true
    },
    ts:Date.now()
  });
}
