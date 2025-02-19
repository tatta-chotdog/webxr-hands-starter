import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  server: {
    host: "???.???.?.?",
    port: 8081,
    https: true,
    open: true,
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
