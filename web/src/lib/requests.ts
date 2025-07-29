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
