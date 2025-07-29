import { useState, useEffect } from "react";
import {
    BookOpen,
    Play,
    FileText,
    Video,
    CheckCircle,
    Clock,
    Calendar,
    Users,
    BarChart3,
    Download,
    Eye,
    MoreHorizontal,
    ChevronDown,
    ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Course {
    id: string;
    title: string;
    description: string;
    track: string;
    instructor: string;
    progress: number;
    totalModules: number;
    completedModules: number;
    totalLessons: number;
    completedLessons: number;
    startDate: string;
    endDate: string;
    status: 'active' | 'completed' | 'upcoming';
    modules: CourseModule[];
}

interface CourseModule {
    id: string;
    title: string;
    description: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    duration: number;
    status: 'not_started' | 'in_progress' | 'completed';
    lessons: CourseLesson[];
}

interface CourseLesson {
    id: string;
    title: string;
    type: 'video' | 'reading' | 'quiz' | 'assignment' | 'project';
    duration: number;
    status: 'not_started' | 'in_progress' | 'completed';
    completedAt?: string;
    materials: CourseMaterial[];
}

interface CourseMaterial {
    id: string;
    title: string;
    type: 'video' | 'document' | 'presentation' | 'link' | 'recording';
    url?: string;
    size?: string;
    duration?: number;
    downloads: number;
}

export default function CourseManagement() {
    const { toast } = useToast();
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mock data - replace with actual API call
        const mockCourses: Course[] = [
            {
                id: "1",
                title: "JavaScript Fundamentals",
                description: "Learn the basics of JavaScript programming including variables, functions, and DOM manipulation",
                track: "frontend",
                instructor: "Dr. Sarah Chen",
                progress: 75,
                totalModules: 8,
                completedModules: 6,
                totalLessons: 24,
                completedLessons: 18,
                startDate: "2024-01-15",
                endDate: "2024-03-15",
                status: "active",
                modules: [
                    {
                        id: "1",
                        title: "Introduction to JavaScript",
                        description: "Basic concepts and setup",
                        progress: 100,
                        totalLessons: 3,
                        completedLessons: 3,
                        duration: 120,
                        status: "completed",
                        lessons: [
                            {
                                id: "1",
                                title: "What is JavaScript?",
                                type: "video",
                                duration: 15,
                                status: "completed",
                                completedAt: "2024-01-16T10:30:00Z",
                                materials: [
                                    {
                                        id: "1",
                                        title: "JavaScript Introduction Video",
                                        type: "video",
                                        duration: 15,
                                        downloads: 45
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "2",
                        title: "Variables and Data Types",
                        description: "Understanding variables, let, const, and var",
                        progress: 100,
                        totalLessons: 4,
                        completedLessons: 4,
                        duration: 180,
                        status: "completed",
                        lessons: [
                            {
                                id: "2",
                                title: "Variables: let, const, var",
                                type: "video",
                                duration: 20,
                                status: "completed",
                                completedAt: "2024-01-18T14:20:00Z",
                                materials: []
                            }
                        ]
                    },
                    {
                        id: "3",
                        title: "Functions and Scope",
                        description: "Function declarations, expressions, and scope",
                        progress: 50,
                        totalLessons: 5,
                        completedLessons: 2,
                        duration: 240,
                        status: "in_progress",
                        lessons: [
                            {
                                id: "3",
                                title: "Function Basics",
                                type: "video",
                                duration: 25,
                                status: "completed",
                                completedAt: "2024-01-20T09:15:00Z",
                                materials: []
                            },
                            {
                                id: "4",
                                title: "Function Expressions",
                                type: "reading",
                                duration: 30,
                                status: "completed",
                                completedAt: "2024-01-22T16:45:00Z",
                                materials: []
                            },
                            {
                                id: "5",
                                title: "Scope and Closures",
                                type: "video",
                                duration: 35,
                                status: "not_started",
                                materials: []
                            }
                        ]
                    }
                ]
            },
            {
                id: "2",
                title: "React Development",
                description: "Build modern web applications with React",
                track: "frontend",
                instructor: "Prof. Michael Davis",
                progress: 25,
                totalModules: 10,
                completedModules: 2,
                totalLessons: 30,
                completedLessons: 8,
                startDate: "2024-02-01",
                endDate: "2024-04-01",
                status: "active",
                modules: []
            }
        ];

        setCourses(mockCourses);
        setIsLoading(false);
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="default">Active</Badge>;
            case 'completed':
                return <Badge variant="secondary">Completed</Badge>;
            case 'upcoming':
                return <Badge variant="outline">Upcoming</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getLessonTypeIcon = (type: string) => {
        switch (type) {
            case 'video':
                return <Play className="h-4 w-4" />;
            case 'reading':
                return <FileText className="h-4 w-4" />;
            case 'quiz':
                return <BarChart3 className="h-4 w-4" />;
            case 'assignment':
                return <CheckCircle className="h-4 w-4" />;
            case 'project':
                return <BookOpen className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const getLessonStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'in_progress':
                return <Clock className="h-4 w-4 text-yellow-600" />;
            case 'not_started':
                return <Circle className="h-4 w-4 text-gray-400" />;
            default:
                return <Circle className="h-4 w-4 text-gray-400" />;
        }
    };

    const startLesson = (lessonId: string) => {
        toast({
            title: "Starting Lesson",
            description: "Opening lesson content...",
        });
    };

    const downloadMaterial = (materialId: string) => {
        toast({
            title: "Download Started",
            description: "Material is being downloaded...",
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
                    <h1 className="text-3xl font-bold">My Courses</h1>
                    <p className="text-muted-foreground">
                        Track your progress and access course content
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Progress Report
                    </Button>
                    <Button>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Browse Courses
                    </Button>
                </div>
            </div>

            {/* Course Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {courses.filter(c => c.status === 'active').length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Currently enrolled
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Average completion
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {courses.reduce((acc, c) => acc + c.completedLessons, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Total lessons finished
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Study Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24h</div>
                        <p className="text-xs text-muted-foreground">
                            This week
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Course List */}
            <div className="space-y-6">
                {courses.map((course) => (
                    <Card key={course.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CardTitle className="text-xl">{course.title}</CardTitle>
                                        {getStatusBadge(course.status)}
                                    </div>
                                    <CardDescription className="text-base">
                                        {course.description}
                                    </CardDescription>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                        <span>Instructor: {course.instructor}</span>
                                        <span>Track: {course.track}</span>
                                        <span>{course.totalLessons} lessons</span>
                                    </div>
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
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Materials
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <BarChart3 className="mr-2 h-4 w-4" />
                                            Progress Report
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Course Progress */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Course Progress</span>
                                    <span className="text-sm text-muted-foreground">
                                        {course.completedModules}/{course.totalModules} modules
                                    </span>
                                </div>
                                <Progress value={course.progress} className="h-2" />
                                <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                                    <span>{course.completedLessons}/{course.totalLessons} lessons completed</span>
                                    <span>{course.progress}% complete</span>
                                </div>
                            </div>

                            {/* Course Modules */}
                            <Accordion type="single" collapsible>
                                {course.modules.map((module) => (
                                    <AccordionItem key={module.id} value={module.id}>
                                        <AccordionTrigger className="hover:no-underline">
                                            <div className="flex items-center justify-between w-full pr-4">
                                                <div className="flex items-center gap-3">
                                                    {getLessonStatusIcon(module.status)}
                                                    <div className="text-left">
                                                        <div className="font-medium">{module.title}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {module.completedLessons}/{module.totalLessons} lessons
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={module.progress} className="w-20 h-2" />
                                                    <span className="text-sm font-medium">{module.progress}%</span>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-3 pt-4">
                                                {module.lessons.map((lesson) => (
                                                    <div
                                                        key={lesson.id}
                                                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {getLessonTypeIcon(lesson.type)}
                                                            <div>
                                                                <div className="font-medium">{lesson.title}</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {lesson.duration} min • {lesson.type}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {getLessonStatusIcon(lesson.status)}
                                                            <Button
                                                                size="sm"
                                                                variant={lesson.status === 'completed' ? 'outline' : 'default'}
                                                                onClick={() => startLesson(lesson.id)}
                                                            >
                                                                {lesson.status === 'completed' ? 'Review' : 'Start'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// Helper component for circle icon
function Circle({ className }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
    );
} 