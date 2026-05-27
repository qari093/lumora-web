export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      retryStrategies:true,
      modes:["exponential-backoff","jitter","bounded-retry"],
      targets:["db","queue","connector"],
      enabled:true
    },
    ts:Date.now()
  });
}
