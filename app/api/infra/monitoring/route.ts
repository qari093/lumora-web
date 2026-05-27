export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      monitoringDashboards:true,
      panels:["infra","fyp","personalization","trust","feedback"],
      enabled:true
    },
    ts:Date.now()
  });
}
