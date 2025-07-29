import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Search,
    Mail,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
    Calendar,
    FileText,
    GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { scholarshipApi } from "@/lib/requests";
import { ScholarshipApplication } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface LocationState {
    email?: string;
}

export default function ApplicationStatus() {
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [email, setEmail] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [application, setApplication] = useState<ScholarshipApplication | null>(null);
    const [error, setError] = useState<string | null>(null);

    const state = location.state as LocationState;

    useEffect(() => {
        if (state?.email) {
            setEmail(state.email);
            checkStatus(state.email);
        }
    }, [state?.email]);

    const checkStatus = async (emailAddress: string) => {
        setIsSearching(true);
        setError(null);
        setApplication(null);

        try {
            const response = await scholarshipApi.getApplicationStatus(emailAddress);

            if (response.success && response.data) {
                setApplication(response.data);
            } else {
                setError("No application found with this email address");
            }
        } catch (error) {
            setError("Failed to load application status. Please try again.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            checkStatus(email.trim());
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-6 w-6 text-yellow-600" />;
            case 'approved':
                return <CheckCircle className="h-6 w-6 text-green-600" />;
            case 'rejected':
                return <XCircle className="h-6 w-6 text-red-600" />;
            case 'exam_scheduled':
                return <Calendar className="h-6 w-6 text-blue-600" />;
            case 'exam_completed':
                return <FileText className="h-6 w-6 text-purple-600" />;
            case 'accepted':
                return <GraduationCap className="h-6 w-6 text-green-600" />;
            case 'rejected_final':
                return <XCircle className="h-6 w-6 text-red-600" />;
            default:
                return <AlertCircle className="h-6 w-6 text-gray-600" />;
        }
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'pending':
                return "secondary";
            case 'approved':
            case 'accepted':
                return "default";
            case 'rejected':
            case 'rejected_final':
                return "destructive";
            case 'exam_scheduled':
            case 'exam_completed':
                return "outline";
            default:
                return "secondary";
        }
    };

    const getStatusMessage = (status: string) => {
        switch (status) {
            case 'pending':
                return "Your application is under review";
            case 'approved':
                return "Your application has been approved for the exam";
            case 'rejected':
                return "Your application was not approved";
            case 'exam_scheduled':
                return "Your exam has been scheduled";
            case 'exam_completed':
                return "Your exam has been completed";
            case 'accepted':
                return "Congratulations! You've been accepted";
            case 'rejected_final':
                return "Unfortunately, you were not selected";
            default:
                return "Unknown status";
        }
    };

    const getNextSteps = (status: string) => {
        switch (status) {
            case 'pending':
                return [
                    "Our team is reviewing your application",
                    "You'll receive an email within 3-5 business days",
                    "Make sure to check your spam folder"
                ];
            case 'approved':
                return [
                    "Check your email for exam scheduling details",
                    "Prepare for your exam by reviewing the track materials",
                    "Ensure you have a stable internet connection for the exam"
                ];
            case 'exam_scheduled':
                return [
                    "Check your email for the exam link",
                    "Ensure you have 60 minutes of uninterrupted time",
                    "Have a stable internet connection ready"
                ];
            case 'exam_completed':
                return [
                    "Results will be sent to your email by 5 PM today",
                    "You'll receive detailed feedback on your performance",
                    "Next steps will be communicated via email"
                ];
            case 'accepted':
                return [
                    "You'll receive login credentials within 24 hours",
                    "Complete your profile setup in the student portal",
                    "Attend the orientation session (details will be emailed)"
                ];
            case 'rejected':
            case 'rejected_final':
                return [
                    "You can reapply in the next application cycle",
                    "Consider taking our preparatory courses",
                    "Join our community forums for support"
                ];
            default:
                return [];
        }
    };

    const canTakeExam = (status: string) => {
        return status === 'approved' || status === 'exam_scheduled';
    };

    const canViewResults = (status: string) => {
        return status === 'exam_completed' || status === 'accepted' || status === 'rejected_final';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 p-4">
            <div className="container mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                        <FileText className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Application Status</h1>
                        <p className="text-muted-foreground">Check the status of your scholarship application</p>
                    </div>
                </div>

                {/* Search Form */}
                <Card className="card-elevated">
                    <CardHeader>
                        <CardTitle>Check Your Status</CardTitle>
                        <CardDescription>
                            Enter your email address to view your application status
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSearching}
                            >
                                {isSearching ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Search className="mr-2 h-4 w-4" />
                                        Check Status
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Error Message */}
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Application Status */}
                {application && (
                    <Card className="card-elevated">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Application Status</CardTitle>
                                    <CardDescription>
                                        {application.firstName} {application.lastName} - {application.track}
                                    </CardDescription>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(application.status)}
                                    <Badge variant={getStatusBadgeVariant(application.status)}>
                                        {application.status.replace('_', ' ').toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Status Message */}
                            <div className="p-4 bg-muted/30 rounded-lg">
                                <h4 className="font-semibold mb-2">Current Status</h4>
                                <p className="text-muted-foreground">{getStatusMessage(application.status)}</p>
                            </div>

                            {/* Application Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-3">Application Details</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Name:</span>
                                            <span>{application.firstName} {application.lastName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Email:</span>
                                            <span>{application.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Track:</span>
                                            <span className="capitalize">{application.track}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Applied:</span>
                                            <span>{new Date(application.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-3">Timeline</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Application Submitted:</span>
                                            <span>{new Date(application.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {application.examScheduledAt && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Exam Scheduled:</span>
                                                <span>{new Date(application.examScheduledAt).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        {application.examCompletedAt && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Exam Completed:</span>
                                                <span>{new Date(application.examCompletedAt).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        {application.examScore !== undefined && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Exam Score:</span>
                                                <span>{application.examScore}%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Next Steps */}
                            <div className="space-y-4">
                                <h4 className="font-semibold">Next Steps</h4>
                                <div className="space-y-3">
                                    {getNextSteps(application.status).map((step, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium mt-0.5">
                                                {index + 1}
                                            </div>
                                            <p className="text-muted-foreground">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                {canTakeExam(application.status) && (
                                    <Button
                                        className="flex-1"
                                        onClick={() => navigate(`/scholarship-exam?token=${application.id}&track=${application.track}`)}
                                    >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Take Exam
                                    </Button>
                                )}

                                {canViewResults(application.status) && (
                                    <Button
                                        className="flex-1"
                                        onClick={() => navigate("/exam-results", {
                                            state: {
                                                applicationId: application.id,
                                                score: application.examScore,
                                                passed: application.examPassed
                                            }
                                        })}
                                    >
                                        <FileText className="mr-2 h-4 w-4" />
                                        View Results
                                    </Button>
                                )}

                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => navigate("/scholarship-application")}
                                >
                                    <GraduationCap className="mr-2 h-4 w-4" />
                                    New Application
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Help Section */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <h3 className="text-lg font-semibold">Need Help?</h3>
                            <p className="text-muted-foreground">
                                If you have questions about your application status, contact our support team.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <Button variant="outline" size="sm">
                                    Contact Support
                                </Button>
                                <Button variant="outline" size="sm">
                                    FAQ
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 