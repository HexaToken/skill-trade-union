import { Wallet, TrendingUp, Gift, Plus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WalletWidgetProps {
  credits: number;
  recentEarning?: number;
  isPro?: boolean;
  variant?: "default" | "compact" | "detailed";
  className?: string;
  onEarnCredits?: () => void;
  onViewWallet?: () => void;
}

export function WalletWidget({
  credits,
  recentEarning = 0,
  isPro = false,
  variant = "default",
  className,
  onEarnCredits,
  onViewWallet
}: WalletWidgetProps) {
  if (variant === "compact") {
    return (
      <div className={cn(
        "flex items-center gap-3 glass p-3 rounded-lg hover-lift cursor-pointer",
        className
      )} onClick={onViewWallet}>
        <div className="p-2 rounded-lg bg-brand-primary/10">
          <Wallet className="w-4 h-4 text-brand-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-foreground">{credits}</span>
            <span className="text-sm text-muted-foreground">credits</span>
            {isPro && <Badge variant="secondary" size="sm">PRO</Badge>}
          </div>
          {recentEarning > 0 && (
            <div className="flex items-center gap-1 text-xs text-brand-success">
              <TrendingUp className="w-3 h-3" />
              <span>+{recentEarning} today</span>
            </div>
          )}
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <Card className={cn("glass-card", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-brand-primary" />
              Credits Wallet
            </div>
            {isPro && <Badge variant="secondary">PRO</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient mb-1">
              {credits}
            </div>
            <p className="text-sm text-muted-foreground">Available Credits</p>
          </div>
          
          {recentEarning > 0 && (
            <div className="flex items-center justify-center gap-2 p-3 bg-brand-success/10 rounded-lg">
              <TrendingUp className="w-4 h-4 text-brand-success" />
              <span className="text-sm font-medium text-brand-success">
                +{recentEarning} earned today
              </span>
            </div>
          )}

          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1" onClick={onEarnCredits}>
              <Plus className="w-4 h-4 mr-2" />
              Earn More
            </Button>
            <Button size="sm" className="flex-1 bg-gradient-brand" onClick={onViewWallet}>
              <Gift className="w-4 h-4 mr-2" />
              Donate
            </Button>
          </div>

          {!isPro && (
            <div className="text-xs text-center text-muted-foreground border-t pt-3">
              💡 Pro users keep credits forever. Free tier expires in 12 months.
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <div className={cn(
      "glass-card p-4 hover-lift cursor-pointer",
      className
    )} onClick={onViewWallet}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-brand-primary" />
          <span className="font-medium text-foreground">Credits</span>
        </div>
        {isPro && <Badge variant="secondary" size="sm">PRO</Badge>}
      </div>
      
      <div className="text-2xl font-bold text-gradient mb-2">
        {credits}
      </div>
      
      {recentEarning > 0 && (
        <div className="flex items-center gap-1 text-sm text-brand-success">
          <TrendingUp className="w-3 h-3" />
          <span>+{recentEarning} today</span>
        </div>
      )}
    </div>
  );
}
