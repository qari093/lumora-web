export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      triggers:["cpu>75","latency>200ms","connections>80%"],
      autoscale:true,
      enabled:true
    },
    ts:Date.now()
  });
}
