export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{loop:"collect-score-adjust",cadenceSec:300,enabled:true},
    ts:Date.now()
  });
}
