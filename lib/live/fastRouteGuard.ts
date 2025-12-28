export async function withHardTimeout<T>(ms: number, fn: () => Promise<T>): Promise<T> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  try {
    return await Promise.race([
      fn(),
      new Promise<T>((_, rej) => {
        ac.signal.addEventListener("abort", () => rej(new Error(`hard-timeout ${ms}ms`)), { once: true });
      }),
    ]);
  } finally {
    clearTimeout(t);
  }
}
