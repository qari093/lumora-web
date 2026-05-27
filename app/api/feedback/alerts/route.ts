export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      alerts:true,
      triggers:["ranking-drop","engagement-collapse","feedback-anomaly"],
      delivery:["dashboard","email","webhook"],
      enabled:true
    },
    ts:Date.now()
  });
}
