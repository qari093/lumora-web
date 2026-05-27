export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      required:["analytics","personalization","notifications"],
      defaultState:"opt-in-required",
      enabled:true
    },
    ts:Date.now()
  });
}
