export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      triggerRerank:true,
      triggers:["spike","drop","anomaly"],
      action:"recompute-ranking",
      enabled:true
    },
    ts:Date.now()
  });
}
