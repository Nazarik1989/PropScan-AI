import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import RiskAnalysisPreview from "@/components/RiskAnalysisPreview";
import TargetAudience from "@/components/TargetAudience";
import Pricing from "@/components/Pricing";
import FinalCTA from "@/components/FinalCTA";

const queryClient = new QueryClient();

function Home() {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-foreground overflow-x-hidden selection:bg-blue-500/30">
      <main className="w-full">
        <Hero />
        <Features />
        <HowItWorks />
        <RiskAnalysisPreview />
        <TargetAudience />
        <Pricing />
        <FinalCTA />
      </main>
    </div>
  );
}

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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
