export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      fallbackProvider:"cached-signal-pack",
      activated:false,
      safeMode:true,
      enabled:true
    },
    ts:Date.now()
  });
}
