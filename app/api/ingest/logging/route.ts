export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      logging:"enabled",
      level:"info",
      sinks:["file","console"],
      enabled:true
    },
    ts:Date.now()
  });
}
