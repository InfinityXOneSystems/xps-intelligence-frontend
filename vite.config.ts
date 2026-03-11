import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // DO NOT REMOVE
    createIconImportProxy() as PluginOption,
    sparkPlugin() as PluginOption,
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  // Expose NEXT_PUBLIC_* vars (Supabase Vercel integration) to the browser bundle.
  // API_URL and WS_URL are injected via the `define` block below — no VITE_ prefix needed.
  envPrefix: ['NEXT_PUBLIC_'],

  // Inject API_URL and WS_URL at build time so the app reads them without a VITE_ prefix.
  // Vercel, Railway CI, and local .env.local set `API_URL` and `WS_URL` directly.
  define: {
    'import.meta.env.API_URL': JSON.stringify(
      process.env.API_URL || 'http://localhost:3000/api'
    ),
    'import.meta.env.WS_URL': JSON.stringify(
      process.env.WS_URL || 'ws://localhost:3000'
    ),
  },
});
