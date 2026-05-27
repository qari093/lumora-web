export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{synced:true,latencyMs:120,enabled:true},
    ts:Date.now()
  });
}
