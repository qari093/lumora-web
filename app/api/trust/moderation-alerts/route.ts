export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      alerts:["quarantine-spike","repeat-offender","high-toxicity"],
      delivery:["dashboard","email","webhook"],
      enabled:true
    },
    ts:Date.now()
  });
}
