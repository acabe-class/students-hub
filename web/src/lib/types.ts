// User and Authentication Types
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: UserRole[];
    track?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type UserRole = 'student' | 'admin' | 'forum_moderator' | 'tutor';

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Scholarship Application Types
export interface ScholarshipApplication {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    track: string;
    educationLevel: string;
    currentOccupation: string;
    monthlyIncome: number;
    familySize: number;
    motivation: string;
    previousExperience: string;
    status: 'pending' | 'approved' | 'rejected' | 'exam_scheduled' | 'exam_completed' | 'accepted' | 'rejected_final';
    examScheduledAt?: string;
    examCompletedAt?: string;
    examScore?: number;
    examPassed?: boolean;
    createdAt: string;
    updatedAt: string;
}

// Exam Types
export interface Exam {
    id: string;
    track: string;
    title: string;
    description: string;
    duration: number; // in minutes
    totalQuestions: number;
    passingScore: number;
    isActive: boolean;
    questions: ExamQuestion[];
    createdAt: string;
    updatedAt: string;
}

export interface ExamQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number; // index of correct option
    explanation?: string;
}

export interface ExamSession {
    id: string;
    userId: string;
    examId: string;
    applicationId: string;
    startTime: string;
    endTime?: string;
    answers: Record<string, number>; // questionId -> selectedOptionIndex
    score?: number;
    passed?: boolean;
    status: 'in_progress' | 'completed' | 'expired';
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    track: string;
    scholarshipInterest: boolean;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface ScholarshipApplicationRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    track: string;
    educationLevel: string;
    currentOccupation: string;
    monthlyIncome: number;
    familySize: number;
    motivation: string;
    previousExperience: string;
}

// Form Types
export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    track: string;
    scholarshipInterest: boolean;
    agreeToTerms: boolean;
}

export interface ScholarshipFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    track: string;
    educationLevel: string;
    currentOccupation: string;
    monthlyIncome: number;
    familySize: number;
    motivation: string;
    previousExperience: string;
    agreeToTerms: boolean;
}

// Track Types
export interface Track {
    value: string;
    label: string;
    duration: string;
    description: string;
    examDuration: number;
}

// Status Types
export interface ExamStatus {
    applicationId: string;
    examScheduledAt: string;
    examCompletedAt?: string;
    score?: number;
    passed?: boolean;
    status: 'scheduled' | 'completed' | 'passed' | 'failed';
    verdict: 'pending' | 'accepted' | 'rejected';
}
