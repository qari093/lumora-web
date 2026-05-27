export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      protections:["rate-limit","pattern-block","challenge-gate"],
      severity:"active",
      enabled:true
    },
    ts:Date.now()
  });
}
