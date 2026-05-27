export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      gateway:"optimized",
      features:["routing","rate-limit","auth-pass"],
      latencyMs:80,
      enabled:true
    },
    ts:Date.now()
  });
}
