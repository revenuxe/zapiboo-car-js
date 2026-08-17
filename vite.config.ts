// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Amplify makes Hosting variables available while building, but Nitro's
  // deployed Compute runtime does not automatically receive arbitrary
  // variables. These are non-secret values and are only used by server code
  // as fallbacks. AWS credentials continue to come exclusively from the
  // Amplify Compute role at request time.
  vite: {
    define: {
      __HULUMART_S3_REGION__: JSON.stringify(process.env.S3_REGION ?? ""),
      __HULUMART_S3_BUCKET_NAME__: JSON.stringify(process.env.S3_BUCKET_NAME ?? ""),
      __HULUMART_SUPABASE_URL__: JSON.stringify(
        process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "",
      ),
      __HULUMART_SUPABASE_PUBLISHABLE_KEY__: JSON.stringify(
        process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "",
      ),
    },
  },
  nitro: {
    // Vercel remains the default deployment target. Amplify sets NITRO_PRESET
    // in amplify.yml, which makes Nitro emit Amplify's SSR deployment bundle.
    preset: process.env.NITRO_PRESET === "aws_amplify" ? "aws-amplify" : "vercel",
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
