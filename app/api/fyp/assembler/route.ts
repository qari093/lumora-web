export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      assembler:"active",
      inputs:["ranked-signals","user-context"],
      enabled:true
    },
    ts:Date.now()
  });
}
