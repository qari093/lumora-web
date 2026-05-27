export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      invalidation:"event-driven",
      targets:["feed","signals","ranking"],
      enabled:true
    },
    ts:Date.now()
  });
}
