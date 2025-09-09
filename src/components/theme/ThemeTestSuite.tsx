import { useState } from "react"
import { useTheme, useResolvedTheme, useSystemTheme } from "@/components/theme-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button" 
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/ThemeToggle"
import { ColorModeToggle } from "./ColorModeToggle"
import { Monitor, Sun, Moon, Palette, Check, X } from "lucide-react"

/**
 * Comprehensive theme testing component
 * Tests all theme functionality and provides visual feedback
 */
export function ThemeTestSuite() {
  const { theme, setTheme, themes, resolvedTheme, systemTheme } = useTheme()
  const resolvedThemeHook = useResolvedTheme()
  const { systemTheme: systemThemeHook, isSystemSupported } = useSystemTheme()
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})

  const runTests = () => {
    const results: Record<string, boolean> = {}
    
    // Test theme consistency
    results["Theme consistency"] = resolvedTheme === resolvedThemeHook
    results["System theme consistency"] = systemTheme === systemThemeHook
    results["System support detection"] = isSystemSupported === themes.includes("system")
    
    // Test theme application
    const root = document.documentElement
    results["Theme attribute applied"] = root.getAttribute("data-theme") === resolvedTheme
    results["Theme class applied"] = root.classList.contains(resolvedTheme)
    
    // Test CSS variables
    const computedStyle = getComputedStyle(root)
    results["Primary color defined"] = !!computedStyle.getPropertyValue("--primary").trim()
    results["Surface color defined"] = !!computedStyle.getPropertyValue("--surface").trim()
    results["Text color defined"] = !!computedStyle.getPropertyValue("--ink-body").trim()
    
    setTestResults(results)
  }

  const allTestsPassed = Object.values(testResults).every(Boolean)
  const testsRun = Object.keys(testResults).length > 0

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme System Test Suite
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-surface">
              <CardContent className="p-4">
                <div className="text-sm text-ink-body mb-1">Current Theme</div>
                <div className="flex items-center gap-2">
                  {theme === "light" && <Sun className="h-4 w-4" />}
                  {theme === "dark" && <Moon className="h-4 w-4" />}
                  {theme === "system" && <Monitor className="h-4 w-4" />}
                  <Badge variant="secondary">{theme}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface">
              <CardContent className="p-4">
                <div className="text-sm text-ink-body mb-1">Resolved Theme</div>
                <div className="flex items-center gap-2">
                  {resolvedTheme === "light" && <Sun className="h-4 w-4" />}
                  {resolvedTheme === "dark" && <Moon className="h-4 w-4" />}
                  <Badge variant="secondary">{resolvedTheme}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface">
              <CardContent className="p-4">
                <div className="text-sm text-ink-body mb-1">System Theme</div>
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <Badge variant="outline">
                    {systemTheme || "Not detected"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface">
              <CardContent className="p-4">
                <div className="text-sm text-ink-body mb-1">Available Themes</div>
                <div className="flex flex-wrap gap-1">
                  {themes.map((t) => (
                    <Badge
                      key={t}
                      variant={t === theme ? "default" : "outline"}
                      className="text-xs"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Theme Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-ink-head">Theme Controls</h3>
            <div className="flex flex-wrap items-center gap-4">
              <ThemeToggle />
              <ColorModeToggle />
              <div className="flex gap-2">
                {themes.map((t) => (
                  <Button
                    key={t}
                    variant={t === theme ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme(t)}
                    className="capitalize"
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Theme Test */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-ink-head">Visual Theme Test</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-surface border-border">
                <CardContent className="p-4">
                  <h4 className="text-ink-head font-medium mb-2">Surface Colors</h4>
                  <div className="space-y-2">
                    <div className="h-8 bg-canvas rounded flex items-center px-2 text-ink-body text-sm">
                      Canvas
                    </div>
                    <div className="h-8 bg-surface rounded flex items-center px-2 text-ink-body text-sm">
                      Surface
                    </div>
                    <div className="h-8 bg-elevated rounded flex items-center px-2 text-ink-body text-sm">
                      Elevated
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface border-border">
                <CardContent className="p-4">
                  <h4 className="text-ink-head font-medium mb-2">Text Colors</h4>
                  <div className="space-y-2">
                    <div className="text-ink-head text-sm">Heading Text</div>
                    <div className="text-ink-body text-sm">Body Text</div>
                    <div className="text-primary text-sm">Primary Text</div>
                    <div className="text-secondary text-sm">Secondary Text</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface border-border">
                <CardContent className="p-4">
                  <h4 className="text-ink-head font-medium mb-2">State Colors</h4>
                  <div className="space-y-2">
                    <Badge variant="default">Primary</Badge>
                    <Badge className="bg-success text-white">Success</Badge>
                    <Badge className="bg-warning text-white">Warning</Badge>
                    <Badge className="bg-danger text-white">Danger</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Automated Tests */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-ink-head">Automated Tests</h3>
              <Button onClick={runTests} size="sm">
                Run Tests
              </Button>
            </div>

            {testsRun && (
              <Alert variant={allTestsPassed ? "default" : "destructive"}>
                <div className="flex items-center gap-2">
                  {allTestsPassed ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <X className="h-4 w-4 text-danger" />
                  )}
                  <AlertTitle>
                    Test Results: {allTestsPassed ? "All Passed" : "Some Failed"}
                  </AlertTitle>
                </div>
                <AlertDescription className="mt-2">
                  <div className="space-y-1">
                    {Object.entries(testResults).map(([test, passed]) => (
                      <div key={test} className="flex items-center gap-2 text-sm">
                        {passed ? (
                          <Check className="h-3 w-3 text-success" />
                        ) : (
                          <X className="h-3 w-3 text-danger" />
                        )}
                        <span>{test}</span>
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}