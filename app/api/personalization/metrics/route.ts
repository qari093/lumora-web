export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      metrics:["match-rate","replay-lift","skip-reduction","exploration-hit-rate"],
      tracking:"active",
      enabled:true
    },
    ts:Date.now()
  });
}
