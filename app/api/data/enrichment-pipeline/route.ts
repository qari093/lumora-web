export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      enrichment:true,
      fields:["emotion","culture","trust","attention"],
      enabled:true
    },
    ts:Date.now()
  });
}
