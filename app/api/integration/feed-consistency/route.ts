export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      duplicates:0,
      emptyFeed:false,
      ordering:"stable"
    },
    ts:Date.now()
  });
}
