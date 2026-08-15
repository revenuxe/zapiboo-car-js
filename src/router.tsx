import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultPreloadDelay: 30,
  });

  // Ships loader-fetched query data with the SSR HTML so the client hydrates
  // with the same state (no loading-skeleton hydration mismatch).
  setupRouterSsrQueryIntegration({ router, queryClient });

  return router;
};
