import { useState, useEffect } from "react";
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    AlertCircle,
    Calendar,
    Download,
    Eye,
    Filter,
    Search,
    Award,
    Target
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { Label } from "@/components/ui/label";

interface Grade {
    id: string;
    assignmentId: string;
    assignmentTitle: string;
    course: string;
    type: 'quiz' | 'project' | 'homework' | 'exam';
    score: number;
    maxScore: number;
    percentage: number;
    grade: string;
    feedback: string;
    gradedAt: string;
    submittedAt: string;
    instructor: string;
    rubric?: string;
}

interface CourseGrade {
    course: string;
    totalAssignments: number;
    completedAssignments: number;
    averageScore: number;
    letterGrade: string;
    progress: number;
}

export default function GradesCenter() {
    const { toast } = useToast();
    const [grades, setGrades] = useState<Grade[]>([]);
    const [courseGrades, setCourseGrades] = useState<CourseGrade[]>([]);
    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [courseFilter, setCourseFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    useEffect(() => {
        // Mock data - replace with actual API call
        const mockGrades: Grade[] = [
            {
                id: "1",
                assignmentId: "1",
                assignmentTitle: "JavaScript Variables Quiz",
                course: "JavaScript Fundamentals",
                type: "quiz",
                score: 85,
                maxScore: 100,
                percentage: 85,
                grade: "B+",
                feedback: "Great work on variables! Consider reviewing scope concepts. You demonstrated good understanding of let, const, and var. Focus on understanding hoisting and temporal dead zone for the next quiz.",
                gradedAt: "2024-01-29T10:15:00Z",
                submittedAt: "2024-01-28T14:30:00Z",
                instructor: "Dr. Sarah Chen"
            },
            {
                id: "2",
                assignmentId: "2",
                assignmentTitle: "Array Methods Homework",
                course: "JavaScript Fundamentals",
                type: "homework",
                score: 92,
                maxScore: 100,
                percentage: 92,
                grade: "A-",
                feedback: "Excellent work! All array methods implemented correctly. Your use of map, filter, and reduce shows strong understanding. Consider exploring more advanced array methods for extra practice.",
                gradedAt: "2024-01-28T09:30:00Z",
                submittedAt: "2024-01-27T16:45:00Z",
                instructor: "Dr. Sarah Chen"
            },
            {
                id: "3",
                assignmentId: "3",
                assignmentTitle: "React Component Project",
                course: "React Development",
                type: "project",
                score: 88,
                maxScore: 100,
                percentage: 88,
                grade: "B+",
                feedback: "Good project structure and implementation. Components are well-organized and reusable. Consider adding more error handling and accessibility features for a higher score.",
                gradedAt: "2024-02-01T14:20:00Z",
                submittedAt: "2024-01-30T18:30:00Z",
                instructor: "Prof. Michael Davis"
            },
            {
                id: "4",
                assignmentId: "4",
                assignmentTitle: "DOM Manipulation Exercise",
                course: "JavaScript Fundamentals",
                type: "homework",
                score: 95,
                maxScore: 100,
                percentage: 95,
                grade: "A",
                feedback: "Outstanding work! Your DOM manipulation skills are excellent. Clean, efficient code with good error handling. You're ready for more advanced topics.",
                gradedAt: "2024-02-03T11:45:00Z",
                submittedAt: "2024-02-01T20:15:00Z",
                instructor: "Dr. Sarah Chen"
            }
        ];

        const mockCourseGrades: CourseGrade[] = [
            {
                course: "JavaScript Fundamentals",
                totalAssignments: 8,
                completedAssignments: 6,
                averageScore: 89,
                letterGrade: "B+",
                progress: 75
            },
            {
                course: "React Development",
                totalAssignments: 10,
                completedAssignments: 3,
                averageScore: 88,
                letterGrade: "B+",
                progress: 30
            }
        ];

        setGrades(mockGrades);
        setCourseGrades(mockCourseGrades);
        setIsLoading(false);
    }, []);

    const getGradeColor = (percentage: number) => {
        if (percentage >= 90) return "text-green-600";
        if (percentage >= 80) return "text-blue-600";
        if (percentage >= 70) return "text-yellow-600";
        return "text-red-600";
    };

    const getGradeBadge = (grade: string) => {
        const percentage = grades.find(g => g.grade === grade)?.percentage || 0;
        return (
            <Badge
                variant={percentage >= 90 ? "default" : percentage >= 80 ? "secondary" : "outline"}
                className={getGradeColor(percentage)}
            >
                {grade}
            </Badge>
        );
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

    const openDetailsDialog = (grade: Grade) => {
        setSelectedGrade(grade);
        setShowDetailsDialog(true);
    };

    const exportGrades = () => {
        toast({
            title: "Export Started",
            description: "Your grades are being exported to PDF.",
        });
    };

    const filteredGrades = grades.filter(grade => {
        const searchMatch = searchTerm === "" ||
            grade.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            grade.course.toLowerCase().includes(searchTerm.toLowerCase());
        const courseMatch = courseFilter === "all" || grade.course === courseFilter;
        const typeMatch = typeFilter === "all" || grade.type === typeFilter;
        return searchMatch && courseMatch && typeMatch;
    });

    const overallAverage = Math.round(grades.reduce((acc, g) => acc + g.percentage, 0) / grades.length);
    const totalAssignments = grades.length;
    const averageGrade = grades.length > 0 ?
        grades.reduce((acc, g) => acc + g.percentage, 0) / grades.length : 0;

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
                    <h1 className="text-3xl font-bold">My Grades</h1>
                    <p className="text-muted-foreground">
                        View your grades, feedback, and academic progress
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={exportGrades}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Grades
                    </Button>
                    <Button>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Progress Report
                    </Button>
                </div>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${getGradeColor(overallAverage)}`}>
                            {overallAverage}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Across all assignments
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalAssignments}</div>
                        <p className="text-xs text-muted-foreground">
                            Graded assignments
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3.7</div>
                        <p className="text-xs text-muted-foreground">
                            Grade Point Average
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Trend</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">+5%</div>
                        <p className="text-xs text-muted-foreground">
                            This semester
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Course Performance */}
            <Card>
                <CardHeader>
                    <CardTitle>Course Performance</CardTitle>
                    <CardDescription>
                        Your performance across different courses
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {courseGrades.map((course) => (
                            <div key={course.course} className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">{course.course}</h3>
                                    <Badge variant="outline">{course.letterGrade}</Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Progress</span>
                                        <span>{course.completedAssignments}/{course.totalAssignments} assignments</span>
                                    </div>
                                    <Progress value={course.progress} className="h-2" />
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Average Score: <span className="font-medium">{course.averageScore}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            <Label>Course</Label>
                            <Select value={courseFilter} onValueChange={setCourseFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All courses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Courses</SelectItem>
                                    {Array.from(new Set(grades.map(g => g.course))).map(course => (
                                        <SelectItem key={course} value={course}>{course}</SelectItem>
                                    ))}
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
                    </div>
                </CardContent>
            </Card>

            {/* Grades Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Assignment Grades ({filteredGrades.length})</CardTitle>
                    <CardDescription>
                        Detailed view of all your graded assignments
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Assignment</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredGrades.map((grade) => (
                                <TableRow key={grade.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{grade.assignmentTitle}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {grade.instructor}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{grade.course}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {getTypeBadge(grade.type)}
                                    </TableCell>
                                    <TableCell>
                                        <div className={`font-medium ${getGradeColor(grade.percentage)}`}>
                                            {grade.score}/{grade.maxScore}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {grade.percentage}%
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getGradeBadge(grade.grade)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {new Date(grade.gradedAt).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(grade.gradedAt).toLocaleTimeString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => openDetailsDialog(grade)}
                                        >
                                            <Eye className="mr-2 h-3 w-3" />
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Grade Details Dialog */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedGrade?.assignmentTitle}</DialogTitle>
                        <DialogDescription>
                            {selectedGrade?.course} • {selectedGrade?.instructor}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium">Type</Label>
                                <p className="text-sm text-muted-foreground">{selectedGrade?.type}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Grade</Label>
                                <p className="text-sm text-muted-foreground">{selectedGrade?.grade}</p>
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium">Score</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-lg font-bold ${getGradeColor(selectedGrade?.percentage || 0)}`}>
                                    {selectedGrade?.score}/{selectedGrade?.maxScore}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    ({selectedGrade?.percentage}%)
                                </span>
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-medium">Feedback</Label>
                            <div className="mt-2 p-3 bg-muted rounded-lg">
                                <p className="text-sm">{selectedGrade?.feedback}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-medium">Submitted</Label>
                                <p className="text-sm text-muted-foreground">
                                    {selectedGrade?.submittedAt ? new Date(selectedGrade.submittedAt).toLocaleDateString() : ''}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Graded</Label>
                                <p className="text-sm text-muted-foreground">
                                    {selectedGrade?.gradedAt ? new Date(selectedGrade.gradedAt).toLocaleDateString() : ''}
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
} 