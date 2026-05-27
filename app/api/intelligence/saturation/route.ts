export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      saturationIndex:0.41,
      buckets:["low","medium","high"],
      enabled:true
    },
    ts:Date.now()
  });
}
