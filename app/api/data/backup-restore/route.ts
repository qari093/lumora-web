export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      backups:"scheduled",
      restoreTested:true,
      retentionDays:30,
      enabled:true
    },
    ts:Date.now()
  });
}
