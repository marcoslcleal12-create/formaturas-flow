// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    define: {
      'process.env.SUPABASE_URL': JSON.stringify("https://ozexujmqfniaecwwdmet.supabase.co"),
      'process.env.SUPABASE_PUBLISHABLE_KEY': JSON.stringify("sb_publishable_T8e-A2_8Dfk52BH4FpGRbw_ajmsNgND"),
      'process.env.SUPABASE_SERVICE_ROLE_KEY': JSON.stringify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZXh1am1xZm5pYWVjd3dkbWV0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzA5NDQ4NywiZXhwIjoyMTAyNjcwNDg3fQ.7HFYf188JHuI9vjHNZLTmkOD11OanrreXnfpucMP3nI"),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify("https://ozexujmqfniaecwwdmet.supabase.co"),
      'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify("sb_publishable_T8e-A2_8Dfk52BH4FpGRbw_ajmsNgND"),
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: "vercel",
    externals: {
      inline: [
        "@tanstack/react-start",
        "@tanstack/react-router",
        "@tanstack/router-core",
        "@tanstack/router-utils",
        "@tanstack/start-server-core",
        "@tanstack/start-client-core",
        "@tanstack/start-plugin-core"
      ]
    }
  },
});
