export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      compliance:["gdpr","content-policy","regional-laws"],
      enforcement:"strict",
      enabled:true
    },
    ts:Date.now()
  });
}
