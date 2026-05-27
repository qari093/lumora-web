export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      hot:"recent-signals",
      cold:"archive-signals",
      migration:"automatic",
      enabled:true
    },
    ts:Date.now()
  });
}
