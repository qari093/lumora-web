export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      boosting:true,
      classes:["trailer-event","breaking-spike","trusted-surge"],
      enabled:true
    },
    ts:Date.now()
  });
}
