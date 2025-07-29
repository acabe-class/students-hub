import { useState, useEffect } from "react";
import {
    Plus,
    MessageSquare,
    Send,
    Edit,
    Trash2,
    Eye,
    Calendar,
    Users,
    Bell,
    Clock,
    CheckCircle,
    XCircle,
    MoreHorizontal,
    Filter
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

interface Communication {
    id: string;
    title: string;
    type: 'announcement' | 'town_hall' | 'motivational' | 'reminder';
    content: string;
    targetAudience: 'all' | 'specific_cohort' | 'specific_track';
    cohorts?: string[];
    tracks?: string[];
    scheduledFor?: string;
    sentAt?: string;
    status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
    readCount: number;
    totalRecipients: number;
    createdAt: string;
    createdBy: string;
}

interface Cohort {
    id: string;
    name: string;
    track: string;
    studentCount: number;
}

export default function CommunicationsManagement() {
    const { toast } = useToast();
    const [communications, setCommunications] = useState<Communication[]>([]);
    const [cohorts, setCohorts] = useState<Cohort[]>([]);
    const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");

    // Form states
    const [newCommunication, setNewCommunication] = useState({
        title: "",
        type: "announcement",
        content: "",
        targetAudience: "all",
        cohorts: [] as string[],
        tracks: [] as string[],
        scheduledFor: "",
        status: "draft"
    });

    useEffect(() => {
        // Mock data - replace with actual API calls
        const mockCommunications: Communication[] = [
            {
                id: "1",
                title: "Monthly Town Hall Reminder",
                type: "town_hall",
                content: "Join us for our monthly town hall meeting this Friday at 2 PM. We'll discuss upcoming projects and answer your questions.",
                targetAudience: "all",
                scheduledFor: "2024-01-26T14:00:00Z",
                status: "scheduled",
                readCount: 0,
                totalRecipients: 45,
                createdAt: "2024-01-20T10:00:00Z",
                createdBy: "Admin User"
            },
            {
                id: "2",
                title: "Welcome to Cohort 5!",
                type: "announcement",
                content: "Welcome to all new students in Cohort 5! We're excited to have you join our Full Stack Development program.",
                targetAudience: "specific_cohort",
                cohorts: ["Cohort 5"],
                status: "sent",
                sentAt: "2024-01-15T09:00:00Z",
                readCount: 23,
                totalRecipients: 25,
                createdAt: "2024-01-15T08:30:00Z",
                createdBy: "Admin User"
            },
            {
                id: "3",
                title: "Keep Going! You're Doing Great!",
                type: "motivational",
                content: "Remember, every expert was once a beginner. Your progress is amazing, and we're proud of how far you've come!",
                targetAudience: "all",
                status: "sent",
                sentAt: "2024-01-18T12:00:00Z",
                readCount: 38,
                totalRecipients: 45,
                createdAt: "2024-01-18T11:45:00Z",
                createdBy: "Admin User"
            }
        ];

        const mockCohorts: Cohort[] = [
            { id: "1", name: "Cohort 5", track: "fullstack", studentCount: 25 },
            { id: "2", name: "Cohort 6", track: "frontend", studentCount: 20 },
            { id: "3", name: "Cohort 7", track: "backend", studentCount: 18 }
        ];

        setCommunications(mockCommunications);
        setCohorts(mockCohorts);
        setIsLoading(false);
    }, []);

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'announcement':
                return <Badge variant="default">Announcement</Badge>;
            case 'town_hall':
                return <Badge variant="secondary">Town Hall</Badge>;
            case 'motivational':
                return <Badge variant="outline">Motivational</Badge>;
            case 'reminder':
                return <Badge variant="destructive">Reminder</Badge>;
            default:
                return <Badge variant="outline">{type}</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft':
                return <Badge variant="outline">Draft</Badge>;
            case 'scheduled':
                return <Badge variant="secondary">Scheduled</Badge>;
            case 'sent':
                return <Badge variant="default">Sent</Badge>;
            case 'cancelled':
                return <Badge variant="destructive">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getTargetAudienceLabel = (audience: string) => {
        switch (audience) {
            case 'all':
                return "All Students";
            case 'specific_cohort':
                return "Specific Cohorts";
            case 'specific_track':
                return "Specific Tracks";
            default:
                return audience;
        }
    };

    const createCommunication = async () => {
        try {
            const communication: Communication = {
                id: Date.now().toString(),
                title: newCommunication.title,
                type: newCommunication.type as any,
                content: newCommunication.content,
                targetAudience: newCommunication.targetAudience as any,
                cohorts: newCommunication.cohorts,
                tracks: newCommunication.tracks,
                scheduledFor: newCommunication.scheduledFor || undefined,
                status: newCommunication.status as any,
                readCount: 0,
                totalRecipients: 0,
                createdAt: new Date().toISOString(),
                createdBy: "Admin User"
            };

            setCommunications([communication, ...communications]);
            setShowCreateDialog(false);
            setNewCommunication({
                title: "",
                type: "announcement",
                content: "",
                targetAudience: "all",
                cohorts: [],
                tracks: [],
                scheduledFor: "",
                status: "draft"
            });

            toast({
                title: "Communication Created",
                description: "New communication has been created successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create communication.",
                variant: "destructive",
            });
        }
    };

    const sendCommunication = async (communicationId: string) => {
        try {
            const updatedCommunications = communications.map(comm =>
                comm.id === communicationId
                    ? {
                        ...comm,
                        status: "sent",
                        sentAt: new Date().toISOString(),
                        readCount: 0,
                        totalRecipients: 45 // Mock recipient count
                    }
                    : comm
            );

            setCommunications(updatedCommunications);

            toast({
                title: "Communication Sent",
                description: "The communication has been sent to all recipients.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send communication.",
                variant: "destructive",
            });
        }
    };

    const deleteCommunication = (communicationId: string) => {
        setCommunications(communications.filter(comm => comm.id !== communicationId));
        toast({
            title: "Communication Deleted",
            description: "Communication has been deleted successfully.",
        });
    };

    const filteredCommunications = communications.filter(comm => {
        const typeMatch = filterType === "all" || comm.type === filterType;
        const statusMatch = filterStatus === "all" || comm.status === filterStatus;
        return typeMatch && statusMatch;
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
                    <h1 className="text-3xl font-bold">Communications Management</h1>
                    <p className="text-muted-foreground">
                        Manage announcements, town halls, and motivational messages
                    </p>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Communication
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="announcement">Announcements</SelectItem>
                                    <SelectItem value="town_hall">Town Halls</SelectItem>
                                    <SelectItem value="motivational">Motivational</SelectItem>
                                    <SelectItem value="reminder">Reminders</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                    <SelectItem value="sent">Sent</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
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

            {/* Communications List */}
            <div className="space-y-4">
                {filteredCommunications.map((communication) => (
                    <Card key={communication.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <MessageSquare className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{communication.title}</CardTitle>
                                        <CardDescription>
                                            {getTargetAudienceLabel(communication.targetAudience)}
                                            {communication.cohorts && communication.cohorts.length > 0 && (
                                                <span> • {communication.cohorts.join(", ")}</span>
                                            )}
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {getTypeBadge(communication.type)}
                                    {getStatusBadge(communication.status)}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => {
                                                setSelectedCommunication(communication);
                                                setShowPreviewDialog(true);
                                            }}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Preview
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            {communication.status === "draft" && (
                                                <DropdownMenuItem onClick={() => sendCommunication(communication.id)}>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    Send Now
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-red-600"
                                                onClick={() => deleteCommunication(communication.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Created:</span>
                                    <span>{new Date(communication.createdAt).toLocaleDateString()}</span>
                                </div>
                                {communication.scheduledFor && (
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Scheduled:</span>
                                        <span>{new Date(communication.scheduledFor).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {communication.status === "sent" && (
                                    <div className="flex items-center space-x-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Read:</span>
                                        <span>{communication.readCount}/{communication.totalRecipients}</span>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2">
                                    <span className="text-muted-foreground">By:</span>
                                    <span>{communication.createdBy}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Create Communication Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create New Communication</DialogTitle>
                        <DialogDescription>
                            Create a new announcement, town hall, or motivational message
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                placeholder="Enter communication title..."
                                value={newCommunication.title}
                                onChange={(e) => setNewCommunication({ ...newCommunication, title: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select value={newCommunication.type} onValueChange={(value) => setNewCommunication({ ...newCommunication, type: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="announcement">Announcement</SelectItem>
                                        <SelectItem value="town_hall">Town Hall</SelectItem>
                                        <SelectItem value="motivational">Motivational</SelectItem>
                                        <SelectItem value="reminder">Reminder</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="targetAudience">Target Audience</Label>
                                <Select value={newCommunication.targetAudience} onValueChange={(value) => setNewCommunication({ ...newCommunication, targetAudience: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Students</SelectItem>
                                        <SelectItem value="specific_cohort">Specific Cohorts</SelectItem>
                                        <SelectItem value="specific_track">Specific Tracks</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {newCommunication.targetAudience === "specific_cohort" && (
                            <div className="space-y-2">
                                <Label>Select Cohorts</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {cohorts.map((cohort) => (
                                        <label key={cohort.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={newCommunication.cohorts.includes(cohort.name)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setNewCommunication({
                                                            ...newCommunication,
                                                            cohorts: [...newCommunication.cohorts, cohort.name]
                                                        });
                                                    } else {
                                                        setNewCommunication({
                                                            ...newCommunication,
                                                            cohorts: newCommunication.cohorts.filter(c => c !== cohort.name)
                                                        });
                                                    }
                                                }}
                                            />
                                            <span className="text-sm">{cohort.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                placeholder="Enter your message content..."
                                value={newCommunication.content}
                                onChange={(e) => setNewCommunication({ ...newCommunication, content: e.target.value })}
                                rows={6}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="scheduledFor">Schedule For (Optional)</Label>
                                <Input
                                    id="scheduledFor"
                                    type="datetime-local"
                                    value={newCommunication.scheduledFor}
                                    onChange={(e) => setNewCommunication({ ...newCommunication, scheduledFor: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={newCommunication.status} onValueChange={(value) => setNewCommunication({ ...newCommunication, status: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={createCommunication}>
                            Create Communication
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Preview Dialog */}
            <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Preview Communication</DialogTitle>
                    </DialogHeader>
                    {selectedCommunication && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold">{selectedCommunication.title}</h3>
                                <div className="flex items-center space-x-2 mt-2">
                                    {getTypeBadge(selectedCommunication.type)}
                                    {getStatusBadge(selectedCommunication.status)}
                                </div>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="whitespace-pre-wrap">{selectedCommunication.content}</p>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                <p>Target: {getTargetAudienceLabel(selectedCommunication.targetAudience)}</p>
                                {selectedCommunication.cohorts && selectedCommunication.cohorts.length > 0 && (
                                    <p>Cohorts: {selectedCommunication.cohorts.join(", ")}</p>
                                )}
                                {selectedCommunication.scheduledFor && (
                                    <p>Scheduled: {new Date(selectedCommunication.scheduledFor).toLocaleString()}</p>
                                )}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
                            Close
                        </Button>
                        {selectedCommunication?.status === "draft" && (
                            <Button onClick={() => {
                                sendCommunication(selectedCommunication.id);
                                setShowPreviewDialog(false);
                            }}>
                                Send Now
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 