export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      metrics:["views","clicks","watchTime","replays"],
      tracking:"enabled-passive",
      enabled:true
    },
    ts:Date.now()
  });
}
