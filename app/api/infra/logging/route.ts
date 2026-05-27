export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      loggingAggregation:true,
      sources:["api","fyp","personalization","trust"],
      sinks:["file","remote","dashboard"],
      enabled:true
    },
    ts:Date.now()
  });
}
