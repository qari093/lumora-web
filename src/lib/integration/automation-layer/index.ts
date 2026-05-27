export function autoBalanceCircleDensity(input: { attendees: number; min?: number; max?: number }) {
  const min = input.min ?? 3;
  const max = input.max ?? 12;
  return {
    ok: input.attendees >= min && input.attendees <= max,
    action: input.attendees < min ? "merge" : input.attendees > max ? "split" : "hold",
  };
}

export function autoAssignHost(input: { hostIds: string[]; lastHostId?: string }) {
  const next = input.hostIds.find(id => id !== input.lastHostId) || input.hostIds[0] || null;
  return { hostId: next, assigned: Boolean(next) };
}

export function autoCleanInactiveUsers(input: { users: { id: string; active: boolean }[] }) {
  return input.users.filter(user => user.active);
}

export function autoTriggerReEngagement(input: { daysInactive: number }) {
  return {
    trigger: input.daysInactive >= 14,
    message: input.daysInactive >= 14 ? "Return when it feels right." : "",
  };
}

export function validateAutomationSafety(input: {
  density?: { ok: boolean };
  host?: { assigned: boolean };
  cleanedUsers?: unknown[];
  reengagement?: { trigger: boolean };
}) {
  return {
    ok:
      typeof input.density?.ok === "boolean" &&
      input.host?.assigned === true &&
      Array.isArray(input.cleanedUsers) &&
      typeof input.reengagement?.trigger === "boolean",
  };
}
