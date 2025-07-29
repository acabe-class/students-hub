import { useState, useEffect } from "react";
import {
    CheckCircle,
    Clock,
    FileText,
    Users,
    Star,
    Eye,
    Download,
    Send,
    MessageSquare,
    BarChart3,
    Filter,
    Search
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Submission {
    id: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    assignmentId: string;
    assignmentTitle: string;
    assignmentType: 'quiz' | 'project' | 'homework' | 'exam';
    submittedAt: string;
    status: 'submitted' | 'graded' | 'late';
    score?: number;
    maxScore: number;
    feedback?: string;
    files: string[];
    track: string;
}

export default function GradingManagement() {
    const { toast } = useToast();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [showGradingDialog, setShowGradingDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    // Grading form state
    const [gradingForm, setGradingForm] = useState({
        score: 0,
        maxScore: 100,
        feedback: ""
    });

    useEffect(() => {
        // Mock data - replace with actual API call
        const mockSubmissions: Submission[] = [
            {
                id: "1",
                studentId: "1",
                studentName: "Sarah Chen",
                studentEmail: "sarah.chen@example.com",
                assignmentId: "1",
                assignmentTitle: "JavaScript Variables Quiz",
                assignmentType: "quiz",
                submittedAt: "2024-01-25T14:30:00Z",
                status: "submitted",
                maxScore: 100,
                files: ["quiz_answers.pdf"],
                track: "frontend"
            },
            {
                id: "2",
                studentId: "2",
                studentName: "Michael Davis",
                studentEmail: "michael.davis@example.com",
                assignmentId: "1",
                assignmentTitle: "JavaScript Variables Quiz",
                assignmentType: "quiz",
                submittedAt: "2024-01-25T16:45:00Z",
                status: "graded",
                score: 85,
                maxScore: 100,
                feedback: "Great work on variables! Consider reviewing scope concepts.",
                files: ["quiz_answers.pdf"],
                track: "frontend"
            },
            {
                id: "3",
                studentId: "3",
                studentName: "Emma Wilson",
                studentEmail: "emma.wilson@example.com",
                assignmentId: "2",
                assignmentTitle: "React Component Project",
                assignmentType: "project",
                submittedAt: "2024-01-28T10:15:00Z",
                status: "submitted",
                maxScore: 100,
                files: ["todo-app.zip", "README.md"],
                track: "frontend"
            },
            {
                id: "4",
                studentId: "1",
                studentName: "Sarah Chen",
                studentEmail: "sarah.chen@example.com",
                assignmentId: "3",
                assignmentTitle: "Array Methods Homework",
                assignmentType: "homework",
                submittedAt: "2024-01-27T23:45:00Z",
                status: "late",
                score: 92,
                maxScore: 100,
                feedback: "Excellent work! All array methods implemented correctly.",
                files: ["array-methods.js"],
                track: "frontend"
            }
        ];

        setSubmissions(mockSubmissions);
        setIsLoading(false);
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'submitted':
                return <Badge variant="secondary">Pending</Badge>;
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

    const openGradingDialog = (submission: Submission) => {
        setSelectedSubmission(submission);
        setGradingForm({
            score: submission.score || 0,
            maxScore: submission.maxScore,
            feedback: submission.feedback || ""
        });
        setShowGradingDialog(true);
    };

    const submitGrade = async () => {
        if (!selectedSubmission) return;

        try {
            const updatedSubmissions = submissions.map(submission =>
                submission.id === selectedSubmission.id
                    ? {
                        ...submission,
                        status: "graded",
                        score: gradingForm.score,
                        feedback: gradingForm.feedback
                    }
                    : submission
            );

            setSubmissions(updatedSubmissions);
            setShowGradingDialog(false);
            setSelectedSubmission(null);

            toast({
                title: "Grade Submitted",
                description: "Student grade has been recorded successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit grade.",
                variant: "destructive",
            });
        }
    };

    const filteredSubmissions = submissions.filter(submission => {
        const searchMatch = searchTerm === "" ||
            submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = statusFilter === "all" || submission.status === statusFilter;
        const typeMatch = typeFilter === "all" || submission.assignmentType === typeFilter;
        return searchMatch && statusMatch && typeMatch;
    });

    const pendingGrading = submissions.filter(s => s.status === 'submitted').length;
    const gradedCount = submissions.filter(s => s.status === 'graded').length;
    const averageScore = Math.round(
        submissions
            .filter(s => s.score !== undefined)
            .reduce((acc, s) => acc + (s.score || 0), 0) /
        submissions.filter(s => s.score !== undefined).length
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
                    <h1 className="text-3xl font-bold">Grading Management</h1>
                    <p className="text-muted-foreground">
                        Review and grade student submissions
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export Grades
                    </Button>
                    <Button>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        View Analytics
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingGrading}</div>
                        <p className="text-xs text-muted-foreground">
                            Require attention
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Graded</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{gradedCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Completed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{averageScore}%</div>
                        <p className="text-xs text-muted-foreground">
                            Across all graded work
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{submissions.length}</div>
                        <p className="text-xs text-muted-foreground">
                            All assignments
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
                                    placeholder="Search by student or assignment..."
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
                                    <SelectItem value="submitted">Pending</SelectItem>
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

            {/* Submissions Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Submissions ({filteredSubmissions.length})</CardTitle>
                            <CardDescription>
                                Review and grade student work
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Assignment</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSubmissions.map((submission) => (
                                <TableRow key={submission.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{submission.studentName}</div>
                                            <div className="text-sm text-muted-foreground">{submission.studentEmail}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{submission.assignmentTitle}</div>
                                        <div className="text-sm text-muted-foreground">{submission.track}</div>
                                    </TableCell>
                                    <TableCell>
                                        {getTypeBadge(submission.assignmentType)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {new Date(submission.submittedAt).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(submission.submittedAt).toLocaleTimeString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(submission.status)}
                                    </TableCell>
                                    <TableCell>
                                        {submission.score !== undefined ? (
                                            <div className={`font-medium ${getScoreColor(submission.score, submission.maxScore)}`}>
                                                {submission.score}/{submission.maxScore}
                                            </div>
                                        ) : (
                                            <div className="text-muted-foreground">-</div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => openGradingDialog(submission)}
                                            >
                                                {submission.status === 'graded' ? (
                                                    <>
                                                        <Eye className="mr-2 h-3 w-3" />
                                                        View
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle className="mr-2 h-3 w-3" />
                                                        Grade
                                                    </>
                                                )}
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <Download className="mr-2 h-3 w-3" />
                                                Files
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Grading Dialog */}
            <Dialog open={showGradingDialog} onOpenChange={setShowGradingDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Grade Submission</DialogTitle>
                        <DialogDescription>
                            Review and grade {selectedSubmission?.studentName}'s work
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium">Student</Label>
                                <p className="text-sm text-muted-foreground">{selectedSubmission?.studentName}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Assignment</Label>
                                <p className="text-sm text-muted-foreground">{selectedSubmission?.assignmentTitle}</p>
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium">Submitted Files</Label>
                            <div className="mt-2 space-y-1">
                                {selectedSubmission?.files.map((file, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span>{file}</span>
                                        <Button size="sm" variant="ghost">
                                            <Download className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="score">Score</Label>
                                <Input
                                    id="score"
                                    type="number"
                                    min="0"
                                    max={gradingForm.maxScore}
                                    value={gradingForm.score}
                                    onChange={(e) => setGradingForm({ ...gradingForm, score: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxScore">Max Score</Label>
                                <Input
                                    id="maxScore"
                                    type="number"
                                    value={gradingForm.maxScore}
                                    onChange={(e) => setGradingForm({ ...gradingForm, maxScore: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="feedback">Feedback</Label>
                            <Textarea
                                id="feedback"
                                placeholder="Provide constructive feedback..."
                                value={gradingForm.feedback}
                                onChange={(e) => setGradingForm({ ...gradingForm, feedback: e.target.value })}
                                rows={4}
                            />
                        </div>

                        {gradingForm.score > 0 && (
                            <div className="p-3 bg-muted rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Grade Percentage</span>
                                    <span className={`font-bold ${getScoreColor(gradingForm.score, gradingForm.maxScore)}`}>
                                        {Math.round((gradingForm.score / gradingForm.maxScore) * 100)}%
                                    </span>
                                </div>
                                <Progress
                                    value={(gradingForm.score / gradingForm.maxScore) * 100}
                                    className="mt-2"
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowGradingDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={submitGrade}>
                            Submit Grade
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 