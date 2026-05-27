export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      autoscaling:true,
      triggers:["cpu>70","latency>200","rps-spike"],
      scaleStrategy:"horizontal",
      enabled:true
    },
    ts:Date.now()
  });
}
