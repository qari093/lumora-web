export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      preferenceDecay:true,
      decayWindowDays:21,
      model:"gradual-weight-drop",
      enabled:true
    },
    ts:Date.now()
  });
}
