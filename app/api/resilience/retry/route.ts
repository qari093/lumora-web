export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{maxRetries:3,backoffMs:500,enabled:true},
    ts:Date.now()
  });
}
