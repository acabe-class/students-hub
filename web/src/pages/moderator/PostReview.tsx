import { useState, useEffect } from "react";
import {
    CheckCircle,
    XCircle,
    Eye,
    Clock,
    User,
    Calendar,
    MessageSquare,
    Flag,
    MoreHorizontal,
    Search,
    Filter,
    AlertTriangle,
    ThumbsUp,
    ThumbsDown
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

interface ForumPost {
    id: string;
    title: string;
    content: string;
    author: string;
    authorId: string;
    category: string;
    tags: string[];
    status: 'pending' | 'approved' | 'rejected' | 'flagged';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    createdAt: string;
    updatedAt?: string;
    reports: number;
    likes: number;
    replies: number;
    isPinned: boolean;
    moderationNotes?: string;
}

export default function PostReview() {
    const { toast } = useToast();
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
    const [showReviewDialog, setShowReviewDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("pending");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");

    // Review form state
    const [reviewForm, setReviewForm] = useState({
        action: "",
        notes: "",
        reason: ""
    });

    useEffect(() => {
        // Mock data - replace with actual API call
        const mockPosts: ForumPost[] = [
            {
                id: "1",
                title: "JavaScript Best Practices for Beginners",
                content: "I've been learning JavaScript for a few months now and wanted to share some best practices I've discovered. Here are some tips that have helped me improve my code quality...",
                author: "john_doe",
                authorId: "user123",
                category: "JavaScript",
                tags: ["javascript", "beginners", "best-practices"],
                status: "pending",
                priority: "medium",
                createdAt: "2024-01-30T10:30:00Z",
                reports: 0,
                likes: 0,
                replies: 0,
                isPinned: false
            },
            {
                id: "2",
                title: "React Hooks Tutorial - Complete Guide",
                content: "This is a comprehensive guide to React Hooks. I'll cover useState, useEffect, useContext, and custom hooks with practical examples...",
                author: "react_developer",
                authorId: "user456",
                category: "React",
                tags: ["react", "hooks", "tutorial"],
                status: "pending",
                priority: "high",
                createdAt: "2024-01-30T09:15:00Z",
                reports: 0,
                likes: 0,
                replies: 0,
                isPinned: false
            },
            {
                id: "3",
                title: "TypeScript vs JavaScript - Which to Choose?",
                content: "I'm starting a new project and can't decide between TypeScript and JavaScript. Here are the pros and cons I've found...",
                author: "typescript_fan",
                authorId: "user789",
                category: "TypeScript",
                tags: ["typescript", "javascript", "comparison"],
                status: "flagged",
                priority: "medium",
                createdAt: "2024-01-30T08:45:00Z",
                reports: 2,
                likes: 0,
                replies: 0,
                isPinned: false
            },
            {
                id: "4",
                title: "Help with CSS Grid Layout",
                content: "I'm having trouble understanding CSS Grid. Can someone explain the difference between grid-template-columns and grid-template-rows?",
                author: "css_learner",
                authorId: "user101",
                category: "CSS",
                tags: ["css", "grid", "help"],
                status: "pending",
                priority: "low",
                createdAt: "2024-01-30T07:20:00Z",
                reports: 0,
                likes: 0,
                replies: 0,
                isPinned: false
            }
        ];

        setPosts(mockPosts);
        setIsLoading(false);
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="outline">Pending</Badge>;
            case 'approved':
                return <Badge variant="default">Approved</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            case 'flagged':
                return <Badge variant="secondary">Flagged</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

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

    const openReviewDialog = (post: ForumPost) => {
        setSelectedPost(post);
        setReviewForm({
            action: "",
            notes: "",
            reason: ""
        });
        setShowReviewDialog(true);
    };

    const handleReview = async () => {
        if (!selectedPost || !reviewForm.action) return;

        try {
            const updatedPosts = posts.map(post =>
                post.id === selectedPost.id
                    ? {
                        ...post,
                        status: reviewForm.action as 'approved' | 'rejected',
                        moderationNotes: reviewForm.notes,
                        updatedAt: new Date().toISOString()
                    }
                    : post
            );

            setPosts(updatedPosts);
            setShowReviewDialog(false);
            setSelectedPost(null);

            toast({
                title: "Post Reviewed",
                description: `Post has been ${reviewForm.action}.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to review post.",
                variant: "destructive",
            });
        }
    };

    const filteredPosts = posts.filter(post => {
        const searchMatch = searchTerm === "" ||
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = statusFilter === "all" || post.status === statusFilter;
        const priorityMatch = priorityFilter === "all" || post.priority === priorityFilter;
        const categoryMatch = categoryFilter === "all" || post.category === categoryFilter;
        return searchMatch && statusMatch && priorityMatch && categoryMatch;
    });

    const pendingCount = posts.filter(p => p.status === 'pending').length;
    const flaggedCount = posts.filter(p => p.status === 'flagged').length;
    const approvedToday = posts.filter(p =>
        p.status === 'approved' &&
        new Date(p.updatedAt || p.createdAt).toDateString() === new Date().toDateString()
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
                    <h1 className="text-3xl font-bold">Post Review</h1>
                    <p className="text-muted-foreground">
                        Review and approve forum posts
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        View Guidelines
                    </Button>
                    <Button>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Bulk Actions
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Posts awaiting approval
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
                        <Flag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{flaggedCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Reported posts
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{approvedToday}</div>
                        <p className="text-xs text-muted-foreground">
                            Posts approved today
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
                                    placeholder="Search posts..."
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
                                    <SelectItem value="flagged">Flagged</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All priorities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="JavaScript">JavaScript</SelectItem>
                                    <SelectItem value="React">React</SelectItem>
                                    <SelectItem value="TypeScript">TypeScript</SelectItem>
                                    <SelectItem value="CSS">CSS</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Posts Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Posts ({filteredPosts.length})</CardTitle>
                    <CardDescription>
                        Review and moderate forum posts
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Reports</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPosts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{post.title}</div>
                                            <div className="text-sm text-muted-foreground line-clamp-2">
                                                {post.content.substring(0, 100)}...
                                            </div>
                                            <div className="flex gap-1 mt-1">
                                                {post.tags.slice(0, 3).map((tag) => (
                                                    <Badge key={tag} variant="outline" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{post.author}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{post.category}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(post.status)}
                                    </TableCell>
                                    <TableCell>
                                        {getPriorityBadge(post.priority)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Flag className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{post.reports}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(post.createdAt).toLocaleTimeString()}
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
                                                <DropdownMenuItem onClick={() => openReviewDialog(post)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Review
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Quick Approve
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                    Quick Reject
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                                    Flag for Review
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

            {/* Review Dialog */}
            <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Review Post</DialogTitle>
                        <DialogDescription>
                            Review and moderate the selected post
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {selectedPost && (
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium">Post Title</Label>
                                    <p className="text-sm text-muted-foreground">{selectedPost.title}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Content</Label>
                                    <div className="mt-2 p-3 bg-muted rounded-lg max-h-40 overflow-y-auto">
                                        <p className="text-sm">{selectedPost.content}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium">Author</Label>
                                        <p className="text-sm text-muted-foreground">{selectedPost.author}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Category</Label>
                                        <p className="text-sm text-muted-foreground">{selectedPost.category}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium">Action</Label>
                                <Select value={reviewForm.action} onValueChange={(value) => setReviewForm({ ...reviewForm, action: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select action" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="approved">Approve</SelectItem>
                                        <SelectItem value="rejected">Reject</SelectItem>
                                        <SelectItem value="flagged">Flag for Review</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Reason (Optional)</Label>
                                <Select value={reviewForm.reason} onValueChange={(value) => setReviewForm({ ...reviewForm, reason: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="appropriate">Appropriate Content</SelectItem>
                                        <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                                        <SelectItem value="spam">Spam</SelectItem>
                                        <SelectItem value="duplicate">Duplicate Post</SelectItem>
                                        <SelectItem value="off_topic">Off Topic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Moderation Notes</Label>
                                <Textarea
                                    placeholder="Add any additional notes..."
                                    value={reviewForm.notes}
                                    onChange={(e) => setReviewForm({ ...reviewForm, notes: e.target.value })}
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleReview} disabled={!reviewForm.action}>
                            Submit Review
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 