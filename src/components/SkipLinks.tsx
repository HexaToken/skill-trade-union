// Skip links component for keyboard navigation accessibility
import { cn } from '@/lib/utils';

interface SkipLink {
  href: string;
  label: string;
}

const defaultSkipLinks: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
  { href: '#footer', label: 'Skip to footer' }
];

interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

export function SkipLinks({ links = defaultSkipLinks, className }: SkipLinksProps) {
  return (
    <div className={cn('sr-only focus-within:not-sr-only', className)}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={cn(
            'absolute top-4 left-4 z-50',
            'bg-background text-foreground',
            'px-4 py-2 rounded-md shadow-lg border',
            'font-medium text-sm',
            'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
            'transition-all duration-200'
          )}
          onFocus={() => {
            // Announce skip link activation
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = `Skip link activated: ${link.label}`;
            document.body.appendChild(announcement);
            setTimeout(() => document.body.removeChild(announcement), 1000);
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

export default SkipLinks;
