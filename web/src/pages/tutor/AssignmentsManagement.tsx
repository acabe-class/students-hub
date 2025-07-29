import { useState, useEffect } from "react";
import {
    Plus,
    FileText,
    Calendar,
    Users,
    CheckCircle,
    Clock,
    Edit,
    Trash2,
    Eye,
    BarChart3,
    MoreHorizontal,
    BookOpen,
    MessageSquare
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Assignment {
    id: string;
    title: string;
    description: string;
    type: 'quiz' | 'project' | 'homework' | 'exam';
    track: string;
    dueDate: string;
    status: 'draft' | 'published' | 'closed' | 'graded';
    totalStudents: number;
    submissions: number;
    averageScore?: number;
    createdAt: string;
}

export default function AssignmentsManagement() {
    const { toast } = useToast();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Form states
    const [newAssignment, setNewAssignment] = useState({
        title: "",
        description: "",
        type: "quiz",
        track: "",
        dueDate: "",
        totalStudents: 0
    });

    useEffect(() => {
        // Mock data - replace with actual API call
        const mockAssignments: Assignment[] = [
            {
                id: "1",
                title: "JavaScript Variables Quiz",
                description: "Test your understanding of JavaScript variables, let, const, and var",
                type: "quiz",
                track: "frontend",
                dueDate: "2024-01-30T23:59:59Z",
                status: "published",
                totalStudents: 15,
                submissions: 12,
                averageScore: 85,
                createdAt: "2024-01-20T10:00:00Z"
            },
            {
                id: "2",
                title: "React Component Project",
                description: "Build a todo list application using React components and hooks",
                type: "project",
                track: "frontend",
                dueDate: "2024-02-05T23:59:59Z",
                status: "published",
                totalStudents: 15,
                submissions: 8,
                createdAt: "2024-01-22T14:30:00Z"
            },
            {
                id: "3",
                title: "Array Methods Homework",
                description: "Practice array methods like map, filter, reduce with practical examples",
                type: "homework",
                track: "frontend",
                dueDate: "2024-01-28T23:59:59Z",
                status: "closed",
                totalStudents: 15,
                submissions: 15,
                averageScore: 78,
                createdAt: "2024-01-18T09:15:00Z"
            }
        ];

        setAssignments(mockAssignments);
        setIsLoading(false);
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft':
                return <Badge variant="outline">Draft</Badge>;
            case 'published':
                return <Badge variant="default">Published</Badge>;
            case 'closed':
                return <Badge variant="secondary">Closed</Badge>;
            case 'graded':
                return <Badge variant="default">Graded</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'quiz':
                return <Badge variant="default">Quiz</Badge>;
            case 'project':
                return <Badge variant="secondary">Project</Badge>;
            case 'homework':
                return <Badge variant="outline">Homework</Badge>;
            case 'exam':
                return <Badge variant="destructive">Exam</Badge>;
            default:
                return <Badge variant="outline">{type}</Badge>;
        }
    };

    const getSubmissionRate = (submissions: number, total: number) => {
        return Math.round((submissions / total) * 100);
    };

    const createAssignment = async () => {
        try {
            const assignment: Assignment = {
                id: Date.now().toString(),
                title: newAssignment.title,
                description: newAssignment.description,
                type: newAssignment.type as any,
                track: newAssignment.track,
                dueDate: newAssignment.dueDate,
                status: "draft",
                totalStudents: newAssignment.totalStudents,
                submissions: 0,
                createdAt: new Date().toISOString()
            };

            setAssignments([assignment, ...assignments]);
            setShowCreateDialog(false);
            setNewAssignment({
                title: "",
                description: "",
                type: "quiz",
                track: "",
                dueDate: "",
                totalStudents: 0
            });

            toast({
                title: "Assignment Created",
                description: "New assignment has been created successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create assignment.",
                variant: "destructive",
            });
        }
    };

    const publishAssignment = (assignmentId: string) => {
        const updatedAssignments = assignments.map(assignment =>
            assignment.id === assignmentId
                ? { ...assignment, status: "published" }
                : assignment
        );
        setAssignments(updatedAssignments);
        toast({
            title: "Assignment Published",
            description: "Assignment is now visible to students.",
        });
    };

    const closeAssignment = (assignmentId: string) => {
        const updatedAssignments = assignments.map(assignment =>
            assignment.id === assignmentId
                ? { ...assignment, status: "closed" }
                : assignment
        );
        setAssignments(updatedAssignments);
        toast({
            title: "Assignment Closed",
            description: "Assignment is no longer accepting submissions.",
        });
    };

    const deleteAssignment = (assignmentId: string) => {
        setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
        toast({
            title: "Assignment Deleted",
            description: "Assignment has been deleted successfully.",
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
                    <h1 className="text-3xl font-bold">Assignments Management</h1>
                    <p className="text-muted-foreground">
                        Create and manage assignments, quizzes, and projects for your students
                    </p>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Assignment
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{assignments.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all tracks
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Published</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {assignments.filter(a => a.status === 'published').length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Active assignments
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {assignments.filter(a => a.status === 'closed' && a.submissions > 0).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Need attention
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.round(assignments.reduce((acc, a) => acc + (a.averageScore || 0), 0) /
                                assignments.filter(a => a.averageScore).length) || 0}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Across graded assignments
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Assignments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((assignment) => (
                    <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                                    <CardDescription>{assignment.track}</CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Assignment
                                        </DropdownMenuItem>
                                        {assignment.status === "draft" && (
                                            <DropdownMenuItem onClick={() => publishAssignment(assignment.id)}>
                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                Publish
                                            </DropdownMenuItem>
                                        )}
                                        {assignment.status === "published" && (
                                            <DropdownMenuItem onClick={() => closeAssignment(assignment.id)}>
                                                <Clock className="mr-2 h-4 w-4" />
                                                Close
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() => deleteAssignment(assignment.id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Type</span>
                                {getTypeBadge(assignment.type)}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                {getStatusBadge(assignment.status)}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Submissions</span>
                                    <div className="font-medium">
                                        {assignment.submissions}/{assignment.totalStudents}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Rate</span>
                                    <div className="font-medium">
                                        {getSubmissionRate(assignment.submissions, assignment.totalStudents)}%
                                    </div>
                                </div>
                            </div>

                            {assignment.averageScore && (
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Average Score</span>
                                    <div className="font-medium">{assignment.averageScore}%</div>
                                </div>
                            )}

                            <div className="text-sm">
                                <span className="text-muted-foreground">Due Date</span>
                                <div className="font-medium">
                                    {new Date(assignment.dueDate).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                    <Eye className="mr-2 h-3 w-3" />
                                    View
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                    <BarChart3 className="mr-2 h-3 w-3" />
                                    Analytics
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Create Assignment Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Assignment</DialogTitle>
                        <DialogDescription>
                            Create a new assignment, quiz, or project for your students
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Assignment Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g., JavaScript Variables Quiz"
                                value={newAssignment.title}
                                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the assignment requirements..."
                                value={newAssignment.description}
                                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select value={newAssignment.type} onValueChange={(value) => setNewAssignment({ ...newAssignment, type: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="quiz">Quiz</SelectItem>
                                        <SelectItem value="project">Project</SelectItem>
                                        <SelectItem value="homework">Homework</SelectItem>
                                        <SelectItem value="exam">Exam</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="track">Track</Label>
                                <Select value={newAssignment.track} onValueChange={(value) => setNewAssignment({ ...newAssignment, track: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select track" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="frontend">Frontend Development</SelectItem>
                                        <SelectItem value="backend">Backend Development</SelectItem>
                                        <SelectItem value="fullstack">Full Stack Development</SelectItem>
                                        <SelectItem value="mobile">Mobile Development</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dueDate">Due Date</Label>
                                <Input
                                    id="dueDate"
                                    type="datetime-local"
                                    value={newAssignment.dueDate}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="totalStudents">Total Students</Label>
                                <Input
                                    id="totalStudents"
                                    type="number"
                                    placeholder="15"
                                    value={newAssignment.totalStudents}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, totalStudents: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={createAssignment}>
                            Create Assignment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 