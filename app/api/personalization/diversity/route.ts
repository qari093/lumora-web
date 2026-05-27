export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      diversityInjection:true,
      sources:["adjacent-topics","new-creators","alt-formats"],
      capPerBatch:2,
      enabled:true
    },
    ts:Date.now()
  });
}
