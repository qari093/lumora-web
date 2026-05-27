export async function enqueueJob(name: string) {
  return {
    queued: true,
    job: name,
  };
}
