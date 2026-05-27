export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      feedbackToRanking:true,
      signals:["ctr","watch-time","replay","skip"],
      mode:"live-update",
      enabled:true
    },
    ts:Date.now()
  });
}
