import { Link } from 'react-router-dom';
import { 
  Linkedin, 
  Twitter, 
  Instagram, 
  MessageCircle,
  Globe,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const toggleTheme = () => {
    const currentTheme = document.documentElement.dataset.theme;
    document.documentElement.dataset.theme = currentTheme === 'dark' ? 'light' : 'dark';
  };

  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    if (theme === 'system') {
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.dataset.theme = systemPreference;
    } else {
      document.documentElement.dataset.theme = theme;
    }
  };

  const getCurrentTheme = () => {
    return document.documentElement.dataset.theme || 'light';
  };

  return (
    <footer className={cn('mt-16 bg-surface border-t border-border', className)}>
      <div className="h-[2px] w-full bg-brand-gradient"></div>
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-6 rounded-md bg-brand-gradient"></div>
            <span className="text-inkHead font-semibold">SkillSwap</span>
          </div>
          <p className="text-inkBody/80 text-sm">
            A global "talent-for-talent" exchange powered by AI matching and credits.
          </p>
        </div>
        <div>
          <h4 className="text-inkHead font-medium mb-3">Product</h4>
          <ul className="space-y-2 text-inkBody">
            <li><Link to="/search" className="hover:text-inkHead">Search & Match</Link></li>
            <li><Link to="/mentors" className="hover:text-inkHead">Mentors</Link></li>
            <li><Link to="/classes" className="hover:text-inkHead">Classes</Link></li>
            <li><Link to="/map" className="hover:text-inkHead">Map</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-inkHead font-medium mb-3">Community</h4>
          <ul className="space-y-2 text-inkBody">
            <li><Link to="/skill-sprints" className="hover:text-inkHead">Skill Sprints</Link></li>
            <li><Link to="/donate" className="hover:text-inkHead">Donate</Link></li>
            <li><Link to="/forums" className="hover:text-inkHead">Forums</Link></li>
            <li><Link to="/events" className="hover:text-inkHead">Events</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-inkHead font-medium mb-3">Company</h4>
          <ul className="space-y-2 text-inkBody">
            <li><Link to="/about" className="hover:text-inkHead">About</Link></li>
            <li><Link to="/careers" className="hover:text-inkHead">Careers</Link></li>
            <li><Link to="/privacy" className="hover:text-inkHead">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-inkHead">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-inkBody/70 text-sm">
            © <span id="y">{new Date().getFullYear()}</span> SkillSwap. All rights reserved.
          </p>
          <div className="flex gap-4 text-inkBody/80">
            <a href="#" aria-label="Twitter" className="hover:text-inkHead">𝕏</a>
            <a href="#" aria-label="LinkedIn" className="hover:text-inkHead">in</a>
            <a href="#" aria-label="Instagram" className="hover:text-inkHead">IG</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
