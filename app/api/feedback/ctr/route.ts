export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      ctrComputation:true,
      formula:"clicks/impressions",
      granularity:["item","cohort","session"],
      enabled:true
    },
    ts:Date.now()
  });
}
