export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      notifications:true,
      channels:["push","reminder","countdown"],
      deliveryState:"valid",
      passed:true,
      enabled:true
    },
    ts:Date.now()
  });
}
