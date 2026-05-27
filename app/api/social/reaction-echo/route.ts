export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      reactionEcho:true,
      modes:["live","buffered"],
      privacy:"no-raw-storage",
      enabled:true
    },
    ts:Date.now()
  });
}
