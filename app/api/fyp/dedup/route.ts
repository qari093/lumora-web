export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      deduplication:true,
      keys:["contentId","sourceHash","eventKey"],
      strategy:"drop-duplicates",
      enabled:true
    },
    ts:Date.now()
  });
}
