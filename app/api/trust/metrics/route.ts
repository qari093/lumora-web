export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      metrics:["flags","takedowns","appeals","false-positives"],
      tracking:"active",
      enabled:true
    },
    ts:Date.now()
  });
}
