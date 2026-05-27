export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      socialAnalytics:true,
      metrics:["viewer-peaks","reaction-density","room-retention"],
      enabled:true
    },
    ts:Date.now()
  });
}
