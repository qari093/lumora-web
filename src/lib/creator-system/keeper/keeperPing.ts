export type KeeperPing = {
  circleId: string;
  keeperId: string;
  pingAtIso: string;
  secondsBeforeStart: 60;
  reason: "host_backup_ready_check";
};

export function buildKeeperPing(input: {
  circleId: string;
  keeperId: string;
  circleStartIso: string;
}): KeeperPing {
  const start = new Date(input.circleStartIso).getTime();
  const pingAtIso = new Date(start - 60_000).toISOString();

  return {
    circleId: input.circleId,
    keeperId: input.keeperId,
    pingAtIso,
    secondsBeforeStart: 60,
    reason: "host_backup_ready_check",
  };
}

export function shouldPingKeeper(nowIso: string, ping: KeeperPing): boolean {
  return new Date(nowIso).getTime() >= new Date(ping.pingAtIso).getTime();
}
