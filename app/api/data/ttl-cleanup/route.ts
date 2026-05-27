export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      cleanup:"scheduled",
      intervalMin:60,
      targets:["expired-signals","stale-cache"],
      enabled:true
    },
    ts:Date.now()
  });
}
