export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      redactedContent:true,
      styles:["blurred","masked","teaser-cut"],
      revealMode:"countdown-or-action",
      enabled:true
    },
    ts:Date.now()
  });
}
