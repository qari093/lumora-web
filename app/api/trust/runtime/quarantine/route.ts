export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      queue:"quarantine",
      size:0,
      action:"manual-review",
      enabled:true
    },
    ts:Date.now()
  });
}
