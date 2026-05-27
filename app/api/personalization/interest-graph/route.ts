export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      interestGraph:true,
      nodes:["genre","topic","creator","format"],
      edges:["viewed","replayed","lingered","skipped"],
      enabled:true
    },
    ts:Date.now()
  });
}
