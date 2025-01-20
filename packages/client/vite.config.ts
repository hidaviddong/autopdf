import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [TanStackRouterVite({}), react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server:
      mode === "development"
        ? {
            proxy: {
              "/api": {
                target: env.VITE_API_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
              },
            },
          }
        : {},
    build: {
      outDir: "../../public",
    },
  };
});
