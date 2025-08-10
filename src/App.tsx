import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Import all pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Matches from "./pages/Matches";
import Classes from "./pages/Classes";
import ClassDetail from "./pages/ClassDetail";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import Placeholder from "./pages/Placeholder";

const queryClient = new QueryClient();

// Layout wrapper component
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Home page */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            
            {/* Core app pages */}
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/matches" element={<Layout><Matches /></Layout>} />
            <Route path="/wallet" element={<Layout><Wallet /></Layout>} />
            <Route path="/profile/:id?" element={<Layout><Profile /></Layout>} />
            
            {/* Session management */}
            <Route path="/sessions" element={<Layout><Placeholder title="Sessions" desc="Manage and book your 1:1 or group sessions here." /></Layout>} />
            <Route path="/booking" element={<Layout><Placeholder title="Book Session" desc="Schedule your learning session with an expert." /></Layout>} />
            <Route path="/session/:id" element={<Layout><Placeholder title="Session Room" desc="Join your live learning session." /></Layout>} />
            <Route path="/workspace/:id" element={<Layout><Placeholder title="Async Workspace" desc="Collaborate on projects and assignments." /></Layout>} />
            
            {/* Learning & discovery */}
            <Route path="/classes" element={<Layout><Classes /></Layout>} />
            <Route path="/classes/:id" element={<Layout><ClassDetail /></Layout>} />
            <Route path="/mentors" element={<Layout><Placeholder title="Mentor Marketplace" desc="Find long-term mentors with tiered credit rates." /></Layout>} />
            <Route path="/challenges" element={<Layout><Placeholder title="Challenges" desc="Join community challenges and climb leaderboards." /></Layout>} />
            <Route path="/map" element={<Layout><Placeholder title="Global Skill Map" desc="Explore trending skills by region. Coming soon!" /></Layout>} />
            
            {/* Community & giving */}
            <Route path="/donate" element={<Layout><Placeholder title="Donations & Crypto" desc="Donate credits or tip in crypto to programs you love." /></Layout>} />
            
            {/* Admin & settings */}
            <Route path="/admin" element={<Layout><Placeholder title="Admin Portal" desc="Moderation, analytics, and platform management." /></Layout>} />
            <Route path="/settings" element={<Layout><Placeholder title="Settings" desc="Manage preferences, verification, and notifications." /></Layout>} />
            
            {/* Onboarding */}
            <Route path="/onboarding" element={<Layout><Placeholder title="Onboarding" desc="Complete your profile and start skill swapping." /></Layout>} />
            
            {/* Support pages */}
            <Route path="/about" element={<Layout><Placeholder title="About SkillSwap" desc="Learn about our mission to democratize skill sharing." /></Layout>} />
            <Route path="/how-it-works" element={<Layout><Placeholder title="How It Works" desc="Discover how to trade skills, not cash." /></Layout>} />
            <Route path="/trust-safety" element={<Layout><Placeholder title="Trust & Safety" desc="Our commitment to a safe learning environment." /></Layout>} />
            <Route path="/careers" element={<Layout><Placeholder title="Careers" desc="Join our mission to transform education." /></Layout>} />
            <Route path="/help" element={<Layout><Placeholder title="Help Center" desc="Find answers to common questions." /></Layout>} />
            <Route path="/contact" element={<Layout><Placeholder title="Contact Us" desc="Get in touch with our support team." /></Layout>} />
            <Route path="/privacy" element={<Layout><Placeholder title="Privacy Policy" desc="How we protect and use your data." /></Layout>} />
            <Route path="/terms" element={<Layout><Placeholder title="Terms of Service" desc="Terms and conditions for using SkillSwap." /></Layout>} />
            
            {/* Messages */}
            <Route path="/messages" element={<Layout><Placeholder title="Messages" desc="Chat with your skill partners and mentors." /></Layout>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
