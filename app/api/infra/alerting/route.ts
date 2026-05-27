export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      alertingSystem:true,
      triggers:["latency-breach","error-spike","service-down"],
      delivery:["dashboard","email","webhook"],
      enabled:true
    },
    ts:Date.now()
  });
}
