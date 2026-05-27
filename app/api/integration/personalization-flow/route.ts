export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      profileLoaded:true,
      rankingApplied:true,
      fallbackUsed:false
    },
    ts:Date.now()
  });
}
