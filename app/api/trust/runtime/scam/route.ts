export const dynamic="force-dynamic";
export async function GET(){
  return Response.json({
    ok:true,
    data:{
      scamDetection:"active",
      patterns:["phishing","bait-links","fraud-phrases"],
      action:"quarantine",
      enabled:true
    },
    ts:Date.now()
  });
}
