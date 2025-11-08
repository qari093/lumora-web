import { NextResponse } from "next/server";
export async function GET() {
  const feed = [
    { id: "v1", url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",  title: "Clip 1" },
    { id: "v2", url: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4", title: "Clip 2" },
    { id: "v3", url: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4", title: "Clip 3" }
  ];
  return NextResponse.json(feed);
}
