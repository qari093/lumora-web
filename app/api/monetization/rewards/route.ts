export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      rewardsEnabled:false,
      placeholders:["pulse","zencoin","badges"],
      activation:"post-launch"
    },
    ts:Date.now()
  });
}
