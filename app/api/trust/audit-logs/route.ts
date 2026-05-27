export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      logs:["flag","quarantine","takedown","appeal"],
      retentionDays:90,
      enabled:true
    },
    ts:Date.now()
  });
}
