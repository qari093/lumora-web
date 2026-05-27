export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      cineverseHooks:true,
      features:["timeline","reaction-echo","spoiler-firewall"],
      enabled:true
    },
    ts:Date.now()
  });
}
