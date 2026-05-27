export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      learningRateControl:true,
      mode:"adaptive",
      bounds:{min:0.05,max:0.3},
      enabled:true
    },
    ts:Date.now()
  });
}
