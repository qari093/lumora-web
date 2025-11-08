const sinks = new Set<WritableStreamDefaultWriter<string>>();

export function subscribe(): ReadableStream<string> {
  const stream = new TransformStream<string, string>();
  const writer = stream.writable.getWriter();
  sinks.add(writer);

  // Heartbeat to keep connections alive (every 20s)
  const iv = setInterval(() => {
    void writer.write(`: ping ${Date.now()}\n\n`);
  }, 20000);

  // Cleanup when the reader is closed
  (async () => {
    try {
      await stream.readable.cancel; // noop, but ensures type keeps both ends
    } catch {}
  })();

  // Return a stream that removes writer on cancel
  return new ReadableStream<string>({
    start(controller) {
      // initial comment
      controller.enqueue(`: connected ${Date.now()}\n\n`);
    },
    cancel() {
      clearInterval(iv);
      sinks.delete(writer);
      writer.releaseLock();
    },
  }, { highWaterMark: 1 }).pipeThrough(new TransformStream({
    start(controller) {
      // Bridge: mirror anything we write on writer into this controller
      // We actually push via writer directly in broadcast(); controller is used for headers only.
    }
  }));
}

export async function broadcast(data: any) {
  const msg = `data: ${JSON.stringify(data)}\n\n`;
  const dead: WritableStreamDefaultWriter<string>[] = [];
  for (const w of sinks) {
    try { await w.write(msg); } catch { dead.push(w); }
  }
  for (const w of dead) sinks.delete(w);
}
