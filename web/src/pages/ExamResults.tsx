import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    CheckCircle,
    XCircle,
    Clock,
    Mail,
    GraduationCap,
    Trophy,
    AlertCircle,
    Loader2,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { scholarshipApi, examApi } from "@/lib/requests";
import { ScholarshipApplication, ExamStatus } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface LocationState {
    score?: number;
    passed?: boolean;
    applicationId?: string;
}

export default function ExamResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(true);
    const [application, setApplication] = useState<ScholarshipApplication | null>(null);
    const [examStatus, setExamStatus] = useState<ExamStatus | null>(null);
    const [error, setError] = useState<string | null>(null);

    const state = location.state as LocationState;

    useEffect(() => {
        if (state?.applicationId) {
            loadApplicationData(state.applicationId);
        } else {
            setError("No application data found");
            setIsLoading(false);
        }
    }, [state?.applicationId]);

    const loadApplicationData = async (applicationId: string) => {
        try {
            // Load application details
            const appResponse = await scholarshipApi.getApplication(applicationId);
            if (appResponse.success && appResponse.data) {
                setApplication(appResponse.data);
            }

            // Load exam status
            const statusResponse = await examApi.getExamStatus(applicationId);
            if (statusResponse.success && statusResponse.data) {
                setExamStatus(statusResponse.data);
            }
        } catch (error) {
            setError("Failed to load application data");
        } finally {
            setIsLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    const getScoreBadgeVariant = (score: number) => {
        if (score >= 80) return "default";
        if (score >= 60) return "secondary";
        return "destructive";
    };

    const getStatusIcon = () => {
        if (!examStatus) return null;

        switch (examStatus.status) {
            case 'passed':
                return <CheckCircle className="h-8 w-8 text-green-600" />;
            case 'failed':
                return <XCircle className="h-8 w-8 text-red-600" />;
            case 'completed':
                return examStatus.passed ?
                    <CheckCircle className="h-8 w-8 text-green-600" /> :
                    <XCircle className="h-8 w-8 text-red-600" />;
            default:
                return <Clock className="h-8 w-8 text-blue-600" />;
        }
    };

    const getStatusMessage = () => {
        if (!examStatus) return "Loading...";

        switch (examStatus.status) {
            case 'passed':
                return "Congratulations! You passed the exam.";
            case 'failed':
                return "Unfortunately, you did not meet the passing score.";
            case 'completed':
                return examStatus.passed ?
                    "Congratulations! You passed the exam." :
                    "Unfortunately, you did not meet the passing score.";
            default:
                return "Your exam is being processed.";
        }
    };

    const getNextSteps = () => {
        if (!examStatus) return [];

        if (examStatus.status === 'passed' || (examStatus.status === 'completed' && examStatus.passed)) {
            return [
                "You will receive an email with login credentials within 24 hours",
                "Complete your profile setup in the student portal",
                "Attend the orientation session (details will be emailed)",
                "Start your learning journey with ACA!"
            ];
        } else {
            return [
                "You can reapply for the scholarship in the next application cycle",
                "Consider taking our preparatory courses to improve your skills",
                "Join our community forums to connect with other learners",
                "Stay updated with our newsletter for future opportunities"
            ];
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading your results...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md space-y-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
                                <h3 className="text-lg font-semibold">Error Loading Results</h3>
                                <p className="text-muted-foreground">{error}</p>
                                <Button onClick={() => navigate("/")}>
                                    Go Home
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const score = examStatus?.score || state?.score || 0;
    const passed = examStatus?.passed ?? state?.passed ?? false;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 p-4">
            <div className="container mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                        <Trophy className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Exam Results</h1>
                        <p className="text-muted-foreground">
                            {application?.firstName} {application?.lastName} - {application?.track}
                        </p>
                    </div>
                </div>

                {/* Results Card */}
                <Card className="card-elevated">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            {getStatusIcon()}
                        </div>
                        <CardTitle className="text-2xl">{getStatusMessage()}</CardTitle>
                        <CardDescription>
                            {application?.track} Scholarship Exam
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Score Display */}
                        <div className="text-center space-y-4">
                            <div className="flex items-center justify-center space-x-4">
                                <div className="text-center">
                                    <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                                        {score}%
                                    </div>
                                    <p className="text-muted-foreground">Your Score</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-muted-foreground">
                                        70%
                                    </div>
                                    <p className="text-muted-foreground">Passing Score</p>
                                </div>
                            </div>

                            <Progress value={score} className="w-full max-w-md mx-auto" />

                            <Badge variant={getScoreBadgeVariant(score)} className="text-lg px-4 py-2">
                                {passed ? "PASSED" : "FAILED"}
                            </Badge>
                        </div>

                        {/* Application Details */}
                        {application && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                                <div>
                                    <h4 className="font-semibold mb-2">Application Details</h4>
                                    <div className="space-y-1 text-sm">
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
                                    <h4 className="font-semibold mb-2">Exam Details</h4>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Status:</span>
                                            <Badge variant={passed ? "default" : "destructive"}>
                                                {examStatus?.status || "Completed"}
                                            </Badge>
                                        </div>
                                        {examStatus?.examCompletedAt && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Completed:</span>
                                                <span>{new Date(examStatus.examCompletedAt).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Verdict:</span>
                                            <Badge variant={passed ? "default" : "secondary"}>
                                                {examStatus?.verdict || (passed ? "accepted" : "rejected")}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Next Steps */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Next Steps</h3>
                            <div className="space-y-3">
                                {getNextSteps().map((step, index) => (
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
                            {passed ? (
                                <>
                                    <Button className="flex-1" onClick={() => navigate("/login")}>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Check Email for Login
                                    </Button>
                                    <Button variant="outline" className="flex-1" onClick={() => window.open("/", "_blank")}>
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Visit Student Portal
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button className="flex-1" onClick={() => navigate("/scholarship-application")}>
                                        <GraduationCap className="mr-2 h-4 w-4" />
                                        Reapply for Scholarship
                                    </Button>
                                    <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>
                                        Return Home
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Information */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <h3 className="text-lg font-semibold">Need Help?</h3>
                            <p className="text-muted-foreground">
                                If you have any questions about your results or next steps, please contact our support team.
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