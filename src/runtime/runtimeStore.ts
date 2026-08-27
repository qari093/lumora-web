import { prisma } from "@/src/db/client";
import { bumpRuntimeVersion } from "./realtimeVersion";

export async function pushSignal(signal: {
  type: "present" | "hold" | "rewatch";
  videoId: string;
  timestampMs: number;
}) {
  const created = await prisma.runtimeSignal.create({
    data: signal,
  });

  bumpRuntimeVersion();

  return created;
}

export async function getSignals() {
  return prisma.runtimeSignal.findMany({
    orderBy: { createdAt: "asc" },
  });
}

export async function clearSignals() {
  await prisma.runtimeSignal.deleteMany({});
  bumpRuntimeVersion();
}
