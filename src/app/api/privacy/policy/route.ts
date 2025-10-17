import { NextResponse } from "next/server";
export const runtime = "edge";
export async function GET(){
  const policy = {
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    principles: ["Your feelings are yours","Encryption at rest for exports","User-controlled consent","Deletability"],
    dataCategories: ["Emotion inferences (optional)","Engagement signals","Creator economy events"],
    storage: { encryptedExports: true, keyEnv: !!process.env.EMOTION_DATA_KEY },
    contact: "privacy@lumora.app"
  };
  return NextResponse.json({ ok:true, policy });
}
