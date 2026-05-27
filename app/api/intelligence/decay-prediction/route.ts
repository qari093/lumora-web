export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      predictedDecayHours:18,
      confidence:0.76,
      enabled:true
    },
    ts:Date.now()
  });
}
