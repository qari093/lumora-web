export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      source:"reddit",
      type:"trending",
      status:"connected"
    },
    ts:Date.now()
  });
}
