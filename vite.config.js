import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Fix för ESM-miljö (Node 18+)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],

  // 👇 Lägg till denna rad så Vite vet var public-mappen är
  publicDir: path.resolve(__dirname, "public"),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  server: {
    port: 5173,
    proxy: {
      "/customers": "http://localhost:4000",
      "/invoices": "http://localhost:4000",
      "/upload-invoice": "http://localhost:4000",
      "/callback": "http://localhost:4000",
      "/integrations": "http://localhost:4000",
    },
  },
});
