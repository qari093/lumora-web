export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      exclusivity:true,
      tiers:["preview","early-window","limited-visibility"],
      policy:"scarce-surface",
      enabled:true
    },
    ts:Date.now()
  });
}
