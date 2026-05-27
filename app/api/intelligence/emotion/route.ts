export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      emotions:["excitement","fear","joy","curiosity"],
      classification:"active",
      enabled:true
    },
    ts:Date.now()
  });
}
