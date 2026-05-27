export async function pushRuntimeSignal(payload: unknown) {
  return fetch("/api/runtime/signals", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}


export async function pushClientSignal(payload: unknown) {
  return pushRuntimeSignal(payload);
}
