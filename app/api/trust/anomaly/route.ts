export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      anomaly:false,
      triggers:["velocity-spike","pattern-break"],
      enabled:true
    },
    ts:Date.now()
  });
}
