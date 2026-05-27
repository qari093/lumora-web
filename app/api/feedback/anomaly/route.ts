export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      anomalyDetection:true,
      signals:["ctr-spike","replay-burst","skip-wave"],
      action:"flag-and-isolate",
      enabled:true
    },
    ts:Date.now()
  });
}
