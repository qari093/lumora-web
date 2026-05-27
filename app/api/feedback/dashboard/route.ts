export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      dashboards:true,
      panels:["engagement","ranking-impact","anomalies","trend-response"],
      enabled:true
    },
    ts:Date.now()
  });
}
