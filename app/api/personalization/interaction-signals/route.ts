export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      signals:["watch-time","replay","skip","scroll-depth","tap"],
      capture:"active",
      enabled:true
    },
    ts:Date.now()
  });
}
