import { useState, useEffect } from "react";
import {
    Plus,
    Users,
    Calendar,
    FileText,
    Upload,
    Edit,
    Trash2,
    Eye,
    BarChart3,
    MessageSquare,
    Settings,
    Download,
    MoreHorizontal
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Cohort {
    id: string;
    name: string;
    track: string;
    startDate: string;
    endDate: string;
    totalStudents: number;
    activeStudents: number;
    status: 'active' | 'completed' | 'upcoming';
    progress: number;
    events: Event[];
    content: Content[];
}

interface Event {
    id: string;
    title: string;
    type: 'town_hall' | 'orientation' | 'workshop' | 'announcement';
    date: string;
    description: string;
    attendees: number;
    maxAttendees: number;
}

interface Content {
    id: string;
    title: string;
    type: 'document' | 'video' | 'presentation' | 'assignment';
    uploadedAt: string;
    size: string;
    downloads: number;
}

export default function CohortManagement() {
    const { toast } = useToast();
    const [cohorts, setCohorts] = useState<Cohort[]>([]);
    const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEventDialog, setShowEventDialog] = useState(false);
    const [showContentDialog, setShowContentDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Form states
    const [newCohort, setNewCohort] = useState({
        name: "",
        track: "",
        startDate: "",
        endDate: "",
        maxStudents: 30
    });

    const [newEvent, setNewEvent] = useState({
        title: "",
        type: "town_hall",
        date: "",
        description: "",
        maxAttendees: 50
    });

    const [newContent, setNewContent] = useState({
        title: "",
        type: "document",
        file: null as File | null
    });

    useEffect(() => {
        // Mock data - replace with actual API call
        const mockCohorts: Cohort[] = [
            {
                id: "1",
                name: "Cohort 5 - Full Stack",
                track: "fullstack",
                startDate: "2024-01-15",
                endDate: "2024-07-15",
                totalStudents: 25,
                activeStudents: 23,
                status: "active",
                progress: 65,
                events: [
                    {
                        id: "1",
                        title: "Monthly Town Hall",
                        type: "town_hall",
                        date: "2024-01-25T14:00:00Z",
                        description: "Monthly check-in and Q&A session",
                        attendees: 20,
                        maxAttendees: 25
                    }
                ],
                content: [
                    {
                        id: "1",
                        title: "Orientation Guide",
                        type: "document",
                        uploadedAt: "2024-01-15T10:00:00Z",
                        size: "2.5 MB",
                        downloads: 25
                    }
                ]
            },
            {
                id: "2",
                name: "Cohort 6 - Frontend",
                track: "frontend",
                startDate: "2024-02-01",
                endDate: "2024-06-01",
                totalStudents: 20,
                activeStudents: 18,
                status: "active",
                progress: 45,
                events: [],
                content: []
            }
        ];

        setCohorts(mockCohorts);
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

    const getTrackLabel = (track: string) => {
        const trackLabels: Record<string, string> = {
            fullstack: "Full Stack Development",
            frontend: "Frontend Development",
            backend: "Backend Development",
            mobile: "Mobile Development",
            devops: "DevOps Engineering"
        };
        return trackLabels[track] || track;
    };

    const getEventTypeLabel = (type: string) => {
        const typeLabels: Record<string, string> = {
            town_hall: "Town Hall",
            orientation: "Orientation",
            workshop: "Workshop",
            announcement: "Announcement"
        };
        return typeLabels[type] || type;
    };

    const createCohort = async () => {
        try {
            const cohort: Cohort = {
                id: Date.now().toString(),
                name: newCohort.name,
                track: newCohort.track,
                startDate: newCohort.startDate,
                endDate: newCohort.endDate,
                totalStudents: 0,
                activeStudents: 0,
                status: "upcoming",
                progress: 0,
                events: [],
                content: []
            };

            setCohorts([...cohorts, cohort]);
            setShowCreateDialog(false);
            setNewCohort({ name: "", track: "", startDate: "", endDate: "", maxStudents: 30 });

            toast({
                title: "Cohort Created",
                description: "New cohort has been created successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create cohort.",
                variant: "destructive",
            });
        }
    };

    const createEvent = async () => {
        if (!selectedCohort) return;

        try {
            const event: Event = {
                id: Date.now().toString(),
                title: newEvent.title,
                type: newEvent.type as any,
                date: newEvent.date,
                description: newEvent.description,
                attendees: 0,
                maxAttendees: newEvent.maxAttendees
            };

            const updatedCohorts = cohorts.map(cohort =>
                cohort.id === selectedCohort.id
                    ? { ...cohort, events: [...cohort.events, event] }
                    : cohort
            );

            setCohorts(updatedCohorts);
            setShowEventDialog(false);
            setNewEvent({ title: "", type: "town_hall", date: "", description: "", maxAttendees: 50 });

            toast({
                title: "Event Created",
                description: "New event has been scheduled successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create event.",
                variant: "destructive",
            });
        }
    };

    const uploadContent = async () => {
        if (!selectedCohort || !newContent.file) return;

        try {
            const content: Content = {
                id: Date.now().toString(),
                title: newContent.title,
                type: newContent.type as any,
                uploadedAt: new Date().toISOString(),
                size: `${(newContent.file.size / 1024 / 1024).toFixed(1)} MB`,
                downloads: 0
            };

            const updatedCohorts = cohorts.map(cohort =>
                cohort.id === selectedCohort.id
                    ? { ...cohort, content: [...cohort.content, content] }
                    : cohort
            );

            setCohorts(updatedCohorts);
            setShowContentDialog(false);
            setNewContent({ title: "", type: "document", file: null });

            toast({
                title: "Content Uploaded",
                description: "Content has been uploaded successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload content.",
                variant: "destructive",
            });
        }
    };

    const deleteCohort = (cohortId: string) => {
        setCohorts(cohorts.filter(cohort => cohort.id !== cohortId));
        toast({
            title: "Cohort Deleted",
            description: "Cohort has been deleted successfully.",
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
                    <h1 className="text-3xl font-bold">Cohort Management</h1>
                    <p className="text-muted-foreground">
                        Create and manage student cohorts, events, and content
                    </p>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Cohort
                </Button>
            </div>

            {/* Cohorts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cohorts.map((cohort) => (
                    <Card key={cohort.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">{cohort.name}</CardTitle>
                                    <CardDescription>{getTrackLabel(cohort.track)}</CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => setSelectedCohort(cohort)}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Cohort
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-red-600"
                                            onClick={() => deleteCohort(cohort.id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Cohort
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                {getStatusBadge(cohort.status)}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Progress</span>
                                    <span>{cohort.progress}%</span>
                                </div>
                                <Progress value={cohort.progress} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Students</span>
                                    <div className="font-medium">{cohort.activeStudents}/{cohort.totalStudents}</div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Events</span>
                                    <div className="font-medium">{cohort.events.length}</div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => {
                                        setSelectedCohort(cohort);
                                        setShowEventDialog(true);
                                    }}
                                >
                                    <Calendar className="mr-2 h-3 w-3" />
                                    Add Event
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => {
                                        setSelectedCohort(cohort);
                                        setShowContentDialog(true);
                                    }}
                                >
                                    <Upload className="mr-2 h-3 w-3" />
                                    Upload
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Create Cohort Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Cohort</DialogTitle>
                        <DialogDescription>
                            Create a new student cohort with specific track and timeline
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Cohort Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Cohort 7 - Full Stack"
                                value={newCohort.name}
                                onChange={(e) => setNewCohort({ ...newCohort, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="track">Track</Label>
                            <Select value={newCohort.track} onValueChange={(value) => setNewCohort({ ...newCohort, track: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select track" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fullstack">Full Stack Development</SelectItem>
                                    <SelectItem value="frontend">Frontend Development</SelectItem>
                                    <SelectItem value="backend">Backend Development</SelectItem>
                                    <SelectItem value="mobile">Mobile Development</SelectItem>
                                    <SelectItem value="devops">DevOps Engineering</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={newCohort.startDate}
                                    onChange={(e) => setNewCohort({ ...newCohort, startDate: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={newCohort.endDate}
                                    onChange={(e) => setNewCohort({ ...newCohort, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxStudents">Maximum Students</Label>
                            <Input
                                id="maxStudents"
                                type="number"
                                placeholder="30"
                                value={newCohort.maxStudents}
                                onChange={(e) => setNewCohort({ ...newCohort, maxStudents: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={createCohort}>
                            Create Cohort
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Event Dialog */}
            <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Schedule Event</DialogTitle>
                        <DialogDescription>
                            Create a new event for {selectedCohort?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="eventTitle">Event Title</Label>
                            <Input
                                id="eventTitle"
                                placeholder="e.g., Monthly Town Hall"
                                value={newEvent.title}
                                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="eventType">Event Type</Label>
                            <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="town_hall">Town Hall</SelectItem>
                                    <SelectItem value="orientation">Orientation</SelectItem>
                                    <SelectItem value="workshop">Workshop</SelectItem>
                                    <SelectItem value="announcement">Announcement</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="eventDate">Date & Time</Label>
                            <Input
                                id="eventDate"
                                type="datetime-local"
                                value={newEvent.date}
                                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="eventDescription">Description</Label>
                            <Textarea
                                id="eventDescription"
                                placeholder="Event description..."
                                value={newEvent.description}
                                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxAttendees">Maximum Attendees</Label>
                            <Input
                                id="maxAttendees"
                                type="number"
                                placeholder="50"
                                value={newEvent.maxAttendees}
                                onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEventDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={createEvent}>
                            Schedule Event
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Upload Content Dialog */}
            <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload Content</DialogTitle>
                        <DialogDescription>
                            Upload content for {selectedCohort?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="contentTitle">Content Title</Label>
                            <Input
                                id="contentTitle"
                                placeholder="e.g., Orientation Guide"
                                value={newContent.title}
                                onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contentType">Content Type</Label>
                            <Select value={newContent.type} onValueChange={(value) => setNewContent({ ...newContent, type: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="document">Document</SelectItem>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="presentation">Presentation</SelectItem>
                                    <SelectItem value="assignment">Assignment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contentFile">File</Label>
                            <Input
                                id="contentFile"
                                type="file"
                                onChange={(e) => setNewContent({ ...newContent, file: e.target.files?.[0] || null })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowContentDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={uploadContent}>
                            Upload Content
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 