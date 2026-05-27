export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      limitPerMin:60,
      burst:10,
      enabled:true
    },
    ts:Date.now()
  });
}
