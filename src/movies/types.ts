import type { Profile } from "../profile/types";

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

export const TITLE_MAX_LENGTH = 200;
