import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Matches from "./pages/Matches";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import Placeholder from "./pages/Placeholder";
import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/sessions" element={<Placeholder title="Sessions" desc="Manage and book your 1:1 or group sessions here." />} />
            <Route path="/map" element={<Placeholder title="Global Skill Map" desc="Explore trending skills by region. Coming soon!" />} />
            <Route path="/challenges" element={<Placeholder title="Challenges" desc="Join community challenges and climb leaderboards." />} />
            <Route path="/mentor" element={<Placeholder title="Mentor Marketplace" desc="Find long‑term mentors with tiered credit rates." />} />
            <Route path="/donate" element={<Placeholder title="Donations & Crypto" desc="Donate credits or tip in crypto to programs you love." />} />
            <Route path="/settings" element={<Placeholder title="Settings" desc="Manage preferences, verification, and notifications." />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
