import { readStored, writeStored } from "../storage";
import type { Profile } from "./types";

const STORAGE_KEY = "gflist.profile";

export function parseProfile(raw: string | null): Profile | null {
  if (raw == null) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value == null) return null;
    const { id, name, emoji } = value as Record<string, unknown>;
    if (
      typeof id !== "string" ||
      typeof name !== "string" ||
      typeof emoji !== "string"
    ) {
      return null;
    }
    if (id === "" || name === "" || emoji === "") return null;
    return { id, name, emoji };
  } catch {
    return null;
  }
}

export function loadProfile(): Profile | null {
  return parseProfile(readStored(STORAGE_KEY));
}

export function saveProfile(profile: Profile): void {
  writeStored(STORAGE_KEY, JSON.stringify(profile));
}
