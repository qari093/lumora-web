import { prisma } from "@/src/db/client";

export async function clearRuntimeSignals() {
  await prisma.runtimeSignal.deleteMany({});
}
