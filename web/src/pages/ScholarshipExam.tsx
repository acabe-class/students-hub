import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2,
  ArrowLeft,
  ArrowRight,
  Flag,
  Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { examApi } from "@/lib/requests";
import { Exam, ExamSession, ExamQuestion } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface ExamState {
  exam: Exam | null;
  session: ExamSession | null;
  currentQuestionIndex: number;
  answers: Record<string, number>;
  timeRemaining: number;
  isSubmitting: boolean;
  showConfirmSubmit: boolean;
  showTimeWarning: boolean;
}

export default function ScholarshipExam() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [examState, setExamState] = useState<ExamState>({
    exam: null,
    session: null,
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: 0,
    isSubmitting: false,
    showConfirmSubmit: false,
    showTimeWarning: false,
  });

  const token = searchParams.get('token');
  const track = searchParams.get('track');

  // Initialize exam session
  useEffect(() => {
    if (!token || !track) {
      toast({
        title: "Invalid Exam Link",
        description: "The exam link is invalid or has expired.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    initializeExam();
  }, [token, track]);

  // Timer effect
  useEffect(() => {
    if (examState.timeRemaining <= 0 || !examState.session) return;

    const timer = setInterval(() => {
      setExamState(prev => {
        const newTimeRemaining = prev.timeRemaining - 1;
        
        // Show warning when 5 minutes remaining
        if (newTimeRemaining === 300 && !prev.showTimeWarning) {
          toast({
            title: "Time Warning",
            description: "You have 5 minutes remaining to complete the exam.",
            variant: "destructive",
          });
        }
        
        // Auto-submit when time runs out
        if (newTimeRemaining <= 0) {
          clearInterval(timer);
          submitExam();
          return { ...prev, timeRemaining: 0 };
        }
        
        return { ...prev, timeRemaining: newTimeRemaining };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examState.timeRemaining, examState.session]);

  const initializeExam = async () => {
    try {
      // Get exam by track
      const examResponse = await examApi.getExamByTrack(track!);
      if (!examResponse.success || !examResponse.data) {
        throw new Error("Failed to load exam");
      }

      // Start exam session
      const sessionResponse = await examApi.startExam(examResponse.data.id, token!);
      if (!sessionResponse.success || !sessionResponse.data) {
        throw new Error("Failed to start exam session");
      }

      setExamState(prev => ({
        ...prev,
        exam: examResponse.data,
        session: sessionResponse.data,
        timeRemaining: examResponse.data.duration * 60, // Convert to seconds
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize exam. Please try again.",
        variant: "destructive",
      });
      navigate("/");
    }
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setExamState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: optionIndex,
      },
    }));
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < (examState.exam?.questions.length || 0)) {
      setExamState(prev => ({ ...prev, currentQuestionIndex: index }));
    }
  };

  const submitExam = useCallback(async () => {
    if (!examState.session) return;

    setExamState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const response = await examApi.submitExam(examState.session.id, examState.answers);
      
      if (response.success) {
        toast({
          title: "Exam Submitted!",
          description: "Your exam has been submitted successfully.",
        });
        
        // Navigate to results page
        navigate("/exam-results", {
          state: {
            score: response.data?.score,
            passed: response.data?.passed,
            applicationId: examState.session.applicationId,
          },
        });
      } else {
        throw new Error(response.error || "Failed to submit exam");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit exam. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExamState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [examState.session, examState.answers, navigate, toast]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentQuestion = () => {
    return examState.exam?.questions[examState.currentQuestionIndex];
  };

  const getAnsweredQuestions = () => {
    return Object.keys(examState.answers).length;
  };

  const getTotalQuestions = () => {
    return examState.exam?.questions.length || 0;
  };

  const getProgressPercentage = () => {
    return (getAnsweredQuestions() / getTotalQuestions()) * 100;
  };

  if (!examState.exam || !examState.session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading exam...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();

  return (
    <div className="min-h-screen bg-background">
      {/* Header with timer */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{examState.exam.title}</h1>
              <p className="text-muted-foreground">{examState.exam.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Timer className="h-5 w-5 text-primary" />
                  <span className="text-lg font-mono font-bold">
                    {formatTime(examState.timeRemaining)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Time Remaining</p>
              </div>
              <Button
                onClick={() => setExamState(prev => ({ ...prev, showConfirmSubmit: true }))}
                disabled={examState.isSubmitting}
              >
                Submit Exam
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Question Navigator</CardTitle>
                <CardDescription>
                  {getAnsweredQuestions()} of {getTotalQuestions()} answered
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={getProgressPercentage()} className="mb-4" />
                <div className="grid grid-cols-5 gap-2">
                  {examState.exam.questions.map((question, index) => (
                    <Button
                      key={question.id}
                      variant={
                        index === examState.currentQuestionIndex
                          ? "default"
                          : examState.answers[question.id] !== undefined
                          ? "secondary"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => goToQuestion(index)}
                      className="h-8 w-8 p-0"
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      Question {examState.currentQuestionIndex + 1} of {getTotalQuestions()}
                    </CardTitle>
                    <CardDescription>
                      Select the best answer for this question
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    {examState.answers[currentQuestion?.id || ''] !== undefined ? 'Answered' : 'Unanswered'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentQuestion && (
                  <>
                    <div className="prose max-w-none">
                      <p className="text-lg">{currentQuestion.question}</p>
                    </div>

                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <Button
                          key={index}
                          variant={
                            examState.answers[currentQuestion.id] === index
                              ? "default"
                              : "outline"
                          }
                          className="w-full justify-start h-auto p-4 text-left"
                          onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span>{option}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={() => goToQuestion(examState.currentQuestionIndex - 1)}
                    disabled={examState.currentQuestionIndex === 0}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  
                  <Button
                    onClick={() => goToQuestion(examState.currentQuestionIndex + 1)}
                    disabled={examState.currentQuestionIndex === getTotalQuestions() - 1}
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Time Warning Alert */}
      {examState.timeRemaining <= 300 && examState.timeRemaining > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Time Warning:</strong> {formatTime(examState.timeRemaining)} remaining
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Confirm Submit Dialog */}
      <Dialog 
        open={examState.showConfirmSubmit} 
        onOpenChange={(open) => setExamState(prev => ({ ...prev, showConfirmSubmit: open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Exam?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your exam? You cannot change your answers after submission.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Exam Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Questions Answered:</span>
                  <span>{getAnsweredQuestions()} / {getTotalQuestions()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Remaining:</span>
                  <span>{formatTime(examState.timeRemaining)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Progress:</span>
                  <span>{Math.round(getProgressPercentage())}%</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setExamState(prev => ({ ...prev, showConfirmSubmit: false }))}
            >
              Continue Exam
            </Button>
            <Button
              onClick={() => {
                setExamState(prev => ({ ...prev, showConfirmSubmit: false }));
                submitExam();
              }}
              disabled={examState.isSubmitting}
            >
              {examState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Exam"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 