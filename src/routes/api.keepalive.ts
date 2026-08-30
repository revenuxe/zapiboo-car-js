import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/api/keepalive")({
  server: {
    handlers: {
      GET: async () => {
        const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const SUPABASE_PUBLISHABLE_KEY =
          process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

        if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
          return Response.json(
            { ok: false, error: "Missing Supabase environment variables." },
            { status: 500, headers: { "Cache-Control": "no-store" } },
          );
        }

        const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          auth: {
            storage: undefined,
            persistSession: false,
            autoRefreshToken: false,
          },
        });

        const { error, count } = await supabase
          .from("scrap_rates")
          .select("id", { count: "exact", head: true });

        if (error) {
          return Response.json(
            { ok: false, error: error.message },
            { status: 500, headers: { "Cache-Control": "no-store" } },
          );
        }

        return Response.json(
          { ok: true, checkedAt: new Date().toISOString(), ratesCount: count ?? 0 },
          { headers: { "Cache-Control": "no-store" } },
        );
      },
    },
  },
});
