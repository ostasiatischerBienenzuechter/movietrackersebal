import { useCallback, useState } from "react";
import { applyTheme, loadTheme, saveTheme, type Theme } from "./theme";

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(loadTheme);

  const toggle = useCallback(() => {
    const next: Theme = theme === "day" ? "night" : "day";
    saveTheme(next);
    applyTheme(next);
    setTheme(next);
  }, [theme]);

  return [theme, toggle];
}
