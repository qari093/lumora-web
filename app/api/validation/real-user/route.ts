export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      realUserSimulation:true,
      cohorts:["new","returning","high-intent"],
      result:"pass",
      enabled:true
    },
    ts:Date.now()
  });
}
