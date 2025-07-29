import { Trophy, Target, Zap, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
  title: string;
  value: number;
  maxValue: number;
  type: 'level' | 'points' | 'streak' | 'achievements';
  className?: string;
}

export function ProgressCard({ title, value, maxValue, type, className }: ProgressCardProps) {
  const percentage = (value / maxValue) * 100;
  
  const getIcon = () => {
    switch (type) {
      case 'level': return <Star className="h-5 w-5 text-yellow-500" />;
      case 'points': return <Zap className="h-5 w-5 text-blue-500" />;
      case 'streak': return <Target className="h-5 w-5 text-green-500" />;
      case 'achievements': return <Trophy className="h-5 w-5 text-purple-500" />;
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'level': return 'from-yellow-400 to-yellow-600';
      case 'points': return 'from-blue-400 to-blue-600';
      case 'streak': return 'from-green-400 to-green-600';
      case 'achievements': return 'from-purple-400 to-purple-600';
    }
  };

  return (
    <Card className={cn("gamification-card", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="font-medium text-sm text-muted-foreground">{title}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {value}/{maxValue}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{value}</span>
            <span className="text-sm text-muted-foreground">{percentage.toFixed(0)}%</span>
          </div>
          
          <Progress 
            value={percentage} 
            className="h-2"
          />
          
          {type === 'level' && (
            <div className="text-xs text-muted-foreground text-center">
              {maxValue - value} points to next level
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}