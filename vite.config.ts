import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // Relative base so the build works under https://<user>.github.io/<repo>/
  base: "./",
  plugins: [react()],
  resolve: { tsconfigPaths: true },
});
