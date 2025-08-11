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
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const { theme, setTheme } = useTheme();

  const footerSections = [
    {
      title: 'About',
      links: [
        { label: 'About SkillSwap', href: '/about' },
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Trust & Safety', href: '/trust-safety' },
        { label: 'Careers', href: '/careers' }
      ]
    },
    {
      title: 'Explore',
      links: [
        { label: 'Find Skills', href: '/matches' },
        { label: 'Join Challenges', href: '/challenges' },
        { label: 'Global Map', href: '/map' },
        { label: 'Mentor Marketplace', href: '/mentors' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' }
      ]
    },
    {
      title: 'Social',
      links: [
        { 
          label: 'LinkedIn', 
          href: 'https://linkedin.com/company/skillswap',
          icon: Linkedin,
          external: true 
        },
        { 
          label: 'X / Twitter', 
          href: 'https://twitter.com/skillswap',
          icon: Twitter,
          external: true 
        },
        { 
          label: 'Instagram', 
          href: 'https://instagram.com/skillswap',
          icon: Instagram,
          external: true 
        },
        { 
          label: 'Discord', 
          href: 'https://discord.gg/skillswap',
          icon: MessageCircle,
          external: true 
        }
      ]
    }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'pt', name: 'Português' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' }
  ];

  return (
    <footer className={cn('bg-gradient-to-b from-background to-background border-t border-border/50', className)}>
      {/* Glowing top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-brand-primary to-brand-secondary opacity-30" />
      
      <div className="page-container">
        {/* Upper section with columns */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="font-heading font-semibold text-foreground">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <li key={link.label}>
                        {link.external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-muted-foreground hover:text-brand-primary transition-colors focus-neo"
                          >
                            {Icon && <Icon className="w-4 h-4" />}
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            to={link.href}
                            className="flex items-center gap-2 text-muted-foreground hover:text-brand-primary transition-colors focus-neo"
                          >
                            {Icon && <Icon className="w-4 h-4" />}
                            {link.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Lower bar */}
        <div className="py-6 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© 2025 SkillSwap</span>
              <span className="hidden md:inline">•</span>
              <span>Trade skills, not cash.</span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Language selector */}
              <Select defaultValue="en">
                <SelectTrigger className="w-32 h-9 glass-card border-0">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="glass-card">
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Theme toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9">
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card">
                  <DropdownMenuItem onClick={() => setTheme('light')}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')}>
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Additional info for mobile */}
          <div className="mt-4 md:hidden text-xs text-muted-foreground text-center">
            <p>Building the future of skill sharing, one exchange at a time.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
