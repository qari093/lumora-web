export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      misinformationDetection:"active",
      sources:["news","social","ugc"],
      action:"flag-and-downrank",
      enabled:true
    },
    ts:Date.now()
  });
}
