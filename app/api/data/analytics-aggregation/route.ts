export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      tables:["signal_daily","trend_hourly","source_rollup"],
      aggregation:"ready",
      enabled:true
    },
    ts:Date.now()
  });
}
