export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      suppression:true,
      threshold:0.2,
      action:"downrank",
      enabled:true
    },
    ts:Date.now()
  });
}
