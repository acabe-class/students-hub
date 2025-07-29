import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Mail,
    Calendar,
    FileText,
    Users,
    Download,
    MoreHorizontal
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScholarshipApplication } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface ApplicationWithActions extends ScholarshipApplication {
    actions?: string[];
}

export default function ApplicationsManagement() {
    const { toast } = useToast();
    const [applications, setApplications] = useState<ApplicationWithActions[]>([]);
    const [filteredApplications, setFilteredApplications] = useState<ApplicationWithActions[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<ApplicationWithActions | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [trackFilter, setTrackFilter] = useState("all");
    const [showReviewDialog, setShowReviewDialog] = useState(false);
    const [reviewNotes, setReviewNotes] = useState("");
    const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);

    useEffect(() => {
        // Mock data - replace with actual API call
        const mockApplications: ApplicationWithActions[] = [
            {
                id: "1",
                userId: "user1",
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                phone: "+1234567890",
                dateOfBirth: "1995-03-15",
                track: "fullstack",
                educationLevel: "Bachelor's Degree",
                currentOccupation: "Student",
                monthlyIncome: 1200,
                familySize: 3,
                motivation: "I want to become a full-stack developer and build innovative web applications.",
                previousExperience: "Basic HTML, CSS, and JavaScript knowledge from online courses.",
                status: "pending",
                createdAt: "2024-01-15T10:30:00Z",
                updatedAt: "2024-01-15T10:30:00Z"
            },
            {
                id: "2",
                userId: "user2",
                firstName: "Sarah",
                lastName: "Wilson",
                email: "sarah.wilson@example.com",
                phone: "+1234567891",
                dateOfBirth: "1992-07-22",
                track: "frontend",
                educationLevel: "Master's Degree",
                currentOccupation: "Designer",
                monthlyIncome: 3500,
                familySize: 2,
                motivation: "I want to transition from design to frontend development to create better user experiences.",
                previousExperience: "5 years of UI/UX design experience, basic React knowledge.",
                status: "approved",
                examScheduledAt: "2024-01-20T14:00:00Z",
                createdAt: "2024-01-10T09:15:00Z",
                updatedAt: "2024-01-12T16:45:00Z"
            },
            {
                id: "3",
                userId: "user3",
                firstName: "Michael",
                lastName: "Chen",
                email: "michael.chen@example.com",
                phone: "+1234567892",
                dateOfBirth: "1990-11-08",
                track: "backend",
                educationLevel: "Bachelor's Degree",
                currentOccupation: "Unemployed",
                monthlyIncome: 800,
                familySize: 4,
                motivation: "I need to learn backend development to support my family and start a new career.",
                previousExperience: "Some Python programming experience from self-study.",
                status: "exam_completed",
                examScheduledAt: "2024-01-18T10:00:00Z",
                examCompletedAt: "2024-01-18T11:30:00Z",
                examScore: 85,
                examPassed: true,
                createdAt: "2024-01-08T14:20:00Z",
                updatedAt: "2024-01-18T11:30:00Z"
            }
        ];

        setApplications(mockApplications);
        setFilteredApplications(mockApplications);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        let filtered = applications;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(app =>
                app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(app => app.status === statusFilter);
        }

        // Apply track filter
        if (trackFilter !== "all") {
            filtered = filtered.filter(app => app.track === trackFilter);
        }

        setFilteredApplications(filtered);
    }, [applications, searchTerm, statusFilter, trackFilter]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary">Pending Review</Badge>;
            case 'approved':
                return <Badge variant="default">Approved</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            case 'exam_scheduled':
                return <Badge variant="outline">Exam Scheduled</Badge>;
            case 'exam_completed':
                return <Badge variant="outline">Exam Completed</Badge>;
            case 'accepted':
                return <Badge variant="default">Accepted</Badge>;
            case 'rejected_final':
                return <Badge variant="destructive">Rejected Final</Badge>;
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

    const handleReview = (application: ApplicationWithActions, action: "approve" | "reject") => {
        setSelectedApplication(application);
        setReviewAction(action);
        setReviewNotes("");
        setShowReviewDialog(true);
    };

    const submitReview = async () => {
        if (!selectedApplication || !reviewAction) return;

        try {
            // Mock API call - replace with actual API
            const updatedApplications = applications.map(app =>
                app.id === selectedApplication.id
                    ? {
                        ...app,
                        status: reviewAction === "approve" ? "approved" : "rejected",
                        updatedAt: new Date().toISOString()
                    }
                    : app
            );

            setApplications(updatedApplications);

            toast({
                title: `Application ${reviewAction === "approve" ? "Approved" : "Rejected"}`,
                description: `The application has been ${reviewAction === "approve" ? "approved" : "rejected"}.`,
            });

            setShowReviewDialog(false);
            setSelectedApplication(null);
            setReviewAction(null);
            setReviewNotes("");
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update application status.",
                variant: "destructive",
            });
        }
    };

    const exportApplications = () => {
        // Mock export functionality
        toast({
            title: "Export Started",
            description: "Applications data is being exported to CSV.",
        });
    };

    const sendEmail = (application: ApplicationWithActions) => {
        // Mock email functionality
        toast({
            title: "Email Sent",
            description: `Email sent to ${application.email}`,
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
                    <h1 className="text-3xl font-bold">Applications Management</h1>
                    <p className="text-muted-foreground">
                        Review and manage scholarship applications
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={exportApplications}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button>
                        <FileText className="mr-2 h-4 w-4" />
                        New Application
                    </Button>
                </div>
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
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="exam_scheduled">Exam Scheduled</SelectItem>
                                    <SelectItem value="exam_completed">Exam Completed</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="rejected_final">Rejected Final</SelectItem>
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
                                    <SelectItem value="fullstack">Full Stack Development</SelectItem>
                                    <SelectItem value="frontend">Frontend Development</SelectItem>
                                    <SelectItem value="backend">Backend Development</SelectItem>
                                    <SelectItem value="mobile">Mobile Development</SelectItem>
                                    <SelectItem value="devops">DevOps Engineering</SelectItem>
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

            {/* Applications Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Applications ({filteredApplications.length})</CardTitle>
                            <CardDescription>
                                Showing {filteredApplications.length} of {applications.length} applications
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Applicant</TableHead>
                                <TableHead>Track</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Applied</TableHead>
                                <TableHead>Exam Score</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredApplications.map((application) => (
                                <TableRow key={application.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">
                                                {application.firstName} {application.lastName}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {application.email}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {getTrackLabel(application.track)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(application.status)}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(application.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {application.examScore ? (
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium">{application.examScore}%</span>
                                                {application.examPassed ? (
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
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
                                                <DropdownMenuItem onClick={() => setSelectedApplication(application)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => sendEmail(application)}>
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    Send Email
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {application.status === "pending" && (
                                                    <>
                                                        <DropdownMenuItem
                                                            onClick={() => handleReview(application, "approve")}
                                                            className="text-green-600"
                                                        >
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Approve
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleReview(application, "reject")}
                                                            className="text-red-600"
                                                        >
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            Reject
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                                {application.status === "approved" && (
                                                    <DropdownMenuItem>
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        Schedule Exam
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Review Dialog */}
            <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {reviewAction === "approve" ? "Approve" : "Reject"} Application
                        </DialogTitle>
                        <DialogDescription>
                            {selectedApplication && (
                                <>
                                    Review application for {selectedApplication.firstName} {selectedApplication.lastName}
                                    <br />
                                    Track: {getTrackLabel(selectedApplication.track)}
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="notes">Review Notes</Label>
                            <Textarea
                                id="notes"
                                placeholder="Add notes about your decision..."
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant={reviewAction === "approve" ? "default" : "destructive"}
                            onClick={submitReview}
                        >
                            {reviewAction === "approve" ? "Approve" : "Reject"} Application
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 