export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      cohorts:["new","returning","high-intent"],
      simulationRuns:3,
      result:"pass"
    },
    ts:Date.now()
  });
}
