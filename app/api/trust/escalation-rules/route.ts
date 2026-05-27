export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      rules:["high-risk-source","repeat-scam","mass-report"],
      escalationTargets:["senior-mod","safety-team"],
      enabled:true
    },
    ts:Date.now()
  });
}
