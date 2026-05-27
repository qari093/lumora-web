export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      realtimeTracking:true,
      metric:"active-viewers",
      updateIntervalSec:5,
      enabled:true
    },
    ts:Date.now()
  });
}
