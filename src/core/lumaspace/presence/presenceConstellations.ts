export const PresenceConstellations = Object.freeze({
  doctrine: "Presence is ambient art, not notification noise.",
  people: [
    { id: "ayesha", world: "wonder", aura: "cyan", active: true },
    { id: "sara", world: "dream", aura: "gold", active: true },
    { id: "hamza", world: "creator", aura: "blue", active: true },
    { id: "zayan", world: "gaming", aura: "neon", active: true },
    { id: "rayan", world: "shadow", aura: "violet", active: true },
    { id: "yusra", world: "calm", aura: "water", active: true }
  ],
  visualRules: {
    showAsStars: true,
    useTraceLines: true,
    pulseSeconds: 6,
    maxLabelOpacity: 0.72,
    notificationStyle: false
  }
});

export function validatePresenceConstellations() {
  return (
    PresenceConstellations.people.length === 6 &&
    PresenceConstellations.visualRules.showAsStars === true &&
    PresenceConstellations.visualRules.useTraceLines === true &&
    PresenceConstellations.visualRules.notificationStyle === false &&
    PresenceConstellations.visualRules.pulseSeconds === 6
  );
}
