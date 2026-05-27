export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      source:"rss",
      feeds:["news","entertainment","tech"],
      status:"connected"
    },
    ts:Date.now()
  });
}
