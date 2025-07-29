import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  description?: string;
  className?: string;
}

function StatCard({ title, value, change, trend, icon, description, className }: StatProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 text-sm", getTrendColor())}>
              {getTrendIcon()}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-muted-foreground text-sm">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsOverviewProps {
  stats: StatProps[];
  className?: string;
}

export function StatsOverview({ stats, className }: StatsOverviewProps) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}