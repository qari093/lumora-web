export function livePresenceHealthy() {
  return {
    voiceChannels: true,
    proximityPresence: true,
    emotionalSync: true,
    silenceSafe: true,
  };
}
