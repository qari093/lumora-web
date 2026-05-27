export type PresencePrefs = {
  visual: boolean;
  audio: boolean;
};

export const defaultPresencePrefs: PresencePrefs = {
  visual: true,
  audio: false,
};
