/** The device's own profile. Lives in localStorage only; movies store a copy of it. */
export interface Profile {
  id: string;
  name: string;
  emoji: string;
}

export type ProfileInput = Omit<Profile, "id">;

export const NAME_MAX_LENGTH = 30;
export const EMOJI_MAX_LENGTH = 16;
