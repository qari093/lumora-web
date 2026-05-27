export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      costMonitoring:true,
      metrics:["egress","compute","storage","cdn"],
      alerts:["budget-breach","spike-detection"],
      enabled:true
    },
    ts:Date.now()
  });
}
