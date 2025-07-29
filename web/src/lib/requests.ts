import {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ScholarshipApplicationRequest,
  User,
  ScholarshipApplication,
  Exam,
  ExamSession,
  ExamStatus
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

// Authentication API functions
export const authApi = {
  // Login
  login: async (credentials: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiRequest<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Register
  register: async (userData: RegisterRequest): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiRequest<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Forgot Password
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Reset Password
  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Verify Magic Link
  verifyMagicLink: async (token: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiRequest<{ user: User; token: string }>(`/auth/verify-magic-link?token=${token}`);
  },

  // Get Current User
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return apiRequest<User>('/auth/me');
  },

  // Logout
  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest<{ message: string }>('/auth/logout', {
      method: 'POST',
    });
  },
};

// Scholarship Application API functions
export const scholarshipApi = {
  // Submit Application
  submitApplication: async (application: ScholarshipApplicationRequest): Promise<ApiResponse<ScholarshipApplication>> => {
    return apiRequest<ScholarshipApplication>('/scholarship/applications', {
      method: 'POST',
      body: JSON.stringify(application),
    });
  },

  // Get Application Status
  getApplicationStatus: async (email: string): Promise<ApiResponse<ScholarshipApplication>> => {
    return apiRequest<ScholarshipApplication>(`/scholarship/applications/status?email=${email}`);
  },

  // Get Application by ID
  getApplication: async (id: string): Promise<ApiResponse<ScholarshipApplication>> => {
    return apiRequest<ScholarshipApplication>(`/scholarship/applications/${id}`);
  },

  // Update Application
  updateApplication: async (id: string, updates: Partial<ScholarshipApplicationRequest>): Promise<ApiResponse<ScholarshipApplication>> => {
    return apiRequest<ScholarshipApplication>(`/scholarship/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// Exam API functions
export const examApi = {
  // Get Exam by Track
  getExamByTrack: async (track: string): Promise<ApiResponse<Exam>> => {
    return apiRequest<Exam>(`/exams/track/${track}`);
  },

  // Start Exam Session
  startExam: async (examId: string, applicationId: string): Promise<ApiResponse<ExamSession>> => {
    return apiRequest<ExamSession>('/exams/start', {
      method: 'POST',
      body: JSON.stringify({ examId, applicationId }),
    });
  },

  // Submit Exam Answers
  submitExam: async (sessionId: string, answers: Record<string, number>): Promise<ApiResponse<{ score: number; passed: boolean }>> => {
    return apiRequest<{ score: number; passed: boolean }>(`/exams/${sessionId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },

  // Get Exam Session
  getExamSession: async (sessionId: string): Promise<ApiResponse<ExamSession>> => {
    return apiRequest<ExamSession>(`/exams/sessions/${sessionId}`);
  },

  // Get Exam Status
  getExamStatus: async (applicationId: string): Promise<ApiResponse<ExamStatus>> => {
    return apiRequest<ExamStatus>(`/exams/status/${applicationId}`);
  },
};

// Utility functions
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Tutor API functions
export const tutorApi = {
  // Get tutor dashboard stats
  getDashboardStats: async (): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/tutor/dashboard/stats');
  },

  // Get tutor's classes
  getClasses: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/tutor/classes');
  },

  // Create a new class
  createClass: async (classData: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/tutor/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  },

  // Get tutor's students
  getStudents: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/tutor/students');
  },

  // Get student submissions
  getSubmissions: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/tutor/submissions');
  },

  // Grade a submission
  gradeSubmission: async (submissionId: string, gradeData: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/tutor/submissions/${submissionId}/grade`, {
      method: 'POST',
      body: JSON.stringify(gradeData),
    });
  },

  // Send message to student
  sendMessage: async (messageData: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/tutor/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  // Get tutor's messages
  getMessages: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/tutor/messages');
  },

  // Update attendance
  updateAttendance: async (attendanceData: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/tutor/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  },
};

// Student API functions
export const studentApi = {
  // Get student dashboard stats
  getDashboardStats: async (): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/student/dashboard/stats');
  },

  // Get student's courses
  getCourses: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/student/courses');
  },

  // Get course details
  getCourseDetails: async (courseId: string): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/student/courses/${courseId}`);
  },

  // Get student's assignments
  getAssignments: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/student/assignments');
  },

  // Submit assignment
  submitAssignment: async (assignmentId: string, submissionData: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/student/assignments/${assignmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  },

  // Get student's grades
  getGrades: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/student/grades');
  },

  // Get student's schedule
  getSchedule: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/student/schedule');
  },

  // Get student's resources
  getResources: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/student/resources');
  },

  // Get forum posts
  getForumPosts: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/student/forum/posts');
  },

  // Create forum post
  createForumPost: async (postData: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/student/forum/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  // Get challenges
  getChallenges: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/student/challenges');
  },

  // Submit challenge
  submitChallenge: async (challengeId: string, submissionData: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/student/challenges/${challengeId}/submit`, {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  },

  // Get leaderboard
  getLeaderboard: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/student/leaderboard');
  },

  // Get social events
  getSocialEvents: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/student/social/events');
  },

  // Get analytics
  getAnalytics: async (): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/student/analytics');
  },
};

// Moderator API functions
export const moderatorApi = {
  // Get moderator dashboard stats
  getDashboardStats: async (): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/moderator/dashboard/stats');
  },

  // Get posts for review
  getPostsForReview: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/moderator/posts/review');
  },

  // Review a post
  reviewPost: async (postId: string, reviewData: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/moderator/posts/${postId}/review`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  // Get flagged content
  getFlaggedContent: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/moderator/content/flagged');
  },

  // Take action on content
  takeContentAction: async (contentId: string, actionData: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/moderator/content/${contentId}/action`, {
      method: 'POST',
      body: JSON.stringify(actionData),
    });
  },

  // Get conflicts for resolution
  getConflicts: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/moderator/conflicts');
  },

  // Resolve a conflict
  resolveConflict: async (conflictId: string, resolutionData: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/moderator/conflicts/${conflictId}/resolve`, {
      method: 'POST',
      body: JSON.stringify(resolutionData),
    });
  },

  // Get thread management data
  getThreads: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/moderator/threads');
  },

  // Highlight a thread
  highlightThread: async (threadId: string, highlightData: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/moderator/threads/${threadId}/highlight`, {
      method: 'POST',
      body: JSON.stringify(highlightData),
    });
  },

  // Get user management data
  getUsers: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/moderator/users');
  },

  // Manage user permissions
  manageUserPermissions: async (userId: string, permissionData: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/moderator/users/${userId}/permissions`, {
      method: 'POST',
      body: JSON.stringify(permissionData),
    });
  },

  // Get user reports
  getReports: async (): Promise<ApiResponse<any[]>> => {
    return apiRequest<any[]>('/moderator/reports');
  },

  // Handle a report
  handleReport: async (reportId: string, handlingData: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>(`/moderator/reports/${reportId}/handle`, {
      method: 'POST',
      body: JSON.stringify(handlingData),
    });
  },

  // Get moderation analytics
  getAnalytics: async (): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/moderator/analytics');
  },

  // Get moderation settings
  getSettings: async (): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/moderator/settings');
  },

  // Update moderation settings
  updateSettings: async (settingsData: any): Promise<ApiResponse<any>> => {
    return apiRequest<any>('/moderator/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  },
};
