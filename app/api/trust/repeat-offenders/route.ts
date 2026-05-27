export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      tracking:true,
      thresholds:{warning:2,block:5},
      decayDays:30,
      enabled:true
    },
    ts:Date.now()
  });
}
