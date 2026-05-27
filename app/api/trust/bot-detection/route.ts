export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      botDetected:false,
      patterns:["rapid-fire","duplicate-signals","anomaly"],
      enabled:true
    },
    ts:Date.now()
  });
}
