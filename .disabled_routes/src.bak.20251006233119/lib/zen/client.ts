export async function startSession(){ return { sessionId: "stub-"+Date.now() }; }
export async function finalizeSession(){ return { ok: true }; }
export async function getBalance(){ return { balance: 0 }; }
