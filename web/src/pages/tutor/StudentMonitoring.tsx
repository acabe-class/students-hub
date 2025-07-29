import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    Users,
    TrendingUp,
    TrendingDown,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Mail,
    MessageSquare,
    BarChart3,
    Calendar,
    Eye,
    MoreHorizontal,
    Send,
    Download
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Student {
    id: string;
    name: string;
    email: string;
    track: string;
    cohort: string;
    joinDate: string;
    attendance: number;
    assignmentsCompleted: number;
    totalAssignments: number;
    averageScore: number;
    lastActive: string;
    status: 'active' | 'inactive' | 'at_risk';
    progress: number;
}

interface AttendanceRecord {
    id: string;
    studentId: string;
    studentName: string;
    classTitle: string;
    date: string;
    status: 'present' | 'absent' | 'late';
    notes?: string;
}

interface Message {
    id: string;
    studentId: string;
    studentName: string;
    subject: string;
    content: string;
    sentAt: string;
    read: boolean;
}

export default function StudentMonitoring() {
    const { toast } = useToast();
    const [students, setStudents] = useState<Student[]>([]);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [showMessageDialog, setShowMessageDialog] = useState(false);
    const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [trackFilter, setTrackFilter] = useState("all");

    // Form states
    const [newMessage, setNewMessage] = useState({
        subject: "",
        content: "",
        studentId: ""
    });

    const [attendanceUpdate, setAttendanceUpdate] = useState({
        studentId: "",
        classTitle: "",
        date: "",
        status: "present",
        notes: ""
    });

    useEffect(() => {
        // Mock data - replace with actual API calls
        const mockStudents: Student[] = [
            {
                id: "1",
                name: "Sarah Chen",
                email: "sarah.chen@example.com",
                track: "frontend",
                cohort: "Cohort 5",
                joinDate: "2024-01-15",
                attendance: 85,
                assignmentsCompleted: 12,
                totalAssignments: 15,
                averageScore: 88,
                lastActive: "2024-01-24T10:30:00Z",
                status: "active",
                progress: 80
            },
            {
                id: "2",
                name: "Michael Davis",
                email: "michael.davis@example.com",
                track: "frontend",
                cohort: "Cohort 5",
                joinDate: "2024-01-15",
                attendance: 60,
                assignmentsCompleted: 8,
                totalAssignments: 15,
                averageScore: 72,
                lastActive: "2024-01-23T14:20:00Z",
                status: "at_risk",
                progress: 53
            },
            {
                id: "3",
                name: "Emma Wilson",
                email: "emma.wilson@example.com",
                track: "backend",
                cohort: "Cohort 6",
                joinDate: "2024-02-01",
                attendance: 95,
                assignmentsCompleted: 10,
                totalAssignments: 12,
                averageScore: 94,
                lastActive: "2024-01-24T16:45:00Z",
                status: "active",
                progress: 83
            }
        ];

        const mockAttendance: AttendanceRecord[] = [
            {
                id: "1",
                studentId: "1",
                studentName: "Sarah Chen",
                classTitle: "JavaScript Fundamentals",
                date: "2024-01-24",
                status: "present"
            },
            {
                id: "2",
                studentId: "2",
                studentName: "Michael Davis",
                classTitle: "JavaScript Fundamentals",
                date: "2024-01-24",
                status: "absent",
                notes: "No prior notification"
            }
        ];

        const mockMessages: Message[] = [
            {
                id: "1",
                studentId: "2",
                studentName: "Michael Davis",
                subject: "Missing Assignments",
                content: "Hi Michael, I noticed you haven't submitted the last 3 assignments. Let me know if you need help!",
                sentAt: "2024-01-23T09:00:00Z",
                read: false
            }
        ];

        setStudents(mockStudents);
        setAttendanceRecords(mockAttendance);
        setMessages(mockMessages);
        setIsLoading(false);
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="default">Active</Badge>;
            case 'inactive':
                return <Badge variant="secondary">Inactive</Badge>;
            case 'at_risk':
                return <Badge variant="destructive">At Risk</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getAttendanceStatusBadge = (status: string) => {
        switch (status) {
            case 'present':
                return <Badge variant="default">Present</Badge>;
            case 'absent':
                return <Badge variant="destructive">Absent</Badge>;
            case 'late':
                return <Badge variant="secondary">Late</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 80) return "text-green-600";
        if (progress >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    const sendMessage = async () => {
        try {
            const message: Message = {
                id: Date.now().toString(),
                studentId: newMessage.studentId,
                studentName: students.find(s => s.id === newMessage.studentId)?.name || "",
                subject: newMessage.subject,
                content: newMessage.content,
                sentAt: new Date().toISOString(),
                read: false
            };

            setMessages([message, ...messages]);
            setShowMessageDialog(false);
            setNewMessage({ subject: "", content: "", studentId: "" });

            toast({
                title: "Message Sent",
                description: "Your message has been sent to the student.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message.",
                variant: "destructive",
            });
        }
    };

    const updateAttendance = async () => {
        try {
            const record: AttendanceRecord = {
                id: Date.now().toString(),
                studentId: attendanceUpdate.studentId,
                studentName: students.find(s => s.id === attendanceUpdate.studentId)?.name || "",
                classTitle: attendanceUpdate.classTitle,
                date: attendanceUpdate.date,
                status: attendanceUpdate.status as any,
                notes: attendanceUpdate.notes
            };

            setAttendanceRecords([...attendanceRecords, record]);
            setShowAttendanceDialog(false);
            setAttendanceUpdate({ studentId: "", classTitle: "", date: "", status: "present", notes: "" });

            toast({
                title: "Attendance Updated",
                description: "Attendance record has been updated.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update attendance.",
                variant: "destructive",
            });
        }
    };

    const exportStudentData = () => {
        toast({
            title: "Export Started",
            description: "Student data is being exported to CSV.",
        });
    };

    const filteredStudents = students.filter(student => {
        const searchMatch = searchTerm === "" ||
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = statusFilter === "all" || student.status === statusFilter;
        const trackMatch = trackFilter === "all" || student.track === trackFilter;
        return searchMatch && statusMatch && trackMatch;
    });

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
                    <h1 className="text-3xl font-bold">Student Monitoring</h1>
                    <p className="text-muted-foreground">
                        Track student progress, attendance, and send personalized messages
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={exportStudentData}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                    </Button>
                    <Button onClick={() => setShowMessageDialog(true)}>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
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
                        <div className="text-2xl font-bold">{students.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Across all tracks
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            This month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">At Risk Students</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {students.filter(s => s.status === 'at_risk').length}
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
                            {Math.round(students.reduce((acc, s) => acc + s.averageScore, 0) / students.length)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Across all assignments
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
                                    placeholder="Search by name or email..."
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
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="at_risk">At Risk</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Track</Label>
                            <Select value={trackFilter} onValueChange={setTrackFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All tracks" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Tracks</SelectItem>
                                    <SelectItem value="frontend">Frontend</SelectItem>
                                    <SelectItem value="backend">Backend</SelectItem>
                                    <SelectItem value="fullstack">Full Stack</SelectItem>
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

            {/* Students Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Students ({filteredStudents.length})</CardTitle>
                            <CardDescription>
                                Monitor student progress and performance
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Track</TableHead>
                                <TableHead>Attendance</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead>Average Score</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{student.name}</div>
                                            <div className="text-sm text-muted-foreground">{student.email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {student.track}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Progress value={student.attendance} className="w-20" />
                                            <span className="text-sm font-medium">{student.attendance}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Progress value={student.progress} className="w-20" />
                                            <span className={`text-sm font-medium ${getProgressColor(student.progress)}`}>
                                                {student.progress}%
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-medium">{student.averageScore}%</div>
                                        <div className="text-xs text-muted-foreground">
                                            {student.assignmentsCompleted}/{student.totalAssignments} assignments
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(student.status)}
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
                                                <DropdownMenuItem onClick={() => setSelectedStudent(student)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                    setNewMessage({ ...newMessage, studentId: student.id });
                                                    setShowMessageDialog(true);
                                                }}>
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    Send Message
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                    setAttendanceUpdate({ ...attendanceUpdate, studentId: student.id });
                                                    setShowAttendanceDialog(true);
                                                }}>
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    Update Attendance
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

            {/* Recent Messages */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Messages</CardTitle>
                    <CardDescription>
                        Your recent communications with students
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {messages.slice(0, 5).map((message) => (
                            <div key={message.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <MessageSquare className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-medium">{message.subject}</h4>
                                        <Badge variant={message.read ? "secondary" : "default"}>
                                            {message.read ? "Read" : "Unread"}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">{message.content}</p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>To: {message.studentName}</span>
                                        <span>{new Date(message.sentAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Send Message Dialog */}
            <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Message to Student</DialogTitle>
                        <DialogDescription>
                            Send a personalized message to a student
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="student">Student</Label>
                            <Select value={newMessage.studentId} onValueChange={(value) => setNewMessage({ ...newMessage, studentId: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select student" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map((student) => (
                                        <SelectItem key={student.id} value={student.id}>
                                            {student.name} ({student.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                placeholder="Enter message subject..."
                                value={newMessage.subject}
                                onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Message</Label>
                            <Textarea
                                id="content"
                                placeholder="Enter your message..."
                                value={newMessage.content}
                                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={sendMessage}>
                            Send Message
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Update Attendance Dialog */}
            <Dialog open={showAttendanceDialog} onOpenChange={setShowAttendanceDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Attendance</DialogTitle>
                        <DialogDescription>
                            Record attendance for a student
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="attendanceStudent">Student</Label>
                            <Select value={attendanceUpdate.studentId} onValueChange={(value) => setAttendanceUpdate({ ...attendanceUpdate, studentId: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select student" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map((student) => (
                                        <SelectItem key={student.id} value={student.id}>
                                            {student.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="classTitle">Class</Label>
                            <Input
                                id="classTitle"
                                placeholder="e.g., JavaScript Fundamentals"
                                value={attendanceUpdate.classTitle}
                                onChange={(e) => setAttendanceUpdate({ ...attendanceUpdate, classTitle: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="attendanceDate">Date</Label>
                                <Input
                                    id="attendanceDate"
                                    type="date"
                                    value={attendanceUpdate.date}
                                    onChange={(e) => setAttendanceUpdate({ ...attendanceUpdate, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="attendanceStatus">Status</Label>
                                <Select value={attendanceUpdate.status} onValueChange={(value) => setAttendanceUpdate({ ...attendanceUpdate, status: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="present">Present</SelectItem>
                                        <SelectItem value="absent">Absent</SelectItem>
                                        <SelectItem value="late">Late</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                placeholder="Add any notes about the attendance..."
                                value={attendanceUpdate.notes}
                                onChange={(e) => setAttendanceUpdate({ ...attendanceUpdate, notes: e.target.value })}
                                rows={2}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAttendanceDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={updateAttendance}>
                            Update Attendance
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 