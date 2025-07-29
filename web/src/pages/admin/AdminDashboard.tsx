import { useState, useEffect } from "react";
import { 
  Users, 
  FileText, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
  BarChart3,
  Settings,
  Plus
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  activeStudents: number;
  totalCohorts: number;
  upcomingEvents: number;
  totalRevenue: number;
  averageExamScore: number;
}

interface RecentActivity {
  id: string;
  type: 'application' | 'exam' | 'payment' | 'announcement';
  title: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'approved' | 'rejected';
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    activeStudents: 0,
    totalCohorts: 0,
    upcomingEvents: 0,
    totalRevenue: 0,
    averageExamScore: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      totalApplications: 156,
      pendingApplications: 23,
      approvedApplications: 89,
      activeStudents: 234,
      totalCohorts: 8,
      upcomingEvents: 5,
      totalRevenue: 125000,
      averageExamScore: 78,
    });

    setRecentActivity([
      {
        id: '1',
        type: 'application',
        title: 'New Scholarship Application',
        description: 'John Doe applied for Full Stack Development track',
        timestamp: '2 hours ago',
        status: 'pending'
      },
      {
        id: '2',
        type: 'exam',
        title: 'Exam Completed',
        description: 'Sarah Wilson completed Frontend Development exam',
        timestamp: '4 hours ago',
        status: 'completed'
      },
      {
        id: '3',
        type: 'payment',
        title: 'Payment Confirmed',
        description: 'Payment received from Cohort 5 student',
        timestamp: '6 hours ago',
        status: 'completed'
      },
      {
        id: '4',
        type: 'announcement',
        title: 'Town Hall Scheduled',
        description: 'Monthly town hall scheduled for next week',
        timestamp: '1 day ago',
        status: 'completed'
      }
    ]);

    setIsLoading(false);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application':
        return <FileText className="h-4 w-4" />;
      case 'exam':
        return <BarChart3 className="h-4 w-4" />;
      case 'payment':
        return <DollarSign className="h-4 w-4" />;
      case 'announcement':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'approved':
        return <Badge variant="default">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const quickActions = [
    {
      title: "Review Applications",
      description: "Approve or reject scholarship applications",
      icon: <FileText className="h-6 w-6" />,
      action: () => navigate("/admin/applications"),
      color: "bg-blue-500"
    },
    {
      title: "Manage Cohorts",
      description: "Create and manage student cohorts",
      icon: <Users className="h-6 w-6" />,
      action: () => navigate("/admin/cohorts"),
      color: "bg-green-500"
    },
    {
      title: "Create Announcement",
      description: "Send announcements to students",
      icon: <MessageSquare className="h-6 w-6" />,
      action: () => navigate("/admin/announcements"),
      color: "bg-purple-500"
    },
    {
      title: "Review Payments",
      description: "Manage payment confirmations",
      icon: <DollarSign className="h-6 w-6" />,
      action: () => navigate("/admin/payments"),
      color: "bg-orange-500"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}. Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Quick Action
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across {stats.totalCohorts} cohorts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Exam Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageExamScore}%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={action.action}
          >
            <CardContent className="p-6">
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                {action.icon}
              </div>
              <h3 className="font-semibold mb-2">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and updates in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{activity.title}</p>
                      {getStatusBadge(activity.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Scheduled events and important dates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Monthly Town Hall</p>
                  <p className="text-sm text-muted-foreground">Cohort 5 & 6</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Tomorrow</p>
                  <p className="text-xs text-muted-foreground">2:00 PM</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Exam Deadline</p>
                  <p className="text-sm text-muted-foreground">Frontend Track</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Dec 15</p>
                  <p className="text-xs text-muted-foreground">11:59 PM</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Orientation Session</p>
                  <p className="text-sm text-muted-foreground">New Cohort</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Dec 20</p>
                  <p className="text-xs text-muted-foreground">10:00 AM</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              View Calendar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            Key metrics and trends for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Application Approval Rate</h4>
              <div className="flex items-center space-x-2">
                <Progress value={75} className="flex-1" />
                <span className="text-sm font-medium">75%</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Student Retention</h4>
              <div className="flex items-center space-x-2">
                <Progress value={88} className="flex-1" />
                <span className="text-sm font-medium">88%</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Payment Collection</h4>
              <div className="flex items-center space-x-2">
                <Progress value={92} className="flex-1" />
                <span className="text-sm font-medium">92%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 