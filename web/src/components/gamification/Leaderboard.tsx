import { Trophy, Crown, Medal, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  level: number;
  streak: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  className?: string;
}

export function Leaderboard({ entries, currentUserId, className }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-orange-500" />;
      default: return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return "leaderboard-gold";
      case 2: return "leaderboard-silver";
      case 3: return "leaderboard-bronze";
      default: return "bg-muted/50";
    }
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {entries.slice(0, 10).map((entry) => (
          <div
            key={entry.rank}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-102",
              entry.rank <= 3 ? getRankStyle(entry.rank) : "bg-card hover:bg-muted/50",
              currentUserId === entry.name && "ring-2 ring-primary"
            )}
          >
            <div className="flex items-center justify-center w-8">
              {getRankIcon(entry.rank)}
            </div>
            
            <Avatar className="h-8 w-8">
              <AvatarImage src={entry.avatar} alt={entry.name} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs">
                {entry.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{entry.name}</p>
                <Badge variant="outline" className="text-xs">
                  Lv.{entry.level}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{entry.points} pts</span>
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {entry.streak} day streak
                </span>
              </div>
            </div>
            
            {entry.rank === 1 && (
              <div className="text-2xl animate-bounce">👑</div>
            )}
            {entry.rank === 2 && (
              <div className="text-xl">🥈</div>
            )}
            {entry.rank === 3 && (
              <div className="text-xl">🥉</div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const Target = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);