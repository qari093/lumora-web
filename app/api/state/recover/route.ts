export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{recovered:true,source:"cache",enabled:true},
    ts:Date.now()
  });
}
