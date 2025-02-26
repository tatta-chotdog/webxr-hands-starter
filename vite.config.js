import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  server: {
    host: true,
    https: true,
    port: 8081,
  },
  build: {
    outDir: "dist",
  },
  plugins: [
    basicSsl({
      name: "webxr-hands-starter",
    }),
  ],
});
