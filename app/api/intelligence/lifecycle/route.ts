export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      stages:["rise","peak","decay"],
      detection:"active",
      enabled:true
    },
    ts:Date.now()
  });
}
