export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      coldStart:true,
      seeds:["global-trending","regional-safe","editorial-fallback"],
      personalizationDeferred:true,
      enabled:true
    },
    ts:Date.now()
  });
}
