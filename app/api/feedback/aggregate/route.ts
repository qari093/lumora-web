export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      aggregation:true,
      metrics:["views","watch-time","replays","skips","shares"],
      windows:["1m","15m","1h"],
      enabled:true
    },
    ts:Date.now()
  });
}
