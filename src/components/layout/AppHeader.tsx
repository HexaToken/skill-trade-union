import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, MessageCircle, Plus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

export const AppHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center gap-3">
        <SidebarTrigger className="mr-1" />
        <Link to="/" className="flex items-center font-semibold text-lg tracking-tight">
          <span className="bg-gradient-brand bg-clip-text text-transparent">SkillSwap</span>
        </Link>
        <Badge variant="secondary" className="ml-1">Trade skills, not cash</Badge>
        <div className="ml-4 hidden flex-1 items-center gap-2 md:flex">
          <Input placeholder="Search skills, people, classes..." className="max-w-xl" aria-label="Search" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" className="hover-scale" asChild>
            <Link to="/create"><Plus className="mr-1 h-4 w-4" /> Create</Link>
          </Button>
          <Button variant="ghost" asChild aria-label="Wallet" className="hover-scale">
            <Link to="/wallet"><Wallet className="h-5 w-5" /></Link>
          </Button>
          <Button variant="ghost" asChild aria-label="Messages" className="hover-scale">
            <Link to="/messages"><MessageCircle className="h-5 w-5" /></Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
