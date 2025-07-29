import { useState, useEffect } from "react";
import {
    Shield,
    AlertTriangle,
    CheckCircle,
    Clock,
    Users,
    MessageSquare,
    TrendingUp,
    Flag,
    Eye,
    MoreHorizontal,
    Calendar,
    BarChart3
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ForumStats {
    totalPosts: number;
    pendingApproval: number;
    reportedContent: number;
    activeUsers: number;
    totalThreads: number;
    resolvedConflicts: number;
    averageResponseTime: number;
    communityHealth: number;
}

interface PendingAction {
    id: string;
    type: 'post_review' | 'content_moderation' | 'conflict_resolution' | 'user_report';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    createdAt: string;
    author: string;
    status: 'pending' | 'in_progress' | 'resolved';
}

interface RecentActivity {
    id: string;
    type: 'post_approved' | 'content_removed' | 'conflict_resolved' | 'user_warned';
    title: string;
    description: string;
    timestamp: string;
    moderator: string;
}

export default function ModeratorDashboard() {
    const { toast } = useToast();
    const [stats, setStats] = useState<ForumStats | null>(null);
    const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mock data - replace with actual API call
        const mockStats: ForumStats = {
            totalPosts: 1247,
            pendingApproval: 23,
            reportedContent: 8,
            activeUsers: 156,
            totalThreads: 89,
            resolvedConflicts: 12,
            averageResponseTime: 2.5,
            communityHealth: 87
        };

        const mockPendingActions: PendingAction[] = [
            {
                id: "1",
                type: "post_review",
                title: "New JavaScript Tutorial Post",
                description: "User submitted a tutorial post about React hooks",
                priority: "medium",
                createdAt: "2024-01-30T10:30:00Z",
                author: "john_doe",
                status: "pending"
            },
            {
                id: "2",
                type: "content_moderation",
                title: "Inappropriate Comment Reported",
                description: "Comment flagged for inappropriate language",
                priority: "high",
                createdAt: "2024-01-30T09:15:00Z",
                author: "anonymous_user",
                status: "in_progress"
            },
            {
                id: "3",
                type: "conflict_resolution",
                title: "Heated Discussion in React Thread",
                description: "Multiple users arguing about state management",
                priority: "medium",
                createdAt: "2024-01-30T08:45:00Z",
                author: "react_developer",
                status: "pending"
            },
            {
                id: "4",
                type: "user_report",
                title: "User Harassment Report",
                description: "User reported for repeated harassment",
                priority: "urgent",
                createdAt: "2024-01-30T07:20:00Z",
                author: "victim_user",
                status: "pending"
            }
        ];

        const mockRecentActivity: RecentActivity[] = [
            {
                id: "1",
                type: "post_approved",
                title: "Post Approved",
                description: "React Best Practices guide approved",
                timestamp: "2024-01-30T11:00:00Z",
                moderator: "mod_sarah"
            },
            {
                id: "2",
                type: "content_removed",
                title: "Content Removed",
                description: "Inappropriate comment removed from JavaScript thread",
                timestamp: "2024-01-30T10:45:00Z",
                moderator: "mod_mike"
            },
            {
                id: "3",
                type: "conflict_resolved",
                title: "Conflict Resolved",
                description: "Mediated discussion in TypeScript thread",
                timestamp: "2024-01-30T10:30:00Z",
                moderator: "mod_sarah"
            },
            {
                id: "4",
                type: "user_warned",
                title: "User Warned",
                description: "Warning issued for spam posting",
                timestamp: "2024-01-30T10:15:00Z",
                moderator: "mod_mike"
            }
        ];

        setStats(mockStats);
        setPendingActions(mockPendingActions);
        setRecentActivity(mockRecentActivity);
        setIsLoading(false);
    }, []);

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return <Badge variant="destructive">Urgent</Badge>;
            case 'high':
                return <Badge variant="default">High</Badge>;
            case 'medium':
                return <Badge variant="secondary">Medium</Badge>;
            case 'low':
                return <Badge variant="outline">Low</Badge>;
            default:
                return <Badge variant="outline">{priority}</Badge>;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'post_review':
                return <MessageSquare className="h-4 w-4" />;
            case 'content_moderation':
                return <Shield className="h-4 w-4" />;
            case 'conflict_resolution':
                return <AlertTriangle className="h-4 w-4" />;
            case 'user_report':
                return <Flag className="h-4 w-4" />;
            default:
                return <MessageSquare className="h-4 w-4" />;
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'post_approved':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'content_removed':
                return <Shield className="h-4 w-4 text-red-600" />;
            case 'conflict_resolved':
                return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
            case 'user_warned':
                return <Flag className="h-4 w-4 text-orange-600" />;
            default:
                return <MessageSquare className="h-4 w-4" />;
        }
    };

    const handleAction = (actionId: string, action: string) => {
        toast({
            title: "Action Taken",
            description: `${action} completed for action #${actionId}`,
        });
    };

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
                    <h1 className="text-3xl font-bold">Moderator Dashboard</h1>
                    <p className="text-muted-foreground">
                        Forum oversight and community management
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Analytics
                    </Button>
                    <Button>
                        <Shield className="mr-2 h-4 w-4" />
                        Quick Actions
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.pendingApproval}</div>
                        <p className="text-xs text-muted-foreground">
                            Posts awaiting review
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reported Content</CardTitle>
                        <Flag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.reportedContent}</div>
                        <p className="text-xs text-muted-foreground">
                            Items flagged by users
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.activeUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            Users this week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Community Health</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.communityHealth}%</div>
                        <p className="text-xs text-muted-foreground">
                            Overall health score
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Community Health Progress */}
            <Card>
                <CardHeader>
                    <CardTitle>Community Health Metrics</CardTitle>
                    <CardDescription>
                        Overall forum health and moderation effectiveness
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Response Time</span>
                                <span className="text-sm text-muted-foreground">
                                    {stats?.averageResponseTime}h avg
                                </span>
                            </div>
                            <Progress value={75} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Conflict Resolution</span>
                                <span className="text-sm text-muted-foreground">
                                    {stats?.resolvedConflicts} resolved
                                </span>
                            </div>
                            <Progress value={85} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Content Quality</span>
                                <span className="text-sm text-muted-foreground">
                                    {stats?.totalPosts} posts
                                </span>
                            </div>
                            <Progress value={92} className="h-2" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pending Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Pending Actions ({pendingActions.length})</CardTitle>
                    <CardDescription>
                        Items requiring moderator attention
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingActions.map((action) => (
                                <TableRow key={action.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(action.type)}
                                            <span className="text-sm capitalize">
                                                {action.type.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{action.title}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {action.description}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">{action.author}</span>
                                    </TableCell>
                                    <TableCell>
                                        {getPriorityBadge(action.priority)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={action.status === 'pending' ? 'outline' : 'secondary'}>
                                            {action.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {new Date(action.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(action.createdAt).toLocaleTimeString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleAction(action.id, 'Review')}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Review
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleAction(action.id, 'Approve')}>
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Approve
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleAction(action.id, 'Reject')}>
                                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                                    Reject
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleAction(action.id, 'Escalate')}>
                                                    <Flag className="mr-2 h-4 w-4" />
                                                    Escalate
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Moderation Activity</CardTitle>
                    <CardDescription>
                        Latest actions taken by moderators
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                                <div className="mt-1">
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">{activity.title}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {activity.description}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-medium">{activity.moderator}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(activity.timestamp).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 