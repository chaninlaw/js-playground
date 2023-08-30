import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    server: {
      port: 3000,
    },
    preview: {
      port: 8080,
    },
    plugins: [react()],
    base: "/",
  };

  if (command !== "serve") {
    config.base = "/js-playground/";
  }

  return config;
});