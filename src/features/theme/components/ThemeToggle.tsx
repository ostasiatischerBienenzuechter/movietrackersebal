import DarkModeRounded from "@mui/icons-material/DarkModeRounded";
import LightModeRounded from "@mui/icons-material/LightModeRounded";
import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
  const [theme, toggle] = useTheme();
  const label = theme === "day" ? "Night Mode" : "Day Mode";

  return (
    <button
      type="button"
      className="icon"
      aria-label={label}
      title={label}
      onClick={toggle}
    >
      {theme === "day" ? <DarkModeRounded /> : <LightModeRounded />}
    </button>
  );
}
