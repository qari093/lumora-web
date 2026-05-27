export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      tags:["region","language","trend-type"],
      tagging:"active",
      enabled:true
    },
    ts:Date.now()
  });
}
