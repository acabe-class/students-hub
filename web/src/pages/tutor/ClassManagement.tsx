import { useState, useEffect } from "react";
import {
    Plus,
    Video,
    FileText,
    Users,
    Calendar,
    Clock,
    Edit,
    Trash2,
    Eye,
    Upload,
    Download,
    Play,
    Pause,
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

interface Class {
    id: string;
    title: string;
    description: string;
    track: string;
    date: string;
    time: string;
    duration: number;
    type: 'virtual' | 'recorded' | 'live';
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    students: number;
    maxStudents: number;
    materials: Material[];
    assignments: Assignment[];
}

interface Material {
    id: string;
    title: string;
    type: 'document' | 'video' | 'presentation' | 'link';
    url?: string;
    uploadedAt: string;
    size: string;
    downloads: number;
}

interface Assignment {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    type: 'quiz' | 'project' | 'homework';
    status: 'draft' | 'published' | 'closed';
    submissions: number;
    totalStudents: number;
}

export default function ClassManagement() {
    const { toast } = useToast();
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showMaterialDialog, setShowMaterialDialog] = useState(false);
    const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Form states
    const [newClass, setNewClass] = useState({
        title: "",
        description: "",
        track: "",
        date: "",
        time: "",
        duration: 60,
        type: "virtual",
        maxStudents: 20
    });

    const [newMaterial, setNewMaterial] = useState({
        title: "",
        type: "document",
        file: null as File | null,
        url: ""
    });

    const [newAssignment, setNewAssignment] = useState({
        title: "",
        description: "",
        dueDate: "",
        type: "quiz"
    });

    useEffect(() => {
        // Mock data - replace with actual API call
        const mockClasses: Class[] = [
            {
                id: "1",
                title: "JavaScript Fundamentals",
                description: "Introduction to JavaScript basics, variables, functions, and DOM manipulation",
                track: "frontend",
                date: "2024-01-25",
                time: "10:00 AM",
                duration: 90,
                type: "virtual",
                status: "scheduled",
                students: 15,
                maxStudents: 20,
                materials: [
                    {
                        id: "1",
                        title: "JavaScript Basics Slides",
                        type: "presentation",
                        uploadedAt: "2024-01-20T10:00:00Z",
                        size: "2.5 MB",
                        downloads: 12
                    }
                ],
                assignments: [
                    {
                        id: "1",
                        title: "Variables and Functions Quiz",
                        description: "Test your understanding of JavaScript variables and functions",
                        dueDate: "2024-01-27T23:59:59Z",
                        type: "quiz",
                        status: "published",
                        submissions: 8,
                        totalStudents: 15
                    }
                ]
            },
            {
                id: "2",
                title: "React Hooks Deep Dive",
                description: "Advanced React hooks usage and best practices",
                track: "frontend",
                date: "2024-01-26",
                time: "2:00 PM",
                duration: 120,
                type: "live",
                status: "scheduled",
                students: 12,
                maxStudents: 15,
                materials: [],
                assignments: []
            }
        ];

        setClasses(mockClasses);
        setIsLoading(false);
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'scheduled':
                return <Badge variant="outline">Scheduled</Badge>;
            case 'ongoing':
                return <Badge variant="default">Live</Badge>;
            case 'completed':
                return <Badge variant="secondary">Completed</Badge>;
            case 'cancelled':
                return <Badge variant="destructive">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getTypeBadge = (type: string) => {
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

    const getMaterialTypeIcon = (type: string) => {
        switch (type) {
            case 'document':
                return <FileText className="h-4 w-4" />;
            case 'video':
                return <Video className="h-4 w-4" />;
            case 'presentation':
                return <BookOpen className="h-4 w-4" />;
            case 'link':
                return <MessageSquare className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const createClass = async () => {
        try {
            const classItem: Class = {
                id: Date.now().toString(),
                title: newClass.title,
                description: newClass.description,
                track: newClass.track,
                date: newClass.date,
                time: newClass.time,
                duration: newClass.duration,
                type: newClass.type as any,
                status: "scheduled",
                students: 0,
                maxStudents: newClass.maxStudents,
                materials: [],
                assignments: []
            };

            setClasses([...classes, classItem]);
            setShowCreateDialog(false);
            setNewClass({
                title: "",
                description: "",
                track: "",
                date: "",
                time: "",
                duration: 60,
                type: "virtual",
                maxStudents: 20
            });

            toast({
                title: "Class Created",
                description: "New class has been scheduled successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create class.",
                variant: "destructive",
            });
        }
    };

    const uploadMaterial = async () => {
        if (!selectedClass) return;

        try {
            const material: Material = {
                id: Date.now().toString(),
                title: newMaterial.title,
                type: newMaterial.type as any,
                uploadedAt: new Date().toISOString(),
                size: newMaterial.file ? `${(newMaterial.file.size / 1024 / 1024).toFixed(1)} MB` : "0 KB",
                downloads: 0
            };

            const updatedClasses = classes.map(classItem =>
                classItem.id === selectedClass.id
                    ? { ...classItem, materials: [...classItem.materials, material] }
                    : classItem
            );

            setClasses(updatedClasses);
            setShowMaterialDialog(false);
            setNewMaterial({ title: "", type: "document", file: null, url: "" });

            toast({
                title: "Material Uploaded",
                description: "Class material has been uploaded successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload material.",
                variant: "destructive",
            });
        }
    };

    const createAssignment = async () => {
        if (!selectedClass) return;

        try {
            const assignment: Assignment = {
                id: Date.now().toString(),
                title: newAssignment.title,
                description: newAssignment.description,
                dueDate: newAssignment.dueDate,
                type: newAssignment.type as any,
                status: "draft",
                submissions: 0,
                totalStudents: selectedClass.students
            };

            const updatedClasses = classes.map(classItem =>
                classItem.id === selectedClass.id
                    ? { ...classItem, assignments: [...classItem.assignments, assignment] }
                    : classItem
            );

            setClasses(updatedClasses);
            setShowAssignmentDialog(false);
            setNewAssignment({ title: "", description: "", dueDate: "", type: "quiz" });

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

    const startClass = (classId: string) => {
        const updatedClasses = classes.map(classItem =>
            classItem.id === classId
                ? { ...classItem, status: "ongoing" }
                : classItem
        );
        setClasses(updatedClasses);
        toast({
            title: "Class Started",
            description: "Your class is now live.",
        });
    };

    const deleteClass = (classId: string) => {
        setClasses(classes.filter(classItem => classId !== classItem.id));
        toast({
            title: "Class Deleted",
            description: "Class has been deleted successfully.",
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
                    <h1 className="text-3xl font-bold">Class Management</h1>
                    <p className="text-muted-foreground">
                        Create and manage your teaching sessions, materials, and assignments
                    </p>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Class
                </Button>
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((classItem) => (
                    <Card key={classItem.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">{classItem.title}</CardTitle>
                                    <CardDescription>{classItem.track}</CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => setSelectedClass(classItem)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Class
                                        </DropdownMenuItem>
                                        {classItem.status === "scheduled" && (
                                            <DropdownMenuItem onClick={() => startClass(classItem.id)}>
                                                <Play className="mr-2 h-4 w-4" />
                                                Start Class
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() => deleteClass(classItem.id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Class
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                {getStatusBadge(classItem.status)}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Type</span>
                                {getTypeBadge(classItem.type)}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Students</span>
                                    <div className="font-medium">{classItem.students}/{classItem.maxStudents}</div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Duration</span>
                                    <div className="font-medium">{classItem.duration} min</div>
                                </div>
                            </div>

                            <div className="text-sm">
                                <span className="text-muted-foreground">Date & Time</span>
                                <div className="font-medium">
                                    {new Date(classItem.date).toLocaleDateString()} at {classItem.time}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => {
                                        setSelectedClass(classItem);
                                        setShowMaterialDialog(true);
                                    }}
                                >
                                    <Upload className="mr-2 h-3 w-3" />
                                    Upload
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => {
                                        setSelectedClass(classItem);
                                        setShowAssignmentDialog(true);
                                    }}
                                >
                                    <FileText className="mr-2 h-3 w-3" />
                                    Assignment
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Create Class Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Class</DialogTitle>
                        <DialogDescription>
                            Schedule a new teaching session with your students
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Class Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g., JavaScript Fundamentals"
                                value={newClass.title}
                                onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe what this class will cover..."
                                value={newClass.description}
                                onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="track">Track</Label>
                                <Select value={newClass.track} onValueChange={(value) => setNewClass({ ...newClass, track: value })}>
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
                            <div className="space-y-2">
                                <Label htmlFor="type">Class Type</Label>
                                <Select value={newClass.type} onValueChange={(value) => setNewClass({ ...newClass, type: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="virtual">Virtual</SelectItem>
                                        <SelectItem value="live">Live</SelectItem>
                                        <SelectItem value="recorded">Recorded</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={newClass.date}
                                    onChange={(e) => setNewClass({ ...newClass, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={newClass.time}
                                    onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration (min)</Label>
                                <Input
                                    id="duration"
                                    type="number"
                                    placeholder="60"
                                    value={newClass.duration}
                                    onChange={(e) => setNewClass({ ...newClass, duration: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxStudents">Maximum Students</Label>
                            <Input
                                id="maxStudents"
                                type="number"
                                placeholder="20"
                                value={newClass.maxStudents}
                                onChange={(e) => setNewClass({ ...newClass, maxStudents: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={createClass}>
                            Create Class
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Upload Material Dialog */}
            <Dialog open={showMaterialDialog} onOpenChange={setShowMaterialDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload Class Material</DialogTitle>
                        <DialogDescription>
                            Add materials for {selectedClass?.title}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="materialTitle">Material Title</Label>
                            <Input
                                id="materialTitle"
                                placeholder="e.g., JavaScript Basics Slides"
                                value={newMaterial.title}
                                onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="materialType">Material Type</Label>
                            <Select value={newMaterial.type} onValueChange={(value) => setNewMaterial({ ...newMaterial, type: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="document">Document</SelectItem>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="presentation">Presentation</SelectItem>
                                    <SelectItem value="link">Link</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {newMaterial.type === "link" ? (
                            <div className="space-y-2">
                                <Label htmlFor="url">URL</Label>
                                <Input
                                    id="url"
                                    type="url"
                                    placeholder="https://..."
                                    value={newMaterial.url}
                                    onChange={(e) => setNewMaterial({ ...newMaterial, url: e.target.value })}
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="file">File</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    onChange={(e) => setNewMaterial({ ...newMaterial, file: e.target.files?.[0] || null })}
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowMaterialDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={uploadMaterial}>
                            Upload Material
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Assignment Dialog */}
            <Dialog open={showAssignmentDialog} onOpenChange={setShowAssignmentDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Assignment</DialogTitle>
                        <DialogDescription>
                            Create a new assignment for {selectedClass?.title}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="assignmentTitle">Assignment Title</Label>
                            <Input
                                id="assignmentTitle"
                                placeholder="e.g., JavaScript Variables Quiz"
                                value={newAssignment.title}
                                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="assignmentDescription">Description</Label>
                            <Textarea
                                id="assignmentDescription"
                                placeholder="Describe the assignment requirements..."
                                value={newAssignment.description}
                                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="assignmentType">Type</Label>
                                <Select value={newAssignment.type} onValueChange={(value) => setNewAssignment({ ...newAssignment, type: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="quiz">Quiz</SelectItem>
                                        <SelectItem value="project">Project</SelectItem>
                                        <SelectItem value="homework">Homework</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dueDate">Due Date</Label>
                                <Input
                                    id="dueDate"
                                    type="datetime-local"
                                    value={newAssignment.dueDate}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAssignmentDialog(false)}>
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