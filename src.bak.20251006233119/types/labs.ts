export type Mode = 'video' | 'image';
export type Gender = 'any' | 'female' | 'male' | 'neutral';

export interface Effects {
  beautify: boolean;
  ageShift: number | null;
  hairstyle: string | null;
  genderStyle: Gender;
  music: string | null;
  captions: boolean;
  translateTo: string | null;
  gestures: string[];
  avatarPreset: string | null;
}
export interface GenerateRequest { mode: Mode; sourceUrl?: string; prompt?: string; effects: Effects; }
export interface GenerateResponse { ok: true; jobId: string; previewUrl: string; }
export interface PublishRequest { postTitle: string; earnOnShare: boolean; effects: Effects; }
export interface PublishResponse { ok: true; postId: string; earned: number; effects: Effects; }

