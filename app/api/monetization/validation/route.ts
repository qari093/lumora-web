export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      intrusive:false,
      adDensity:"zero",
      userExperience:"uninterrupted"
    },
    ts:Date.now()
  });
}
