export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{fallbackMode:"graceful-degrade",trigger:"service-failure",enabled:true},
    ts:Date.now()
  });
}
