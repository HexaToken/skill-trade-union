import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toggleTheme } from '@/utils/themeUtils';

export function ColorSystemDemo() {
  return (
    <div className="page-container py-8">
      <h1 className="text-ink-head mb-8">SkillSwap Color System Demo</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Primary Colors */}
        <Card className="card-surface">
          <CardHeader>
            <CardTitle className="text-ink-head">Primary Colors</CardTitle>
            <CardDescription className="text-ink-body">Main brand colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="h-12 bg-primary rounded-lg flex items-center justify-center text-white font-medium">
                Primary
              </div>
              <div className="h-12 bg-primary600 rounded-lg flex items-center justify-center text-white font-medium">
                Primary 600
              </div>
              <div className="h-12 bg-secondary rounded-lg flex items-center justify-center text-white font-medium">
                Secondary
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Surface Colors */}
        <Card className="card-surface">
          <CardHeader>
            <CardTitle className="text-ink-head">Surface Colors</CardTitle>
            <CardDescription className="text-ink-body">Background and surface colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="h-12 bg-canvas border border-border rounded-lg flex items-center justify-center text-ink-head font-medium">
                Canvas
              </div>
              <div className="h-12 bg-surface border border-border rounded-lg flex items-center justify-center text-ink-head font-medium">
                Surface
              </div>
              <div className="h-12 bg-elevated border border-border rounded-lg flex items-center justify-center text-ink-head font-medium">
                Elevated
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Text Colors */}
        <Card className="card-surface">
          <CardHeader>
            <CardTitle className="text-ink-head">Text Colors</CardTitle>
            <CardDescription className="text-ink-body">Typography color hierarchy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-ink-head font-semibold">Ink Head - Headings</div>
              <div className="text-ink-body">Ink Body - Regular text</div>
              <div className="text-primary">Primary - Links & accents</div>
              <div className="text-secondary">Secondary - Highlights</div>
            </div>
          </CardContent>
        </Card>

        {/* Status Colors */}
        <Card className="card-surface">
          <CardHeader>
            <CardTitle className="text-ink-head">Status Colors</CardTitle>
            <CardDescription className="text-ink-body">Semantic colors for UI states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Badge className="bg-success text-white">Success</Badge>
              <Badge className="bg-warning text-white">Warning</Badge>
              <Badge className="bg-danger text-white">Danger</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card className="card-surface">
          <CardHeader>
            <CardTitle className="text-ink-head">Buttons</CardTitle>
            <CardDescription className="text-ink-body">Button styles with new colors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button className="btn-primary w-full">Primary Button</Button>
              <Button variant="outline" className="w-full">Outline Button</Button>
              <Button variant="ghost" className="w-full">Ghost Button</Button>
            </div>
          </CardContent>
        </Card>

        {/* Gradient */}
        <Card className="card-surface">
          <CardHeader>
            <CardTitle className="text-ink-head">Brand Gradient</CardTitle>
            <CardDescription className="text-ink-body">The signature SkillSwap gradient</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-24 bg-brand-gradient rounded-lg flex items-center justify-center text-white font-bold text-lg">
              Brand Gradient
            </div>
            <div className="h-6 w-6 rounded-md bg-brand-gradient mx-auto"></div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="card-surface">
          <CardHeader>
            <CardTitle className="text-ink-head">Theme Toggle</CardTitle>
            <CardDescription className="text-ink-body">Switch between light and dark themes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={toggleTheme}
              className="btn-primary"
            >
              Toggle Theme
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
