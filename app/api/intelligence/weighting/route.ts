export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      weights:{source:0.3,velocity:0.25,trust:0.2,attention:0.25},
      mode:"adaptive",
      enabled:true
    },
    ts:Date.now()
  });
}
