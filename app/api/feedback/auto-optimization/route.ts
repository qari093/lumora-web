export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      autoOptimization:true,
      loop:"continuous",
      drivers:["engagement-delta","trend-shift"],
      enabled:true
    },
    ts:Date.now()
  });
}
