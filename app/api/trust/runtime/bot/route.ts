export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      runtime:"active",
      detector:"bot-pattern-runtime",
      actions:["flag","downrank","quarantine"],
      enabled:true
    },
    ts:Date.now()
  });
}
