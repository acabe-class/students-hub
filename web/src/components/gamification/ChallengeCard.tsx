import { Clock, Zap, Users, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChallengeCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  points: number;
  timeLeft: string;
  progress: number;
  total: number;
  participants: number;
  status: 'active' | 'completed' | 'locked';
  className?: string;
  onStart?: () => void;
}

export function ChallengeCard({
  id,
  title,
  description,
  difficulty,
  points,
  timeLeft,
  progress,
  total,
  participants,
  status,
  className,
  onStart
}: ChallengeCardProps) {
  const progressPercentage = (progress / total) * 100;

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-success" />;
      case 'locked': return <span className="text-2xl">🔒</span>;
      default: return <Zap className="h-5 w-5 text-accent" />;
    }
  };

  return (
    <Card className={cn(
      "gamification-card transition-all duration-300 cursor-pointer",
      status === 'locked' && "opacity-60 cursor-not-allowed",
      status === 'completed' && "border-success/30 bg-success/5",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <h3 className="font-semibold text-lg">{title}</h3>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge className={getDifficultyColor()}>
              {difficulty}
            </Badge>
            <Badge className="bg-accent text-accent-foreground">
              +{points} pts
            </Badge>
          </div>
        </div>

        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
          {description}
        </p>

        {status === 'active' && (
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">
                {progress}/{total} completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{timeLeft}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{participants} joined</span>
            </div>
          </div>
        </div>

        {status === 'active' && progress < total && (
          <Button 
            className="w-full" 
            variant={progress > 0 ? "outline" : "default"}
            onClick={onStart}
          >
            {progress > 0 ? "Continue Challenge" : "Start Challenge"}
          </Button>
        )}

        {status === 'completed' && (
          <div className="flex items-center justify-center gap-2 py-2 px-4 bg-success/10 rounded-lg">
            <CheckCircle className="h-4 w-4 text-success" />
            <span className="text-success font-medium">Challenge Completed!</span>
          </div>
        )}

        {status === 'locked' && (
          <div className="flex items-center justify-center gap-2 py-2 px-4 bg-muted/50 rounded-lg">
            <span className="text-muted-foreground text-sm">
              Complete previous challenges to unlock
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}