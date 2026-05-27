export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      source:"google-trends",
      type:"spike-detection",
      status:"connected"
    },
    ts:Date.now()
  });
}
