export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      coldStartPersonalization:true,
      seeds:["region","language","safe-trending"],
      confidence:"low-until-behavior",
      enabled:true
    },
    ts:Date.now()
  });
}
