export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      semanticValid:true,
      model:"llm-check",
      confidence:0.88,
      enabled:true
    },
    ts:Date.now()
  });
}
