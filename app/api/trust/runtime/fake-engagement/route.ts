export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      filters:["duplicate-bursts","suspicious-velocity","farm-patterns"],
      status:"active",
      enabled:true
    },
    ts:Date.now()
  });
}
