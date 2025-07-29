import { useState, useEffect } from "react";
import {
    Shield,
    AlertTriangle,
    Trash2,
    Eye,
    Flag,
    User,
    Calendar,
    MessageSquare,
    MoreHorizontal,
    Search,
    Filter,
    Ban,
    Warning,
    CheckCircle,
    XCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface FlaggedContent {
    id: string;
    type: 'post' | 'comment' | 'user_profile' | 'message';
    title: string;
    content: string;
    author: string;
    authorId: string;
    category: string;
    violationType: 'spam' | 'harassment' | 'inappropriate' | 'copyright' | 'spam' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    reports: number;
    reportedBy: string[];
    createdAt: string;
    status: 'pending' | 'reviewed' | 'removed' | 'warned' | 'banned';
    moderationNotes?: string;
    actionTaken?: string;
}

export default function ContentModeration() {
    const { toast } = useToast();
    const [flaggedContent, setFlaggedContent] = useState<FlaggedContent[]>([]);
    const [selectedContent, setSelectedContent] = useState<FlaggedContent | null>(null);
    const [showActionDialog, setShowActionDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("pending");
    const [violationFilter, setViolationFilter] = useState("all");
    const [severityFilter, setSeverityFilter] = useState("all");

    // Action form state
    const [actionForm, setActionForm] = useState({
        action: "",
        notes: "",
        duration: "",
        reason: ""
    });

    useEffect(() => {
        // Mock data - replace with actual API call
        const mockFlaggedContent: FlaggedContent[] = [
            {
                id: "1",
                type: "post",
                title: "Inappropriate JavaScript Tutorial",
                content: "This post contains inappropriate language and content that violates community guidelines...",
                author: "problem_user",
                authorId: "user123",
                category: "JavaScript",
                violationType: "inappropriate",
                severity: "high",
                reports: 5,
                reportedBy: ["user1", "user2", "user3", "user4", "user5"],
                createdAt: "2024-01-30T10:30:00Z",
                status: "pending"
            },
            {
                id: "2",
                type: "comment",
                title: "Harassing Comment in React Thread",
                content: "This comment contains personal attacks and harassment towards other users...",
                author: "troll_user",
                authorId: "user456",
                category: "React",
                violationType: "harassment",
                severity: "critical",
                reports: 8,
                reportedBy: ["user1", "user2", "user3", "user4", "user5", "user6", "user7", "user8"],
                createdAt: "2024-01-30T09:15:00Z",
                status: "pending"
            },
            {
                id: "3",
                type: "post",
                title: "Spam Post - Buy Cheap Software",
                content: "Buy the best software at the cheapest prices! Click here now! Limited time offer!...",
                author: "spam_bot",
                authorId: "user789",
                category: "General",
                violationType: "spam",
                severity: "medium",
                reports: 3,
                reportedBy: ["user1", "user2", "user3"],
                createdAt: "2024-01-30T08:45:00Z",
                status: "reviewed"
            },
            {
                id: "4",
                type: "user_profile",
                title: "Inappropriate Profile Content",
                content: "User profile contains inappropriate images and text...",
                author: "inappropriate_user",
                authorId: "user101",
                category: "Profile",
                violationType: "inappropriate",
                severity: "high",
                reports: 4,
                reportedBy: ["user1", "user2", "user3", "user4"],
                createdAt: "2024-01-30T07:20:00Z",
                status: "removed"
            }
        ];

        setFlaggedContent(mockFlaggedContent);
        setIsLoading(false);
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline">Pending</Badge>;
            case 'reviewed':
                return <Badge variant="secondary">Reviewed</Badge>;
            case 'removed':
                return <Badge variant="destructive">Removed</Badge>;
            case 'warned':
                return <Badge variant="default">Warned</Badge>;
            case 'banned':
                return <Badge variant="destructive">Banned</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getViolationBadge = (violation: string) => {
        switch (violation) {
            case 'spam':
                return <Badge variant="outline">Spam</Badge>;
            case 'harassment':
                return <Badge variant="destructive">Harassment</Badge>;
            case 'inappropriate':
                return <Badge variant="default">Inappropriate</Badge>;
            case 'copyright':
                return <Badge variant="secondary">Copyright</Badge>;
            case 'other':
                return <Badge variant="outline">Other</Badge>;
            default:
                return <Badge variant="outline">{violation}</Badge>;
        }
    };

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'critical':
                return <Badge variant="destructive">Critical</Badge>;
            case 'high':
                return <Badge variant="default">High</Badge>;
            case 'medium':
                return <Badge variant="secondary">Medium</Badge>;
            case 'low':
                return <Badge variant="outline">Low</Badge>;
            default:
                return <Badge variant="outline">{severity}</Badge>;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'post':
                return <MessageSquare className="h-4 w-4" />;
            case 'comment':
                return <MessageSquare className="h-4 w-4" />;
            case 'user_profile':
                return <User className="h-4 w-4" />;
            case 'message':
                return <MessageSquare className="h-4 w-4" />;
            default:
                return <MessageSquare className="h-4 w-4" />;
        }
    };

    const openActionDialog = (content: FlaggedContent) => {
        setSelectedContent(content);
        setActionForm({
            action: "",
            notes: "",
            duration: "",
            reason: ""
        });
        setShowActionDialog(true);
    };

    const handleAction = async () => {
        if (!selectedContent || !actionForm.action) return;

        try {
            const updatedContent = flaggedContent.map(item =>
                item.id === selectedContent.id
                    ? {
                        ...item,
                        status: actionForm.action as 'reviewed' | 'removed' | 'warned' | 'banned',
                        moderationNotes: actionForm.notes,
                        actionTaken: actionForm.action
                    }
                    : item
            );

            setFlaggedContent(updatedContent);
            setShowActionDialog(false);
            setSelectedContent(null);

            toast({
                title: "Action Taken",
                description: `Content has been ${actionForm.action}.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to take action on content.",
                variant: "destructive",
            });
        }
    };

    const filteredContent = flaggedContent.filter(content => {
        const searchMatch = searchTerm === "" ||
            content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            content.author.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = statusFilter === "all" || content.status === statusFilter;
        const violationMatch = violationFilter === "all" || content.violationType === violationFilter;
        const severityMatch = severityFilter === "all" || content.severity === severityFilter;
        return searchMatch && statusMatch && violationMatch && severityMatch;
    });

    const pendingCount = flaggedContent.filter(c => c.status === 'pending').length;
    const criticalCount = flaggedContent.filter(c => c.severity === 'critical').length;
    const removedToday = flaggedContent.filter(c => 
        c.status === 'removed' && 
        new Date(c.createdAt).toDateString() === new Date().toDateString()
    ).length;

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
                    <h1 className="text-3xl font-bold">Content Moderation</h1>
                    <p className="text-muted-foreground">
                        Remove inappropriate content and manage violations
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Shield className="mr-2 h-4 w-4" />
                        View Guidelines
                    </Button>
                    <Button>
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Bulk Actions
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                        <Flag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Items awaiting review
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critical Violations</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
                        <p className="text-xs text-muted-foreground">
                            High priority violations
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Removed Today</CardTitle>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{removedToday}</div>
                        <p className="text-xs text-muted-foreground">
                            Content removed today
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search content..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="reviewed">Reviewed</SelectItem>
                                    <SelectItem value="removed">Removed</SelectItem>
                                    <SelectItem value="warned">Warned</SelectItem>
                                    <SelectItem value="banned">Banned</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Violation Type</Label>
                            <Select value={violationFilter} onValueChange={setViolationFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All violations" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Violations</SelectItem>
                                    <SelectItem value="spam">Spam</SelectItem>
                                    <SelectItem value="harassment">Harassment</SelectItem>
                                    <SelectItem value="inappropriate">Inappropriate</SelectItem>
                                    <SelectItem value="copyright">Copyright</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Severity</Label>
                            <Select value={severityFilter} onValueChange={setSeverityFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All severities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Severities</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Content Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Flagged Content ({filteredContent.length})</CardTitle>
                    <CardDescription>
                        Review and take action on reported content
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Content</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Violation</TableHead>
                                <TableHead>Severity</TableHead>
                                <TableHead>Reports</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredContent.map((content) => (
                                <TableRow key={content.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{content.title}</div>
                                            <div className="text-sm text-muted-foreground line-clamp-2">
                                                {content.content.substring(0, 100)}...
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {new Date(content.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{content.author}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(content.type)}
                                            <span className="text-sm capitalize">{content.type}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getViolationBadge(content.violationType)}
                                    </TableCell>
                                    <TableCell>
                                        {getSeverityBadge(content.severity)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Flag className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{content.reports}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(content.status)}
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
                                                <DropdownMenuItem onClick={() => openActionDialog(content)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Review
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Remove Content
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Warning className="mr-2 h-4 w-4" />
                                                    Warn User
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <Ban className="mr-2 h-4 w-4" />
                                                    Ban User
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

            {/* Action Dialog */}
            <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Take Action</DialogTitle>
                        <DialogDescription>
                            Choose appropriate action for the flagged content
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {selectedContent && (
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium">Content Title</Label>
                                    <p className="text-sm text-muted-foreground">{selectedContent.title}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Content</Label>
                                    <div className="mt-2 p-3 bg-muted rounded-lg max-h-40 overflow-y-auto">
                                        <p className="text-sm">{selectedContent.content}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium">Author</Label>
                                        <p className="text-sm text-muted-foreground">{selectedContent.author}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Violation</Label>
                                        <p className="text-sm text-muted-foreground">{selectedContent.violationType}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium">Action</Label>
                                <Select value={actionForm.action} onValueChange={(value) => setActionForm({...actionForm, action: value})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select action" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="reviewed">Mark as Reviewed</SelectItem>
                                        <SelectItem value="removed">Remove Content</SelectItem>
                                        <SelectItem value="warned">Warn User</SelectItem>
                                        <SelectItem value="banned">Ban User</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Reason</Label>
                                <Select value={actionForm.reason} onValueChange={(value) => setActionForm({...actionForm, reason: value})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="spam">Spam</SelectItem>
                                        <SelectItem value="harassment">Harassment</SelectItem>
                                        <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                                        <SelectItem value="copyright">Copyright Violation</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {(actionForm.action === 'warned' || actionForm.action === 'banned') && (
                                <div>
                                    <Label className="text-sm font-medium">Duration</Label>
                                    <Select value={actionForm.duration} onValueChange={(value) => setActionForm({...actionForm, duration: value})}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1_day">1 Day</SelectItem>
                                            <SelectItem value="3_days">3 Days</SelectItem>
                                            <SelectItem value="1_week">1 Week</SelectItem>
                                            <SelectItem value="1_month">1 Month</SelectItem>
                                            <SelectItem value="permanent">Permanent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div>
                                <Label className="text-sm font-medium">Moderation Notes</Label>
                                <Textarea
                                    placeholder="Add notes about the action taken..."
                                    value={actionForm.notes}
                                    onChange={(e) => setActionForm({...actionForm, notes: e.target.value})}
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowActionDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAction} disabled={!actionForm.action}>
                            Take Action
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 