export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      sync:true,
      timezone:"UTC",
      ordering:"normalized",
      enabled:true
    },
    ts:Date.now()
  });
}
