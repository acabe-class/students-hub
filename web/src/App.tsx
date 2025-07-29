import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import StudentDashboard from "./pages/student/StudentDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ScholarshipApplication from "./pages/ScholarshipApplication";
import ScholarshipExam from "./pages/ScholarshipExam";
import ExamResults from "./pages/ExamResults";
import ApplicationStatus from "./pages/ApplicationStatus";
import Unauthorized from "./pages/Unauthorized";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ApplicationsManagement from "./pages/admin/ApplicationsManagement";
import CohortManagement from "./pages/admin/CohortManagement";
import CommunicationsManagement from "./pages/admin/CommunicationsManagement";
import PaymentsManagement from "./pages/admin/PaymentsManagement";
import TutorLayout from "./components/layout/TutorLayout";
import TutorDashboard from "./pages/tutor/TutorDashboard";
import ClassManagement from "./pages/tutor/ClassManagement";
import StudentMonitoring from "./pages/tutor/StudentMonitoring";
import AssignmentsManagement from "./pages/tutor/AssignmentsManagement";
import GradingManagement from "./pages/tutor/GradingManagement";
import MessagesManagement from "./pages/tutor/MessagesManagement";
import StudentLayout from "./components/layout/StudentLayout";
import CourseManagement from "./pages/student/CourseManagement";
import AssignmentCenter from "./pages/student/AssignmentCenter";
import GradesCenter from "./pages/student/GradesCenter";
import ModeratorLayout from "./components/layout/ModeratorLayout";
import ModeratorDashboard from "./pages/moderator/ModeratorDashboard";
import PostReview from "./pages/moderator/PostReview";
import ContentModeration from "./pages/moderator/ContentModeration";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/scholarship-application" element={<ScholarshipApplication />} />
            <Route path="/scholarship-exam" element={<ScholarshipExam />} />
            <Route path="/exam-results" element={<ExamResults />} />
            <Route path="/application-status" element={<ApplicationStatus />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="applications" element={<ApplicationsManagement />} />
              <Route path="cohorts" element={<CohortManagement />} />
              <Route path="communications" element={<CommunicationsManagement />} />
              <Route path="payments" element={<PaymentsManagement />} />
            </Route>

            {/* Protected Tutor Routes */}
            <Route path="/tutor" element={
              <ProtectedRoute requiredRoles={['tutor']}>
                <TutorLayout />
              </ProtectedRoute>
            }>
              <Route index element={<TutorDashboard />} />
              <Route path="classes" element={<ClassManagement />} />
              <Route path="students" element={<StudentMonitoring />} />
              <Route path="assignments" element={<AssignmentsManagement />} />
              <Route path="grading" element={<GradingManagement />} />
              <Route path="messages" element={<MessagesManagement />} />
            </Route>

            {/* Protected Student Routes */}
            <Route path="/student" element={
              <ProtectedRoute requiredRoles={['student']}>
                <StudentLayout />
              </ProtectedRoute>
            }>
              <Route index element={<StudentDashboard />} />
              <Route path="courses" element={<CourseManagement />} />
              <Route path="assignments" element={<AssignmentCenter />} />
              <Route path="grades" element={<GradesCenter />} />
              <Route path="schedule" element={<StudentDashboard />} />
              <Route path="resources" element={<StudentDashboard />} />
              <Route path="forum" element={<StudentDashboard />} />
              <Route path="challenges" element={<StudentDashboard />} />
              <Route path="leaderboard" element={<StudentDashboard />} />
              <Route path="social" element={<StudentDashboard />} />
              <Route path="analytics" element={<StudentDashboard />} />
            </Route>

            {/* Protected Moderator Routes */}
            <Route path="/moderator" element={
              <ProtectedRoute requiredRoles={['moderator']}>
                <ModeratorLayout />
              </ProtectedRoute>
            }>
              <Route index element={<ModeratorDashboard />} />
              <Route path="posts" element={<PostReview />} />
              <Route path="content" element={<ContentModeration />} />
              <Route path="conflicts" element={<ModeratorDashboard />} />
              <Route path="threads" element={<ModeratorDashboard />} />
              <Route path="users" element={<ModeratorDashboard />} />
              <Route path="reports" element={<ModeratorDashboard />} />
              <Route path="analytics" element={<ModeratorDashboard />} />
              <Route path="settings" element={<ModeratorDashboard />} />
            </Route>

            {/* Error Routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
