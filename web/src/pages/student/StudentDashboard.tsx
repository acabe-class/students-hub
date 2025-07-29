import { Calendar, BookOpen, Clock, Zap, Users, MessageSquare, Award, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProgressCard } from "@/components/gamification/ProgressCard";
import { Leaderboard } from "@/components/gamification/Leaderboard";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  // Mock data
  const mockUser = {
    name: "Alex Johnson",
    level: 8,
    points: 2450,
    streak: 12,
    achievements: 8,
  };

  const mockLeaderboard = [
    { rank: 1, name: "Sarah Chen", avatar: "/placeholder.svg", points: 3200, level: 12, streak: 25 },
    { rank: 2, name: "Alex Johnson", avatar: "/placeholder.svg", points: 2450, level: 8, streak: 12 },
    { rank: 3, name: "Michael Davis", avatar: "/placeholder.svg", points: 2380, level: 9, streak: 8 },
    { rank: 4, name: "Emma Wilson", avatar: "/placeholder.svg", points: 2100, level: 7, streak: 15 },
    { rank: 5, name: "David Garcia", avatar: "/placeholder.svg", points: 1950, level: 6, streak: 5 },
  ];

  const mockAnnouncements = [
    {
      id: 1,
      title: "New JavaScript Challenge Available",
      content: "Test your skills with our latest algorithm challenge!",
      type: "challenge",
      time: "2 hours ago"
    },
    {
      id: 2,
      title: "Cohort Meeting Tomorrow",
      content: "Join us for our weekly sync at 2 PM EST",
      type: "event",
      time: "5 hours ago"
    }
  ];

  const mockChallenges = [
    {
      id: 1,
      title: "Array Master",
      description: "Solve 5 array manipulation problems",
      progress: 3,
      total: 5,
      points: 50,
      difficulty: "Medium",
      timeLeft: "2 days"
    },
    {
      id: 2,
      title: "Code Reviewer",
      description: "Review and comment on 3 peer submissions",
      progress: 1,
      total: 3,
      points: 30,
      difficulty: "Easy",
      timeLeft: "5 days"
    }
  ];

  const motivationalQuotes = [
    "Code is like humor. When you have to explain it, it's bad.",
    "First, solve the problem. Then, write the code.",
    "The best error message is the one that never shows up.",
    "Debugging is twice as hard as writing the code in the first place."
  ];

  const todaysQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <Layout userRole="student">
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Banner */}
        <div className="bg-gradient-hero rounded-xl p-6 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {mockUser.name}! 🚀</h1>
            <p className="text-primary-foreground/90 mb-4">
              You're on a {mockUser.streak}-day streak! Keep up the great work!
            </p>
            <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-sm font-medium mb-1">💡 Daily Motivation</p>
              <p className="text-primary-foreground/90 italic">"{todaysQuote}"</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ProgressCard
            title="Level"
            value={mockUser.level}
            maxValue={10}
            type="level"
          />
          <ProgressCard
            title="Points"
            value={mockUser.points}
            maxValue={3000}
            type="points"
          />
          <ProgressCard
            title="Streak"
            value={mockUser.streak}
            maxValue={30}
            type="streak"
          />
          <ProgressCard
            title="Achievements"
            value={mockUser.achievements}
            maxValue={15}
            type="achievements"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Latest Announcements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAnnouncements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{announcement.title}</h4>
                      <Badge variant={announcement.type === 'challenge' ? 'default' : 'secondary'}>
                        {announcement.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                    <span className="text-xs text-muted-foreground">{announcement.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weekly Challenges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  Weekly Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="gamification-card p-4 group cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          {challenge.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{challenge.difficulty}</Badge>
                          <Badge className="bg-accent text-accent-foreground">
                            +{challenge.points} pts
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{challenge.timeLeft} left</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">
                          {challenge.progress}/{challenge.total}
                        </span>
                      </div>
                      <Progress 
                        value={(challenge.progress / challenge.total) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/challenges">
                    View All Challenges
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="hero" size="lg" className="h-20" asChild>
                <Link to="/assignments" className="flex flex-col gap-2">
                  <BookOpen className="h-6 w-6" />
                  <span>View Assignments</span>
                </Link>
              </Button>
              <Button variant="accent" size="lg" className="h-20" asChild>
                <Link to="/schedule" className="flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span>My Schedule</span>
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-20" asChild>
                <Link to="/forum" className="flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span>Join Forum</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Leaderboard entries={mockLeaderboard} currentUserId="Alex Johnson" />

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">15</span>
                  </div>
                  <div>
                    <p className="font-medium">JavaScript Workshop</p>
                    <p className="text-sm text-muted-foreground">Today, 3:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                    <span className="text-accent-foreground font-bold text-sm">18</span>
                  </div>
                  <div>
                    <p className="font-medium">Project Presentation</p>
                    <p className="text-sm text-muted-foreground">Thu, 10:00 AM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievement Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Recent Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20">
                    <div className="text-2xl mb-1">🏆</div>
                    <p className="text-xs font-medium">Streak Master</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20">
                    <div className="text-2xl mb-1">💻</div>
                    <p className="text-xs font-medium">Code Warrior</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20">
                    <div className="text-2xl mb-1">🎯</div>
                    <p className="text-xs font-medium">Goal Crusher</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20">
                    <div className="text-2xl mb-1">🔥</div>
                    <p className="text-xs font-medium">Hot Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}