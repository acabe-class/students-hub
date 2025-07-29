import { useState, useEffect } from "react";
import {
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Edit,
    Download,
    Filter,
    Search,
    Mail,
    BarChart3,
    Calendar,
    Users,
    MoreHorizontal,
    AlertCircle
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
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Payment {
    id: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    cohort: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    status: 'pending' | 'confirmed' | 'failed' | 'refunded';
    transactionId?: string;
    paymentDate?: string;
    dueDate: string;
    notes?: string;
    createdAt: string;
}

interface ExamResult {
    id: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    track: string;
    examDate: string;
    score: number;
    passingScore: number;
    passed: boolean;
    status: 'pending' | 'notified' | 'accepted' | 'rejected';
    notifiedAt?: string;
    createdAt: string;
}

interface ScholarshipStats {
    totalApplications: number;
    pendingPayments: number;
    confirmedPayments: number;
    totalRevenue: number;
    pendingExams: number;
    completedExams: number;
    averageScore: number;
    passRate: number;
}

export default function PaymentsManagement() {
    const { toast } = useToast();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [examResults, setExamResults] = useState<ExamResult[]>([]);
    const [stats, setStats] = useState<ScholarshipStats>({
        totalApplications: 0,
        pendingPayments: 0,
        confirmedPayments: 0,
        totalRevenue: 0,
        pendingExams: 0,
        completedExams: 0,
        averageScore: 0,
        passRate: 0,
    });
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [selectedExam, setSelectedExam] = useState<ExamResult | null>(null);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showExamDialog, setShowExamDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
    const [examStatusFilter, setExamStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Mock data - replace with actual API calls
        const mockPayments: Payment[] = [
            {
                id: "1",
                studentId: "student1",
                studentName: "John Doe",
                studentEmail: "john.doe@example.com",
                cohort: "Cohort 5",
                amount: 500,
                currency: "USD",
                paymentMethod: "Credit Card",
                status: "confirmed",
                transactionId: "TXN123456",
                paymentDate: "2024-01-15T10:30:00Z",
                dueDate: "2024-01-20T23:59:59Z",
                notes: "Payment received on time",
                createdAt: "2024-01-10T09:00:00Z"
            },
            {
                id: "2",
                studentId: "student2",
                studentName: "Sarah Wilson",
                studentEmail: "sarah.wilson@example.com",
                cohort: "Cohort 6",
                amount: 500,
                currency: "USD",
                paymentMethod: "Bank Transfer",
                status: "pending",
                dueDate: "2024-01-25T23:59:59Z",
                notes: "Awaiting bank confirmation",
                createdAt: "2024-01-12T14:20:00Z"
            },
            {
                id: "3",
                studentId: "student3",
                studentName: "Michael Chen",
                studentEmail: "michael.chen@example.com",
                cohort: "Cohort 5",
                amount: 500,
                currency: "USD",
                paymentMethod: "PayPal",
                status: "failed",
                dueDate: "2024-01-18T23:59:59Z",
                notes: "Payment failed - insufficient funds",
                createdAt: "2024-01-15T11:45:00Z"
            }
        ];

        const mockExamResults: ExamResult[] = [
            {
                id: "1",
                studentId: "student1",
                studentName: "John Doe",
                studentEmail: "john.doe@example.com",
                track: "Full Stack Development",
                examDate: "2024-01-18T10:00:00Z",
                score: 85,
                passingScore: 70,
                passed: true,
                status: "notified",
                notifiedAt: "2024-01-18T17:00:00Z",
                createdAt: "2024-01-18T11:30:00Z"
            },
            {
                id: "2",
                studentId: "student2",
                studentName: "Sarah Wilson",
                studentEmail: "sarah.wilson@example.com",
                track: "Frontend Development",
                examDate: "2024-01-19T14:00:00Z",
                score: 92,
                passingScore: 70,
                passed: true,
                status: "accepted",
                notifiedAt: "2024-01-19T17:00:00Z",
                createdAt: "2024-01-19T15:30:00Z"
            },
            {
                id: "3",
                studentId: "student3",
                studentName: "Michael Chen",
                studentEmail: "michael.chen@example.com",
                track: "Backend Development",
                examDate: "2024-01-20T09:00:00Z",
                score: 65,
                passingScore: 70,
                passed: false,
                status: "rejected",
                notifiedAt: "2024-01-20T17:00:00Z",
                createdAt: "2024-01-20T10:30:00Z"
            }
        ];

        setPayments(mockPayments);
        setExamResults(mockExamResults);
        setStats({
            totalApplications: 156,
            pendingPayments: 23,
            confirmedPayments: 89,
            totalRevenue: 44500,
            pendingExams: 15,
            completedExams: 141,
            averageScore: 78,
            passRate: 85
        });
        setIsLoading(false);
    }, []);

    const getPaymentStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary">Pending</Badge>;
            case 'confirmed':
                return <Badge variant="default">Confirmed</Badge>;
            case 'failed':
                return <Badge variant="destructive">Failed</Badge>;
            case 'refunded':
                return <Badge variant="outline">Refunded</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getExamStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary">Pending</Badge>;
            case 'notified':
                return <Badge variant="outline">Notified</Badge>;
            case 'accepted':
                return <Badge variant="default">Accepted</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const updatePaymentStatus = async (paymentId: string, newStatus: string) => {
        try {
            const updatedPayments = payments.map(payment =>
                payment.id === paymentId
                    ? {
                        ...payment,
                        status: newStatus as any,
                        paymentDate: newStatus === "confirmed" ? new Date().toISOString() : payment.paymentDate
                    }
                    : payment
            );

            setPayments(updatedPayments);

            toast({
                title: "Payment Status Updated",
                description: `Payment status has been updated to ${newStatus}.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update payment status.",
                variant: "destructive",
            });
        }
    };

    const notifyExamResult = async (examId: string) => {
        try {
            const updatedExams = examResults.map(exam =>
                exam.id === examId
                    ? {
                        ...exam,
                        status: "notified",
                        notifiedAt: new Date().toISOString()
                    }
                    : exam
            );

            setExamResults(updatedExams);

            toast({
                title: "Exam Result Notified",
                description: "Exam result has been sent to the student.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to notify exam result.",
                variant: "destructive",
            });
        }
    };

    const generateExamResults = () => {
        // Mock function to generate exam results
        toast({
            title: "Exam Results Generated",
            description: "Exam results have been generated and are ready for review.",
        });
    };

    const exportPayments = () => {
        toast({
            title: "Export Started",
            description: "Payment data is being exported to CSV.",
        });
    };

    const exportExamResults = () => {
        toast({
            title: "Export Started",
            description: "Exam results are being exported to CSV.",
        });
    };

    const filteredPayments = payments.filter(payment => {
        const statusMatch = paymentStatusFilter === "all" || payment.status === paymentStatusFilter;
        const searchMatch = searchTerm === "" ||
            payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
        return statusMatch && searchMatch;
    });

    const filteredExamResults = examResults.filter(exam => {
        const statusMatch = examStatusFilter === "all" || exam.status === examStatusFilter;
        const searchMatch = searchTerm === "" ||
            exam.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
        return statusMatch && searchMatch;
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
                    <h1 className="text-3xl font-bold">Payments & Scholarships</h1>
                    <p className="text-muted-foreground">
                        Manage payments and scholarship exam results
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={generateExamResults}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Generate Results
                    </Button>
                    <Button onClick={exportPayments}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            From {stats.confirmedPayments} payments
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingPayments}</div>
                        <p className="text-xs text-muted-foreground">
                            Require attention
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Exam Pass Rate</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.passRate}%</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.completedExams} exams completed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.averageScore}%</div>
                        <p className="text-xs text-muted-foreground">
                            Across all exams
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
                            <Label>Payment Status</Label>
                            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                    <SelectItem value="refunded">Refunded</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Exam Status</Label>
                            <Select value={examStatusFilter} onValueChange={setExamStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="notified">Notified</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
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

            {/* Tabs for Payments and Exam Results */}
            <div className="space-y-6">
                {/* Payments Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Payment Management</CardTitle>
                                <CardDescription>
                                    Review and manage payment confirmations
                                </CardDescription>
                            </div>
                            <Button variant="outline" onClick={exportPayments}>
                                <Download className="mr-2 h-4 w-4" />
                                Export Payments
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Cohort</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPayments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{payment.studentName}</div>
                                                <div className="text-sm text-muted-foreground">{payment.studentEmail}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{payment.cohort}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {payment.currency} {payment.amount}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {payment.paymentMethod}
                                            </div>
                                        </TableCell>
                                        <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                                        <TableCell>
                                            {new Date(payment.dueDate).toLocaleDateString()}
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
                                                    <DropdownMenuItem onClick={() => setSelectedPayment(payment)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Mail className="mr-2 h-4 w-4" />
                                                        Send Reminder
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {payment.status === "pending" && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => updatePaymentStatus(payment.id, "confirmed")}>
                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                Mark Confirmed
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => updatePaymentStatus(payment.id, "failed")}>
                                                                <XCircle className="mr-2 h-4 w-4" />
                                                                Mark Failed
                                                            </DropdownMenuItem>
                                                        </>
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

                {/* Exam Results Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Exam Results Management</CardTitle>
                                <CardDescription>
                                    Review and manage scholarship exam results
                                </CardDescription>
                            </div>
                            <Button variant="outline" onClick={exportExamResults}>
                                <Download className="mr-2 h-4 w-4" />
                                Export Results
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Track</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Result</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredExamResults.map((exam) => (
                                    <TableRow key={exam.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{exam.studentName}</div>
                                                <div className="text-sm text-muted-foreground">{exam.studentEmail}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{exam.track}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{exam.score}%</div>
                                            <div className="text-sm text-muted-foreground">
                                                Pass: {exam.passingScore}%
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {exam.passed ? (
                                                <Badge variant="default">Passed</Badge>
                                            ) : (
                                                <Badge variant="destructive">Failed</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>{getExamStatusBadge(exam.status)}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => setSelectedExam(exam)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    {exam.status === "pending" && (
                                                        <DropdownMenuItem onClick={() => notifyExamResult(exam.id)}>
                                                            <Mail className="mr-2 h-4 w-4" />
                                                            Send Notification
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Result
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
            </div>

            {/* Payment Details Dialog */}
            <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Payment Details</DialogTitle>
                    </DialogHeader>
                    {selectedPayment && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Student Name</Label>
                                    <p className="font-medium">{selectedPayment.studentName}</p>
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <p className="font-medium">{selectedPayment.studentEmail}</p>
                                </div>
                                <div>
                                    <Label>Amount</Label>
                                    <p className="font-medium">{selectedPayment.currency} {selectedPayment.amount}</p>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <div className="mt-1">{getPaymentStatusBadge(selectedPayment.status)}</div>
                                </div>
                                <div>
                                    <Label>Payment Method</Label>
                                    <p className="font-medium">{selectedPayment.paymentMethod}</p>
                                </div>
                                <div>
                                    <Label>Due Date</Label>
                                    <p className="font-medium">{new Date(selectedPayment.dueDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            {selectedPayment.notes && (
                                <div>
                                    <Label>Notes</Label>
                                    <p className="text-sm text-muted-foreground">{selectedPayment.notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedPayment(null)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Exam Details Dialog */}
            <Dialog open={!!selectedExam} onOpenChange={() => setSelectedExam(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Exam Result Details</DialogTitle>
                    </DialogHeader>
                    {selectedExam && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Student Name</Label>
                                    <p className="font-medium">{selectedExam.studentName}</p>
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <p className="font-medium">{selectedExam.studentEmail}</p>
                                </div>
                                <div>
                                    <Label>Track</Label>
                                    <p className="font-medium">{selectedExam.track}</p>
                                </div>
                                <div>
                                    <Label>Exam Date</Label>
                                    <p className="font-medium">{new Date(selectedExam.examDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <Label>Score</Label>
                                    <p className="font-medium">{selectedExam.score}%</p>
                                </div>
                                <div>
                                    <Label>Passing Score</Label>
                                    <p className="font-medium">{selectedExam.passingScore}%</p>
                                </div>
                                <div>
                                    <Label>Result</Label>
                                    <div className="mt-1">
                                        {selectedExam.passed ? (
                                            <Badge variant="default">Passed</Badge>
                                        ) : (
                                            <Badge variant="destructive">Failed</Badge>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <div className="mt-1">{getExamStatusBadge(selectedExam.status)}</div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedExam(null)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
} 