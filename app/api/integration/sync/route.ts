export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      engines:["FYP","FOMO","CineVerse","Ads","Feedback","State"],
      syncStatus:"valid",
      mismatches:0
    },
    ts:Date.now()
  });
}
