export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      runtime:"active",
      anomalyClasses:["velocity-spike","source-drift","pattern-break"],
      enabled:true
    },
    ts:Date.now()
  });
}
