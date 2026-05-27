export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      sessionLearning:true,
      updateMode:"incremental",
      features:["recent-intent","momentum","fatigue"],
      enabled:true
    },
    ts:Date.now()
  });
}
