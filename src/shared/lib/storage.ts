/** localStorage access that degrades to "nothing stored" when storage is unavailable (e.g. private mode). */
export function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStored(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Keep the value in memory only.
  }
}
