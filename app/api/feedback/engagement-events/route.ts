export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      capture:true,
      events:["view","watch-time","replay","skip","share","tap"],
      mode:"live",
      enabled:true
    },
    ts:Date.now()
  });
}
