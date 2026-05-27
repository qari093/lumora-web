export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      engines:["FYP","FOMO","CineVerse","Ads","Feedback","State"],
      integrationStatus:"connected",
      enabled:true
    },
    ts:Date.now()
  });
}
