export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      regionalVariation:true,
      dimensions:["country","city","locale"],
      strategy:"geo-weighted-feed",
      enabled:true
    },
    ts:Date.now()
  });
}
