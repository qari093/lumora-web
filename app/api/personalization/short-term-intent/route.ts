export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      shortTermIntent:true,
      signals:["recent-watch","recent-skip","recent-replay","session-velocity"],
      horizonMin:15,
      enabled:true
    },
    ts:Date.now()
  });
}
