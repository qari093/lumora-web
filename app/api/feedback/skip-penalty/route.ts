export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      skipPenalty:true,
      penaltyFactor:0.7,
      impact:["ranking","diversity-control"],
      enabled:true
    },
    ts:Date.now()
  });
}
