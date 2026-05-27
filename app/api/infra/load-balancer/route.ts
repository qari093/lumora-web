export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      loadBalancer:true,
      strategy:"round-robin",
      healthChecks:true,
      enabled:true
    },
    ts:Date.now()
  });
}
