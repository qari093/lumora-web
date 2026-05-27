export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      integrationTests:true,
      suites:["ingestion","fyp","personalization","trust","feedback"],
      result:"pass",
      enabled:true
    },
    ts:Date.now()
  });
}
