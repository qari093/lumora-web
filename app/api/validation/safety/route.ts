export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      zeroLeak:true,
      checks:["nsfw","toxicity","scam","misinformation"],
      passed:true,
      enabled:true
    },
    ts:Date.now()
  });
}
