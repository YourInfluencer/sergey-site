import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "serve" ? "/" : "/sergey-site/",
  server: {
    host: true,          // или "0.0.0.0"
    port: 5173,
    strictPort: true,
    allowedHosts: true,  // ✅ разрешить любые хосты (включая ngrok)
  },
}));