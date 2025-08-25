import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Check if we're in Replit environment
const isReplit = process.env.REPL_ID !== undefined;

export default defineConfig(async () => {
  const plugins = [react()];

  // Only load Replit plugins in Replit environment
  if (isReplit) {
    try {
      const runtimeErrorOverlay = await import("@replit/vite-plugin-runtime-error-modal");
      plugins.push(runtimeErrorOverlay.default());
    } catch (e) {
      console.log('[VITE] Replit runtime error overlay not available');
    }

    if (process.env.NODE_ENV !== "production") {
      try {
        const cartographer = await import("@replit/vite-plugin-cartographer");
        plugins.push(cartographer.cartographer());
      } catch (e) {
        console.log('[VITE] Replit cartographer not available');
      }
    }
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});