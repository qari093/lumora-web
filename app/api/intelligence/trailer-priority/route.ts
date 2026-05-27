export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      trailerPriorityScore:0.91,
      overrideEligible:true,
      enabled:true
    },
    ts:Date.now()
  });
}
