export function allowEchoSilentOvationOnly(action: string) {
  return {
    ok: action === "silent-ovation",
    reason: action === "silent-ovation" ? "allowed" : "echo_action_blocked",
  };
}
