export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      languageVariation:true,
      supported:["en","de","ur","hi"],
      fallback:"auto-detect",
      enabled:true
    },
    ts:Date.now()
  });
}
