import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true, // This prevents Vite from trying the next available port
  },
  plugins: [react()],
});
