import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app/App";
import { applyTheme, loadTheme } from "@/features/theme";
import "@fontsource-variable/quicksand";
import "@/styles/global.css";

applyTheme(loadTheme());

const root = document.getElementById("root");
if (root == null) throw new Error("Root element missing");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
