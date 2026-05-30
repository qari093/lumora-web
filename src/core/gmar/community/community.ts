export function offlineMode() {
  return { supported: true, queueSafe: true };
}

export function antiCheat(score: number) {
  const numeric = Number(score);
  return {
    suspicious: numeric >= 90,
    score: numeric,
    action: numeric >= 90 ? "review" : "allow"
  };
}

export function botDetection(score: number = 10) {
  return {
    botLike: Number(score) >= 90,
    score: Number(score)
  };
}

export function createSquad(name: string = "Origin Squad") {
  return {
    squadId: "gmar_squad_001",
    name,
    members: ["gmar_user_001"]
  };
}

export function joinLiveRoom(roomId: string = "gmar_live_room_001") {
  return {
    roomId,
    joined: true,
    playerId: "gmar_user_001"
  };
}
