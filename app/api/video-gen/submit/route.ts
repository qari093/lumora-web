type VideoJob = {
  jobId: string;
  status: "done";
  resultUrl: string;
};

const g = globalThis as typeof globalThis & {
  __lumoraVideoGenJobs?: Map<string, VideoJob>;
};

function store() {
  if (!g.__lumoraVideoGenJobs) g.__lumoraVideoGenJobs = new Map<string, VideoJob>();
  return g.__lumoraVideoGenJobs;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";

  if (!prompt) {
    return Response.json({ ok: false, error: "prompt_required" }, { status: 400 });
  }

  const jobId = `vid_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const job: VideoJob = {
    jobId,
    status: "done",
    resultUrl: `/api/video-gen/result/${jobId}.mp4`,
  };

  store().set(jobId, job);

  return Response.json({ ok: true, jobId, job }, { status: 200 });
}
