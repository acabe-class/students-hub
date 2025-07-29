import { useState, useEffect } from "react";
import {
    FileText,
    Upload,
    CheckCircle,
    Clock,
    AlertCircle,
    Calendar,
    BarChart3,
    Download,
    Eye,
    Send,
    MoreHorizontal,
    Filter,
    Search
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
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
    course: string;
    dueDate: string;
    status: 'not_started' | 'in_progress' | 'submitted' | 'graded' | 'late';
    maxScore: number;
    score?: number;
    feedback?: string;
    submittedAt?: string;
    gradedAt?: string;
    files: string[];
    instructions: string;
    rubric?: string;
}

export default function AssignmentCenter() {
    const { toast } = useToast();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    // Submission form state
    const [submissionForm, setSubmissionForm] = useState({
        assignmentId: "",
        files: [] as File[],
        comments: ""
    });

    useEffect(() => {
        // Mock data - replace with actual API call
        const mockAssignments: Assignment[] = [
            {
                id: "1",
                title: "JavaScript Variables Quiz",
                description: "Test your understanding of JavaScript variables, let, const, and var",
                type: "quiz",
                course: "JavaScript Fundamentals",
                dueDate: "2024-01-30T23:59:59Z",
                status: "submitted",
                maxScore: 100,
                score: 85,
                feedback: "Great work on variables! Consider reviewing scope concepts.",
                submittedAt: "2024-01-28T14:30:00Z",
                gradedAt: "2024-01-29T10:15:00Z",
                files: ["quiz_answers.pdf"],
                instructions: "Complete the quiz covering JavaScript variables and data types."
            },
            {
                id: "2",
                title: "React Todo App Project",
                description: "Build a todo list application using React components and hooks",
                type: "project",
                course: "React Development",
                dueDate: "2024-02-05T23:59:59Z",
                status: "in_progress",
                maxScore: 100,
                files: [],
                instructions: "Create a functional todo app with add, delete, and mark complete features."
            },
            {
                id: "3",
                title: "Array Methods Homework",
                description: "Practice array methods like map, filter, reduce with practical examples",
                type: "homework",
                course: "JavaScript Fundamentals",
                dueDate: "2024-01-28T23:59:59Z",
                status: "graded",
                maxScore: 100,
                score: 92,
                feedback: "Excellent work! All array methods implemented correctly.",
                submittedAt: "2024-01-27T16:45:00Z",
                gradedAt: "2024-01-28T09:30:00Z",
                files: ["array-methods.js"],
                instructions: "Implement the required array methods and submit your code."
            },
            {
                id: "4",
                title: "DOM Manipulation Exercise",
                description: "Practice DOM manipulation techniques",
                type: "homework",
                course: "JavaScript Fundamentals",
                dueDate: "2024-02-02T23:59:59Z",
                status: "not_started",
                maxScore: 100,
                files: [],
                instructions: "Complete the DOM manipulation exercises in the provided HTML file."
            }
        ];

        setAssignments(mockAssignments);
        setIsLoading(false);
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'not_started':
                return <Badge variant="outline">Not Started</Badge>;
            case 'in_progress':
                return <Badge variant="secondary">In Progress</Badge>;
            case 'submitted':
                return <Badge variant="default">Submitted</Badge>;
            case 'graded':
                return <Badge variant="default">Graded</Badge>;
            case 'late':
                return <Badge variant="destructive">Late</Badge>;
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

    const getScoreColor = (score: number, maxScore: number) => {
        const percentage = (score / maxScore) * 100;
        if (percentage >= 90) return "text-green-600";
        if (percentage >= 80) return "text-blue-600";
        if (percentage >= 70) return "text-yellow-600";
        return "text-red-600";
    };

    const isOverdue = (dueDate: string) => {
        return new Date(dueDate) < new Date();
    };

    const getDaysUntilDue = (dueDate: string) => {
        const diffTime = new Date(dueDate).getTime() - new Date().getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const openSubmitDialog = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
        setSubmissionForm({
            assignmentId: assignment.id,
            files: [],
            comments: ""
        });
        setShowSubmitDialog(true);
    };

    const openDetailsDialog = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
        setShowDetailsDialog(true);
    };

    const submitAssignment = async () => {
        try {
            const updatedAssignments = assignments.map(assignment =>
                assignment.id === submissionForm.assignmentId
                    ? {
                        ...assignment,
                        status: "submitted",
                        submittedAt: new Date().toISOString(),
                        files: submissionForm.files.map(f => f.name)
                    }
                    : assignment
            );

            setAssignments(updatedAssignments);
            setShowSubmitDialog(false);
            setSubmissionForm({ assignmentId: "", files: [], comments: "" });

            toast({
                title: "Assignment Submitted",
                description: "Your assignment has been submitted successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit assignment.",
                variant: "destructive",
            });
        }
    };

    const filteredAssignments = assignments.filter(assignment => {
        const searchMatch = searchTerm === "" ||
            assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignment.course.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = statusFilter === "all" || assignment.status === statusFilter;
        const typeMatch = typeFilter === "all" || assignment.type === typeFilter;
        return searchMatch && statusMatch && typeMatch;
    });

    const pendingAssignments = assignments.filter(a => a.status === 'not_started' || a.status === 'in_progress').length;
    const submittedAssignments = assignments.filter(a => a.status === 'submitted').length;
    const gradedAssignments = assignments.filter(a => a.status === 'graded').length;
    const averageScore = Math.round(
        assignments
            .filter(a => a.score !== undefined)
            .reduce((acc, a) => acc + (a.score || 0), 0) / 
        assignments.filter(a => a.score !== undefined).length
    ) || 0;

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
                    <h1 className="text-3xl font-bold">Assignments</h1>
                    <p className="text-muted-foreground">
                        View, submit, and track your assignments
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Grades
                    </Button>
                    <Button>
                        <FileText className="mr-2 h-4 w-4" />
                        Submit Assignment
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingAssignments}</div>
                        <p className="text-xs text-muted-foreground">
                            Need attention
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Submitted</CardTitle>
                        <Send className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{submittedAssignments}</div>
                        <p className="text-xs text-muted-foreground">
                            Awaiting grading
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Graded</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{gradedAssignments}</div>
                        <p className="text-xs text-muted-foreground">
                            Completed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{averageScore}%</div>
                        <p className="text-xs text-muted-foreground">
                            Across all graded work
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
                                    placeholder="Search assignments..."
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
                                    <SelectItem value="not_started">Not Started</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="submitted">Submitted</SelectItem>
                                    <SelectItem value="graded">Graded</SelectItem>
                                    <SelectItem value="late">Late</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="quiz">Quiz</SelectItem>
                                    <SelectItem value="project">Project</SelectItem>
                                    <SelectItem value="homework">Homework</SelectItem>
                                    <SelectItem value="exam">Exam</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Actions</Label>
                            <Button variant="outline" className="w-full">
                                <Filter className="mr-2 h-4 w-4" />
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Assignments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssignments.map((assignment) => (
                    <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                                        {getTypeBadge(assignment.type)}
                                    </div>
                                    <CardDescription>{assignment.course}</CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => openDetailsDialog(assignment)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Details
                                        </DropdownMenuItem>
                                        {(assignment.status === 'not_started' || assignment.status === 'in_progress') && (
                                            <DropdownMenuItem onClick={() => openSubmitDialog(assignment)}>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Submit
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Instructions
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                {getStatusBadge(assignment.status)}
                            </div>

                            {assignment.score !== undefined && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Score</span>
                                    <span className={`font-medium ${getScoreColor(assignment.score, assignment.maxScore)}`}>
                                        {assignment.score}/{assignment.maxScore}
                                    </span>
                                </div>
                            )}

                            <div className="text-sm">
                                <span className="text-muted-foreground">Due Date</span>
                                <div className="font-medium">
                                    {new Date(assignment.dueDate).toLocaleDateString()}
                                </div>
                                {isOverdue(assignment.dueDate) && assignment.status !== 'submitted' && assignment.status !== 'graded' && (
                                    <div className="text-red-600 text-xs mt-1">
                                        Overdue by {Math.abs(getDaysUntilDue(assignment.dueDate))} days
                                    </div>
                                )}
                                {!isOverdue(assignment.dueDate) && assignment.status !== 'submitted' && assignment.status !== 'graded' && (
                                    <div className="text-muted-foreground text-xs mt-1">
                                        {getDaysUntilDue(assignment.dueDate)} days remaining
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => openDetailsDialog(assignment)}
                                >
                                    <Eye className="mr-2 h-3 w-3" />
                                    Details
                                </Button>
                                {(assignment.status === 'not_started' || assignment.status === 'in_progress') && (
                                    <Button
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => openSubmitDialog(assignment)}
                                    >
                                        <Upload className="mr-2 h-3 w-3" />
                                        Submit
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Submit Assignment Dialog */}
            <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit Assignment</DialogTitle>
                        <DialogDescription>
                            Submit your work for {selectedAssignment?.title}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="files">Upload Files</Label>
                            <Input
                                id="files"
                                type="file"
                                multiple
                                onChange={(e) => setSubmissionForm({
                                    ...submissionForm,
                                    files: Array.from(e.target.files || [])
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="comments">Comments (Optional)</Label>
                            <Textarea
                                id="comments"
                                placeholder="Add any comments about your submission..."
                                value={submissionForm.comments}
                                onChange={(e) => setSubmissionForm({
                                    ...submissionForm,
                                    comments: e.target.value
                                })}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={submitAssignment}>
                            Submit Assignment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Assignment Details Dialog */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedAssignment?.title}</DialogTitle>
                        <DialogDescription>
                            {selectedAssignment?.course}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium">Type</Label>
                                <p className="text-sm text-muted-foreground">{selectedAssignment?.type}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Due Date</Label>
                                <p className="text-sm text-muted-foreground">
                                    {selectedAssignment?.dueDate ? new Date(selectedAssignment.dueDate).toLocaleDateString() : ''}
                                </p>
                            </div>
                        </div>
                        
                        <div>
                            <Label className="text-sm font-medium">Instructions</Label>
                            <p className="text-sm text-muted-foreground mt-1">{selectedAssignment?.instructions}</p>
                        </div>

                        {selectedAssignment?.score !== undefined && (
                            <div className="p-3 bg-muted rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Grade</span>
                                    <span className={`font-bold ${getScoreColor(selectedAssignment.score, selectedAssignment.maxScore)}`}>
                                        {selectedAssignment.score}/{selectedAssignment.maxScore}
                                    </span>
                                </div>
                                {selectedAssignment.feedback && (
                                    <div className="text-sm text-muted-foreground">
                                        <strong>Feedback:</strong> {selectedAssignment.feedback}
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedAssignment?.files.length > 0 && (
                            <div>
                                <Label className="text-sm font-medium">Submitted Files</Label>
                                <div className="mt-2 space-y-1">
                                    {selectedAssignment.files.map((file, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <span>{file}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                            Close
                        </Button>
                        {(selectedAssignment?.status === 'not_started' || selectedAssignment?.status === 'in_progress') && (
                            <Button onClick={() => {
                                setShowDetailsDialog(false);
                                openSubmitDialog(selectedAssignment);
                            }}>
                                Submit Assignment
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 