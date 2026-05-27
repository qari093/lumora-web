export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      logs:["trust-change","flag","block"],
      retentionDays:30,
      enabled:true
    },
    ts:Date.now()
  });
}
