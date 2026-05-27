export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      fallbackInjection:true,
      sources:["trusted-cache","verified-content"],
      trigger:"unsafe-content-detected",
      enabled:true
    },
    ts:Date.now()
  });
}
