export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      takedownLogic:true,
      reasons:["toxicity","scam","misinformation","policy-breach"],
      enabled:true
    },
    ts:Date.now()
  });
}
