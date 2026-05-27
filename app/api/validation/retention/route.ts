export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      retentionLoops:true,
      loops:["fomo","social","personalization","feedback"],
      stable:true,
      passed:true,
      enabled:true
    },
    ts:Date.now()
  });
}
