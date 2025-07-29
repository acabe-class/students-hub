import { useState, useEffect } from "react";
import {
    Send,
    MessageSquare,
    Users,
    Search,
    Filter,
    Clock,
    CheckCircle,
    Eye,
    Reply,
    Archive,
    Trash2,
    MoreHorizontal,
    Mail,
    UserPlus
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

interface Message {
    id: string;
    subject: string;
    content: string;
    senderId: string;
    senderName: string;
    senderEmail: string;
    recipientId: string;
    recipientName: string;
    recipientEmail: string;
    sentAt: string;
    readAt?: string;
    status: 'sent' | 'delivered' | 'read';
    type: 'individual' | 'group' | 'announcement';
    priority: 'low' | 'medium' | 'high';
}

interface Student {
    id: string;
    name: string;
    email: string;
    track: string;
    cohort: string;
}

export default function MessagesManagement() {
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [showComposeDialog, setShowComposeDialog] = useState(false);
    const [showReplyDialog, setShowReplyDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");

    // Form states
    const [composeForm, setComposeForm] = useState({
        subject: "",
        content: "",
        recipientId: "",
        type: "individual",
        priority: "medium"
    });

    const [replyForm, setReplyForm] = useState({
        content: ""
    });

    useEffect(() => {
        // Mock data - replace with actual API calls
        const mockMessages: Message[] = [
            {
                id: "1",
                subject: "Question about JavaScript Assignment",
                content: "Hi, I'm having trouble with the array methods assignment. Could you help me understand the reduce function better?",
                senderId: "1",
                senderName: "Sarah Chen",
                senderEmail: "sarah.chen@example.com",
                recipientId: "tutor1",
                recipientName: "Tutor",
                recipientEmail: "tutor@example.com",
                sentAt: "2024-01-25T10:30:00Z",
                readAt: "2024-01-25T11:15:00Z",
                status: "read",
                type: "individual",
                priority: "medium"
            },
            {
                id: "2",
                subject: "React Project Submission",
                content: "I've completed the React todo app project. Please let me know if you need any clarification on my implementation.",
                senderId: "2",
                senderName: "Michael Davis",
                senderEmail: "michael.davis@example.com",
                recipientId: "tutor1",
                recipientName: "Tutor",
                recipientEmail: "tutor@example.com",
                sentAt: "2024-01-26T14:20:00Z",
                status: "delivered",
                type: "individual",
                priority: "low"
            },
            {
                id: "3",
                subject: "Weekly Cohort Update",
                content: "This week we'll be covering advanced React concepts including Context API and custom hooks. Please review the materials before our next session.",
                senderId: "tutor1",
                senderName: "Tutor",
                senderEmail: "tutor@example.com",
                recipientId: "cohort5",
                recipientName: "Cohort 5",
                recipientEmail: "cohort5@example.com",
                sentAt: "2024-01-24T09:00:00Z",
                status: "sent",
                type: "announcement",
                priority: "high"
            }
        ];

        const mockStudents: Student[] = [
            {
                id: "1",
                name: "Sarah Chen",
                email: "sarah.chen@example.com",
                track: "frontend",
                cohort: "Cohort 5"
            },
            {
                id: "2",
                name: "Michael Davis",
                email: "michael.davis@example.com",
                track: "frontend",
                cohort: "Cohort 5"
            },
            {
                id: "3",
                name: "Emma Wilson",
                email: "emma.wilson@example.com",
                track: "backend",
                cohort: "Cohort 6"
            }
        ];

        setMessages(mockMessages);
        setStudents(mockStudents);
        setIsLoading(false);
    }, []);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'sent':
                return <Badge variant="outline">Sent</Badge>;
            case 'delivered':
                return <Badge variant="secondary">Delivered</Badge>;
            case 'read':
                return <Badge variant="default">Read</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'individual':
                return <Badge variant="default">Individual</Badge>;
            case 'group':
                return <Badge variant="secondary">Group</Badge>;
            case 'announcement':
                return <Badge variant="outline">Announcement</Badge>;
            default:
                return <Badge variant="outline">{type}</Badge>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'low':
                return <Badge variant="outline">Low</Badge>;
            case 'medium':
                return <Badge variant="default">Medium</Badge>;
            case 'high':
                return <Badge variant="destructive">High</Badge>;
            default:
                return <Badge variant="outline">{priority}</Badge>;
        }
    };

    const sendMessage = async () => {
        try {
            const message: Message = {
                id: Date.now().toString(),
                subject: composeForm.subject,
                content: composeForm.content,
                senderId: "tutor1",
                senderName: "Tutor",
                senderEmail: "tutor@example.com",
                recipientId: composeForm.recipientId,
                recipientName: students.find(s => s.id === composeForm.recipientId)?.name || "Student",
                recipientEmail: students.find(s => s.id === composeForm.recipientId)?.email || "",
                sentAt: new Date().toISOString(),
                status: "sent",
                type: composeForm.type as any,
                priority: composeForm.priority as any
            };

            setMessages([message, ...messages]);
            setShowComposeDialog(false);
            setComposeForm({
                subject: "",
                content: "",
                recipientId: "",
                type: "individual",
                priority: "medium"
            });

            toast({
                title: "Message Sent",
                description: "Your message has been sent successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message.",
                variant: "destructive",
            });
        }
    };

    const replyToMessage = async () => {
        if (!selectedMessage) return;

        try {
            const reply: Message = {
                id: Date.now().toString(),
                subject: `Re: ${selectedMessage.subject}`,
                content: replyForm.content,
                senderId: "tutor1",
                senderName: "Tutor",
                senderEmail: "tutor@example.com",
                recipientId: selectedMessage.senderId,
                recipientName: selectedMessage.senderName,
                recipientEmail: selectedMessage.senderEmail,
                sentAt: new Date().toISOString(),
                status: "sent",
                type: "individual",
                priority: "medium"
            };

            setMessages([reply, ...messages]);
            setShowReplyDialog(false);
            setReplyForm({ content: "" });

            toast({
                title: "Reply Sent",
                description: "Your reply has been sent successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send reply.",
                variant: "destructive",
            });
        }
    };

    const markAsRead = (messageId: string) => {
        const updatedMessages = messages.map(message =>
            message.id === messageId
                ? { ...message, status: "read", readAt: new Date().toISOString() }
                : message
        );
        setMessages(updatedMessages);
    };

    const filteredMessages = messages.filter(message => {
        const searchMatch = searchTerm === "" ||
            message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.senderName.toLowerCase().includes(searchTerm.toLowerCase());
        const typeMatch = typeFilter === "all" || message.type === typeFilter;
        const priorityMatch = priorityFilter === "all" || message.priority === priorityFilter;
        return searchMatch && typeMatch && priorityMatch;
    });

    const unreadCount = messages.filter(m => m.status !== 'read').length;
    const sentCount = messages.filter(m => m.senderId === 'tutor1').length;
    const receivedCount = messages.filter(m => m.senderId !== 'tutor1').length;

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
                    <h1 className="text-3xl font-bold">Messages</h1>
                    <p className="text-muted-foreground">
                        Communicate with your students and manage announcements
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                    </Button>
                    <Button onClick={() => setShowComposeDialog(true)}>
                        <Send className="mr-2 h-4 w-4" />
                        Compose
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{unreadCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Require attention
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sent</CardTitle>
                        <Send className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sentCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Messages sent
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Received</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{receivedCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Student messages
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{students.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Available contacts
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
                                    placeholder="Search messages..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="individual">Individual</SelectItem>
                                    <SelectItem value="group">Group</SelectItem>
                                    <SelectItem value="announcement">Announcement</SelectItem>
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
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
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

            {/* Messages List */}
            <Card>
                <CardHeader>
                    <CardTitle>Messages ({filteredMessages.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${message.status !== 'read' ? 'bg-blue-50 border-blue-200' : ''
                                    }`}
                                onClick={() => {
                                    setSelectedMessage(message);
                                    if (message.status !== 'read') {
                                        markAsRead(message.id);
                                    }
                                }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-medium">{message.subject}</h4>
                                            {getPriorityBadge(message.priority)}
                                            {getTypeBadge(message.type)}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                            {message.content}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>
                                                {message.senderId === 'tutor1' ? 'To: ' : 'From: '}
                                                {message.senderId === 'tutor1' ? message.recipientName : message.senderName}
                                            </span>
                                            <span>{new Date(message.sentAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(message.status)}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => {
                                                    setSelectedMessage(message);
                                                    setShowReplyDialog(true);
                                                }}>
                                                    <Reply className="mr-2 h-4 w-4" />
                                                    Reply
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <Archive className="mr-2 h-4 w-4" />
                                                    Archive
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Compose Message Dialog */}
            <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Compose Message</DialogTitle>
                        <DialogDescription>
                            Send a message to your students
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="recipient">Recipient</Label>
                            <Select value={composeForm.recipientId} onValueChange={(value) => setComposeForm({ ...composeForm, recipientId: value })}>
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
                                value={composeForm.subject}
                                onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Message</Label>
                            <Textarea
                                id="content"
                                placeholder="Enter your message..."
                                value={composeForm.content}
                                onChange={(e) => setComposeForm({ ...composeForm, content: e.target.value })}
                                rows={4}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select value={composeForm.type} onValueChange={(value) => setComposeForm({ ...composeForm, type: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="individual">Individual</SelectItem>
                                        <SelectItem value="group">Group</SelectItem>
                                        <SelectItem value="announcement">Announcement</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select value={composeForm.priority} onValueChange={(value) => setComposeForm({ ...composeForm, priority: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowComposeDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={sendMessage}>
                            Send Message
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reply Dialog */}
            <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reply to Message</DialogTitle>
                        <DialogDescription>
                            Reply to {selectedMessage?.senderName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="p-3 bg-muted rounded-lg">
                            <div className="text-sm font-medium mb-1">Original Message</div>
                            <div className="text-sm text-muted-foreground">{selectedMessage?.content}</div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="replyContent">Your Reply</Label>
                            <Textarea
                                id="replyContent"
                                placeholder="Enter your reply..."
                                value={replyForm.content}
                                onChange={(e) => setReplyForm({ content: e.target.value })}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowReplyDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={replyToMessage}>
                            Send Reply
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 