import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if we're in Replit environment
const isReplit = process.env.REPL_ID !== undefined;

// Build plugins array conditionally
const plugins = [react()];

// Only add Replit plugins if in Replit environment
if (isReplit) {
  try {
    // This will only work in Replit, gracefully skip in local development
    const runtimeErrorOverlay = require("@replit/vite-plugin-runtime-error-modal");
    plugins.push(runtimeErrorOverlay.default());
  } catch (e) {
    console.log('[VITE] Replit runtime error overlay not available (local development)');
  }
}

export default defineConfig({
  plugins: [
    ...plugins,
    ...(process.env.NODE_ENV !== "production" &&
    isReplit
      ? [
          // Conditionally load cartographer only in Replit
          (() => {
            try {
              const cartographer = require("@replit/vite-plugin-cartographer");
              return cartographer.cartographer();
            } catch (e) {
              console.log('[VITE] Replit cartographer not available (local development)');
              return null;
            }
          })()
        ].filter(Boolean)
      : []),
  ],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
      "react": path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});