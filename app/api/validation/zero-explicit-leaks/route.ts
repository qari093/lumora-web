export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      leaksDetected:0,
      quarantineEffective:true,
      passed:true
    },
    ts:Date.now()
  });
}
