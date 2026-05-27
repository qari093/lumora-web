export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      replayWeighting:true,
      factor:1.25,
      impact:["ranking","attention-score"],
      enabled:true
    },
    ts:Date.now()
  });
}
