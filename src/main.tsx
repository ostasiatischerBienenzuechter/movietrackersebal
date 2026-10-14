import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "@fontsource-variable/inter";
import "./styles.css";

const root = document.getElementById("root");
if (root == null) throw new Error("Root element missing");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
