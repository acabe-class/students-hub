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

export type UserRole = 'student' | 'admin' | 'forum_moderator' | 'moderator' | 'tutor';

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

// Tutor Types
export interface TutorClass {
    id: string;
    title: string;
    description: string;
    track: string;
    date: string;
    time: string;
    duration: number;
    type: 'virtual' | 'recorded' | 'live';
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    students: number;
    maxStudents: number;
    materials: TutorMaterial[];
    assignments: TutorAssignment[];
}

export interface TutorMaterial {
    id: string;
    title: string;
    type: 'document' | 'video' | 'presentation' | 'link';
    url?: string;
    uploadedAt: string;
    size: string;
    downloads: number;
}

export interface TutorAssignment {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    type: 'quiz' | 'project' | 'homework';
    status: 'draft' | 'published' | 'closed';
    submissions: number;
    totalStudents: number;
}

export interface TutorStudent {
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

export interface TutorSubmission {
    id: string;
    studentId: string;
    studentName: string;
    assignmentId: string;
    assignmentTitle: string;
    assignmentType: 'quiz' | 'project' | 'homework' | 'exam';
    submittedAt: string;
    status: 'submitted' | 'graded' | 'late';
    score?: number;
    maxScore: number;
    feedback?: string;
    files: string[];
    track: string;
}

export interface TutorMessage {
    id: string;
    subject: string;
    content: string;
    senderId: string;
    senderName: string;
    recipientId: string;
    recipientName: string;
    sentAt: string;
    readAt?: string;
    status: 'sent' | 'delivered' | 'read';
    type: 'individual' | 'group' | 'announcement';
    priority: 'low' | 'medium' | 'high';
}

// Student Types
export interface StudentCourse {
    id: string;
    title: string;
    description: string;
    track: string;
    instructor: string;
    progress: number;
    totalModules: number;
    completedModules: number;
    totalLessons: number;
    completedLessons: number;
    startDate: string;
    endDate: string;
    status: 'active' | 'completed' | 'upcoming';
    modules: StudentCourseModule[];
}

export interface StudentCourseModule {
    id: string;
    title: string;
    description: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    duration: number;
    status: 'not_started' | 'in_progress' | 'completed';
    lessons: StudentCourseLesson[];
}

export interface StudentCourseLesson {
    id: string;
    title: string;
    type: 'video' | 'reading' | 'quiz' | 'assignment' | 'project';
    duration: number;
    status: 'not_started' | 'in_progress' | 'completed';
    completedAt?: string;
    materials: StudentCourseMaterial[];
}

export interface StudentCourseMaterial {
    id: string;
    title: string;
    type: 'video' | 'document' | 'presentation' | 'link' | 'recording';
    url?: string;
    size?: string;
    duration?: number;
    downloads: number;
}

export interface StudentAssignment {
    id: string;
    title: string;
    description: string;
    type: 'quiz' | 'project' | 'homework' | 'exam';
    course: string;
    dueDate: string;
    status: 'not_started' | 'in_progress' | 'submitted' | 'graded' | 'late';
    maxScore: number;
    score?: number;
    feedback?: string;
    submittedAt?: string;
    gradedAt?: string;
    files: string[];
    instructions: string;
    rubric?: string;
}

export interface StudentGrade {
    id: string;
    assignmentId: string;
    assignmentTitle: string;
    course: string;
    type: 'quiz' | 'project' | 'homework' | 'exam';
    score: number;
    maxScore: number;
    percentage: number;
    grade: string;
    feedback: string;
    gradedAt: string;
    submittedAt: string;
    instructor: string;
    rubric?: string;
}

export interface StudentSchedule {
    id: string;
    title: string;
    type: 'class' | 'workshop' | 'office_hours' | 'exam';
    date: string;
    time: string;
    duration: number;
    instructor: string;
    location: string;
    description: string;
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface StudentResource {
    id: string;
    title: string;
    type: 'document' | 'video' | 'presentation' | 'link' | 'recording';
    course: string;
    description: string;
    url?: string;
    size?: string;
    duration?: number;
    uploadedAt: string;
    downloads: number;
    tags: string[];
}

export interface StudentForumPost {
    id: string;
    title: string;
    content: string;
    author: string;
    authorId: string;
    createdAt: string;
    updatedAt?: string;
    likes: number;
    replies: number;
    tags: string[];
    isPinned: boolean;
    isLocked: boolean;
}

export interface StudentChallenge {
    id: string;
    title: string;
    description: string;
    type: 'coding' | 'quiz' | 'project' | 'hackathon';
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    startDate: string;
    endDate: string;
    status: 'upcoming' | 'active' | 'completed';
    participants: number;
    progress?: number;
    submission?: any;
}

export interface StudentSocialEvent {
    id: string;
    title: string;
    description: string;
    type: 'birthday' | 'hackathon' | 'social' | 'workshop';
    date: string;
    time: string;
    location: string;
    attendees: number;
    maxAttendees: number;
    isAttending: boolean;
}

// Moderator Types
export interface ModeratorPost {
    id: string;
    title: string;
    content: string;
    author: string;
    authorId: string;
    category: string;
    tags: string[];
    status: 'pending' | 'approved' | 'rejected' | 'flagged';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    createdAt: string;
    updatedAt?: string;
    reports: number;
    likes: number;
    replies: number;
    isPinned: boolean;
    moderationNotes?: string;
}

export interface ModeratorFlaggedContent {
    id: string;
    type: 'post' | 'comment' | 'user_profile' | 'message';
    title: string;
    content: string;
    author: string;
    authorId: string;
    category: string;
    violationType: 'spam' | 'harassment' | 'inappropriate' | 'copyright' | 'other';
    severity: 'low' | 'medium' | 'high' | 'critical';
    reports: number;
    reportedBy: string[];
    createdAt: string;
    status: 'pending' | 'reviewed' | 'removed' | 'warned' | 'banned';
    moderationNotes?: string;
    actionTaken?: string;
}

export interface ModeratorConflict {
    id: string;
    title: string;
    description: string;
    participants: string[];
    threadId: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'active' | 'resolved' | 'escalated';
    createdAt: string;
    resolvedAt?: string;
    moderatorNotes?: string;
    resolution?: string;
}

export interface ModeratorThread {
    id: string;
    title: string;
    author: string;
    category: string;
    status: 'active' | 'pinned' | 'locked' | 'archived';
    isHighlighted: boolean;
    views: number;
    replies: number;
    lastActivity: string;
    createdAt: string;
    tags: string[];
}

export interface ModeratorUser {
    id: string;
    username: string;
    email: string;
    role: string;
    status: 'active' | 'suspended' | 'banned';
    joinDate: string;
    lastActivity: string;
    postsCount: number;
    violationsCount: number;
    warningsCount: number;
    isModerated: boolean;
}

export interface ModeratorReport {
    id: string;
    type: 'user' | 'content' | 'behavior';
    title: string;
    description: string;
    reporter: string;
    reportedUser?: string;
    reportedContent?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
    createdAt: string;
    resolvedAt?: string;
    moderatorNotes?: string;
    actionTaken?: string;
}

export interface ModeratorAnalytics {
    totalPosts: number;
    pendingApproval: number;
    reportedContent: number;
    activeUsers: number;
    totalThreads: number;
    resolvedConflicts: number;
    averageResponseTime: number;
    communityHealth: number;
    moderationActions: {
        approved: number;
        rejected: number;
        removed: number;
        warned: number;
        banned: number;
    };
    violationsByType: {
        spam: number;
        harassment: number;
        inappropriate: number;
        copyright: number;
        other: number;
    };
}

export interface ModeratorSettings {
    autoApproval: boolean;
    requireModeration: boolean;
    maxReportsBeforeAction: number;
    warningThreshold: number;
    banThreshold: number;
    contentFilters: string[];
    notificationSettings: {
        email: boolean;
        push: boolean;
        urgentOnly: boolean;
    };
}
