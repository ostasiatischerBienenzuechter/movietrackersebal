import { readStored, writeStored } from "../storage";

export type Theme = "day" | "night";

const STORAGE_KEY = "gflist.theme";

/** Matches `--bg` of each theme so the browser UI blends in. */
const THEME_COLORS: Record<Theme, string> = {
  day: "#ffffff",
  night: "#1b2021",
};

export function parseTheme(raw: string | null): Theme | null {
  return raw === "day" || raw === "night" ? raw : null;
}

/** A saved choice wins; otherwise the system setting decides. */
export function loadTheme(): Theme {
  const stored = parseTheme(readStored(STORAGE_KEY));
  if (stored != null) return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "day"
    : "night";
}

export function saveTheme(theme: Theme): void {
  writeStored(STORAGE_KEY, theme);
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset["theme"] = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);
}
