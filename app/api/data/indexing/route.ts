export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      indexes:["source","timestamp","trendScore","trustScore"],
      strategy:"multi-key",
      enabled:true
    },
    ts:Date.now()
  });
}
