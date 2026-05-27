export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      source:"x",
      type:"stream",
      status:"connected"
    },
    ts:Date.now()
  });
}
