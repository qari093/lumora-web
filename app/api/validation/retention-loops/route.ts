export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      loops:["fomo","social","personalization","feedback"],
      stable:true,
      passed:true
    },
    ts:Date.now()
  });
}
