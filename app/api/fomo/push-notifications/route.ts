export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      pushNotifications:true,
      channels:["web-push","in-app"],
      triggers:["countdown","replay","event-start"],
      enabled:true
    },
    ts:Date.now()
  });
}
