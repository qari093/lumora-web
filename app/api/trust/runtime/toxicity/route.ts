export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      toxicityDetection:"active",
      levels:["low","medium","high"],
      action:"flag-or-block",
      enabled:true
    },
    ts:Date.now()
  });
}
