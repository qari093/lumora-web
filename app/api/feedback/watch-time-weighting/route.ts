export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      weighting:true,
      model:"normalized-watch-time",
      impact:["ranking","retention","personalization"],
      enabled:true
    },
    ts:Date.now()
  });
}
