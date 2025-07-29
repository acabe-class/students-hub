import { useState, useEffect } from "react";
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Video,
  BarChart3,
  Plus,
  Mail
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  totalStudents: number;
  activeClasses: number;
  pendingAssignments: number;
  unreadMessages: number;
  upcomingClasses: number;
  averageAttendance: number;
  totalAssignments: number;
  completedGrading: number;
}

interface RecentActivity {
  id: string;
  type: 'assignment' | 'message' | 'class' | 'grade';
  title: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'urgent';
}

interface UpcomingClass {
  id: string;
  title: string;
  date: string;
  time: string;
  students: number;
  type: 'virtual' | 'recorded' | 'live';
}

export default function TutorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeClasses: 0,
    pendingAssignments: 0,
    unreadMessages: 0,
    upcomingClasses: 0,
    averageAttendance: 0,
    totalAssignments: 0,
    completedGrading: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      totalStudents: 45,
      activeClasses: 3,
      pendingAssignments: 12,
      unreadMessages: 8,
      upcomingClasses: 5,
      averageAttendance: 87,
      totalAssignments: 28,
      completedGrading: 16,
    });

    setRecentActivity([
      {
        id: '1',
        type: 'assignment',
        title: 'New Assignment Submission',
        description: 'Sarah Chen submitted JavaScript Fundamentals Quiz',
        timestamp: '2 hours ago',
        status: 'pending'
      },
      {
        id: '2',
        type: 'message',
        title: 'Student Question',
        description: 'Michael Davis asked about React hooks',
        timestamp: '4 hours ago',
        status: 'urgent'
      },
      {
        id: '3',
        type: 'grade',
        title: 'Assignment Graded',
        description: 'Completed grading for Array Methods Project',
        timestamp: '6 hours ago',
        status: 'completed'
      },
      {
        id: '4',
        type: 'class',
        title: 'Class Completed',
        description: 'Frontend Development Session 5 completed',
        timestamp: '1 day ago',
        status: 'completed'
      }
    ]);

    setUpcomingClasses([
      {
        id: '1',
        title: 'JavaScript Fundamentals',
        date: '2024-01-25',
        time: '10:00 AM',
        students: 15,
        type: 'virtual'
      },
      {
        id: '2',
        title: 'React Hooks Deep Dive',
        date: '2024-01-26',
        time: '2:00 PM',
        students: 12,
        type: 'live'
      },
      {
        id: '3',
        title: 'Project Review Session',
        date: '2024-01-27',
        time: '11:00 AM',
        students: 8,
        type: 'recorded'
      }
    ]);

    setIsLoading(false);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <FileText className="h-4 w-4" />;
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      case 'class':
        return <Video className="h-4 w-4" />;
      case 'grade':
        return <CheckCircle className="h-4 w-4" />;
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
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getClassTypeBadge = (type: string) => {
    switch (type) {
      case 'virtual':
        return <Badge variant="default">Virtual</Badge>;
      case 'live':
        return <Badge variant="secondary">Live</Badge>;
      case 'recorded':
        return <Badge variant="outline">Recorded</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const quickActions = [
    {
      title: "Create Assignment",
      description: "Create new assignments and quizzes",
      icon: <FileText className="h-6 w-6" />,
      action: () => navigate("/tutor/assignments"),
      color: "bg-blue-500"
    },
    {
      title: "Grade Submissions",
      description: "Review and grade student work",
      icon: <CheckCircle className="h-6 w-6" />,
      action: () => navigate("/tutor/grading"),
      color: "bg-green-500"
    },
    {
      title: "Host Class",
      description: "Start a virtual or live class",
      icon: <Video className="h-6 w-6" />,
      action: () => navigate("/tutor/classes"),
      color: "bg-purple-500"
    },
    {
      title: "Student Messages",
      description: "Respond to student queries",
      icon: <MessageSquare className="h-6 w-6" />,
      action: () => navigate("/tutor/messages"),
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
          <h1 className="text-3xl font-bold">Tutor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}. Here's your teaching overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
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
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across {stats.activeClasses} classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAssignments}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <p className="text-xs text-muted-foreground">
              Student queries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageAttendance}%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last week
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and updates in your classes
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

        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>
              Your scheduled teaching sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{classItem.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(classItem.date).toLocaleDateString()} at {classItem.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      {getClassTypeBadge(classItem.type)}
                      <span className="text-sm text-muted-foreground">
                        {classItem.students} students
                      </span>
                    </div>
                    <Button size="sm" variant="outline">
                      Join
                    </Button>
                  </div>
                </div>
              ))}
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
          <CardTitle>Teaching Performance</CardTitle>
          <CardDescription>
            Key metrics and trends for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Assignment Completion Rate</h4>
              <div className="flex items-center space-x-2">
                <Progress value={85} className="flex-1" />
                <span className="text-sm font-medium">85%</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Student Satisfaction</h4>
              <div className="flex items-center space-x-2">
                <Progress value={92} className="flex-1" />
                <span className="text-sm font-medium">92%</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Response Time</h4>
              <div className="flex items-center space-x-2">
                <Progress value={78} className="flex-1" />
                <span className="text-sm font-medium">78%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Send Announcement</h3>
                <p className="text-sm text-muted-foreground">Quick message to students</p>
              </div>
            </div>
            <Button size="sm" className="w-full mt-4">
              Compose
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">View Analytics</h3>
                <p className="text-sm text-muted-foreground">Student performance data</p>
              </div>
            </div>
            <Button size="sm" className="w-full mt-4">
              View Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Student Directory</h3>
                <p className="text-sm text-muted-foreground">Manage student contacts</p>
              </div>
            </div>
            <Button size="sm" className="w-full mt-4">
              View Students
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 