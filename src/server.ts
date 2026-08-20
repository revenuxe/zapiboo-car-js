import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

const CANONICAL_HOST = "www.hulumart.com";
const LEGACY_APEX_HOST = "hulumart.com";

function isRouteTemplateUrl(url: URL) {
  try {
    // A literal route token can be discovered when an old template or an
    // external crawler links to a file-route pattern (for example
    // /sell/$category). It is not a real public page and must never be served
    // as the generic dynamic route.
    return /^\/sell\/(?:\$|%24)(?:category|brand|series|model)(?:\/|$)/i.test(url.pathname);
  } catch {
    return false;
  }
}

function canonicalRedirect(request: Request) {
  const url = new URL(request.url);

  // Keep one HTTPS hostname for every document. Amplify should also have this
  // redirect configured at the domain level so static assets are covered, but
  // enforcing it here prevents duplicate SSR documents if that setting changes.
  if (url.hostname.toLowerCase() === LEGACY_APEX_HOST) {
    url.hostname = CANONICAL_HOST;
    return Response.redirect(url, 308);
  }

  return null;
}

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const redirect = canonicalRedirect(request);
      if (redirect) return redirect;

      const url = new URL(request.url);
      if (isRouteTemplateUrl(url)) {
        return new Response("Not found", {
          status: 404,
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
