import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// If your backend runs on a different port during development,
// point the proxy target at it (or set VITE_API_BASE_URL directly).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
