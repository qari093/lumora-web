export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      personalization:true,
      signals:["watch-time","replay","skip"],
      enabled:true
    },
    ts:Date.now()
  });
}
