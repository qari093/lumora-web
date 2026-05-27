export async function GET(request: Request) {
  const url = new URL(request.url);
  const jobId = url.searchParams.get("jobId");

  if (!jobId) {
    return Response.json({ ok: false, error: "jobId_required" }, { status: 400 });
  }

  if (jobId === "vid_missing") {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  if (!jobId.startsWith("vid_")) {
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  return Response.json({
    ok: true,
    job: {
      jobId,
      status: "done",
      resultUrl: `/api/video-gen/result/${jobId}.mp4`,
    },
  }, { status: 200 });
}
