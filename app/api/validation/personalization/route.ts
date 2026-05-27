export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      personalizationAccuracy:true,
      score:0.82,
      threshold:0.75,
      passed:true,
      enabled:true
    },
    ts:Date.now()
  });
}
