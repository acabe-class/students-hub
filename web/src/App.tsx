import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import StudentDashboard from "./pages/StudentDashboard";
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

            {/* Protected Student Routes */}
            <Route path="/courses" element={
              <ProtectedRoute requiredRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/assignments" element={
              <ProtectedRoute requiredRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/schedule" element={
              <ProtectedRoute requiredRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute requiredRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/challenges" element={
              <ProtectedRoute requiredRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute requiredRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/forum" element={
              <ProtectedRoute requiredRoles={['student', 'forum_moderator']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/groups" element={
              <ProtectedRoute requiredRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            } />

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
