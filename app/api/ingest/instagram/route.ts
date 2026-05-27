export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      source:"instagram",
      type:"metadata-only",
      status:"connected"
    },
    ts:Date.now()
  });
}
