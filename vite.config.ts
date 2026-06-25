import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// No backend, no proxy — the app reads static files from /public/demo-data.
export default defineConfig({
  plugins: [react()],
});
