import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/portfolio/", // ← remplace "portfolio" par le nom exact de ton repo GitHub
});
