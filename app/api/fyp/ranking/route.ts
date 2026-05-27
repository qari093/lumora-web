export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      rankingConnected:true,
      source:"ranking-engine",
      enabled:true
    },
    ts:Date.now()
  });
}
