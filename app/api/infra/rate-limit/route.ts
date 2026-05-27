export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      globalRateLimiting:true,
      limits:{perMinute:300,burst:50},
      scopes:["api","auth","social","fomo"],
      enabled:true
    },
    ts:Date.now()
  });
}
