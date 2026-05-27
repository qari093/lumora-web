export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      store:"primary-signal-db",
      mode:"initialized",
      enabled:true
    },
    ts:Date.now()
  });
}
