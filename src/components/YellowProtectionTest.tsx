import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function YellowProtectionTest() {
  return (
    <div className="page-container py-8">
      <h1 className="text-inkHead mb-8">Yellow Protection System Test</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Test inline styles (should be overridden) */}
        <Card className="card-surface">
          <CardHeader>
            <CardTitle className="text-inkHead">Inline Style Tests</CardTitle>
            <CardDescription className="text-inkBody">These should be converted to blue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              style={{ backgroundColor: '#f59e0b', color: 'white', padding: '8px', borderRadius: '4px' }}
            >
              Inline hex #f59e0b (should be blue)
            </div>
            <div 
              style={{ backgroundColor: 'rgb(254, 240, 138)', color: 'black', padding: '8px', borderRadius: '4px' }}
            >
              Inline RGB yellow (should be blue)
            </div>
            <button 
              style={{ backgroundColor: '#ffc107', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none' }}
            >
              Button with yellow hex (should be blue)
            </button>
          </CardContent>
        </Card>

        {/* Test our correct design tokens */}
        <Card className="card-surface">
          <CardHeader>
            <CardTitle className="text-inkHead">Correct Token Usage</CardTitle>
            <CardDescription className="text-inkBody">These use proper design tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary text-white p-2 rounded">
              Primary token (correct)
            </div>
            <div className="bg-secondary text-white p-2 rounded">
              Secondary token (correct)
            </div>
            <Button className="btn-primary">
              Proper primary button
            </Button>
            <div className="bg-surface border border-border p-2 rounded text-inkHead">
              Surface with border (correct)
            </div>
          </CardContent>
        </Card>

        {/* Test theme switching */}
        <Card className="card-surface">
          <CardHeader>
            <CardTitle className="text-inkHead">Theme Test</CardTitle>
            <CardDescription className="text-inkBody">Test light/dark theme switching</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => {
                const current = document.documentElement.dataset.theme;
                document.documentElement.dataset.theme = current === 'dark' ? 'light' : 'dark';
              }}
              className="btn-primary"
            >
              Toggle Theme
            </Button>
            <div className="bg-canvas border border-border p-4 rounded">
              <p className="text-inkHead font-semibold mb-2">Canvas Background</p>
              <p className="text-inkBody">This should adapt to theme changes</p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency override status */}
        <Card className="card-surface">
          <CardHeader>
            <CardTitle className="text-inkHead">Protection Status</CardTitle>
            <CardDescription className="text-inkBody">System guardrails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm text-inkBody">Emergency CSS overrides active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm text-inkBody">ESLint yellow protection enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm text-inkBody">Stylelint hex color blocking enabled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm text-inkBody">Runtime yellow detector active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm text-inkBody">Design token system active</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.yellowDetector) {
                    const conversions = window.yellowDetector.scanNow();
                    alert(`Scanned page: ${conversions} potential yellow elements checked`);
                  }
                }}
                className="btn-primary w-full"
              >
                🔍 Run Manual Yellow Scan
              </Button>

              <Button
                onClick={() => {
                  // Browser console inline style detector
                  const script = `
[...document.querySelectorAll('[style]')]
  .filter(n => /#f59e0b|#fbbf24|#eab308|#ffc107|#facc15|yellow|amber/i.test(n.getAttribute('style')))
  .map(n => ({el:n, style:n.getAttribute('style')}))
                  `;
                  console.log('🔍 Running inline style checker...');
                  console.log('Copy and paste this into console to find yellow inline styles:');
                  console.log(script);
                  alert('Check console for inline style detector script!');
                }}
                variant="outline"
                className="w-full"
              >
                📋 Get Console Detector Script
              </Button>
            </div>

            <div className="mt-4 p-3 bg-elevated rounded-lg border border-border">
              <p className="text-xs text-inkBody/70">
                ✅ All yellow colors should be automatically converted to blue primary tokens
              </p>
              <p className="text-xs text-inkBody/70 mt-1">
                🔍 Use manual scan to check for any remaining yellow elements
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
