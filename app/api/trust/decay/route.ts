export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      decaySystem:true,
      decayWindowDays:30,
      recoveryModel:"gradual",
      enabled:true
    },
    ts:Date.now()
  });
}
