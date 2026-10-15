import type { Profile } from "@/features/profile";

export interface Movie {
  id: string;
  title: string;
  posterUrl: string | null;
  /** Copy of the adding device's profile at the time it was added (or last edited). */
  addedBy: Profile;
  /** Milliseconds since epoch. */
  createdAt: number;
  /** Milliseconds since epoch, or null while on the watchlist. */
  watchedAt: number | null;
}

export type MovieView = "watchlist" | "watched";

/** What the title form submits. */
export interface TitleInput {
  title: string;
  /** Poster of the movie picked from the suggestions; undefined means "look it up". */
  posterUrl?: string;
}

export const TITLE_MAX_LENGTH = 200;
