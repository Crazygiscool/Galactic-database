import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
  logger: {
    log: (...args) => console.log("[TanStack]", ...args),
    warn: (...args) => console.warn("[TanStack]", ...args),
    error: (...args) => console.error("[TanStack]", ...args),
  },
});

// Log query cache events
queryClient.getQueryCache().subscribe((event) => {
  if (event.type === 'added') {
    console.log("[TanStack Cache] Query added:", event.query.queryKey);
  }
  if (event.type === 'updated') {
    const query = event.query;
    console.log(`[TanStack Cache] Query updated:`, query.queryKey, {
      status: query.state.status,
      dataUpdatedAt: query.state.dataUpdatedAt ? new Date(query.state.dataUpdatedAt).toISOString() : null,
      isFetching: query.state.isFetching,
    });
  }
  if (event.type === 'removed') {
    console.log("[TanStack Cache] Query removed:", event.query.queryKey);
  }
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
        <Analytics />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
