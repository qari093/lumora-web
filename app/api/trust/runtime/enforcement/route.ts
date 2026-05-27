export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      enforcement:"active",
      thresholds:{block:0.2,downrank:0.4},
      actions:["block","downrank","allow"],
      enabled:true
    },
    ts:Date.now()
  });
}
