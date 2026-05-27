export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      events:["consent_change","auth_check","policy_violation"],
      retentionDays:30,
      enabled:true
    },
    ts:Date.now()
  });
}
