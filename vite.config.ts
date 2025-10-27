import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: API_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
