import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: UserRole[];
    redirectTo?: string;
}

export function ProtectedRoute({
    children,
    requiredRoles = [],
    redirectTo = '/login'
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Check role-based access if required roles are specified
    if (requiredRoles.length > 0 && user) {
        const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role));

        if (!hasRequiredRole) {
            // Redirect to unauthorized page or dashboard
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
}

// Convenience components for specific roles
export function StudentRoute({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute requiredRoles={['student']}>
            {children}
        </ProtectedRoute>
    );
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute requiredRoles={['admin']}>
            {children}
        </ProtectedRoute>
    );
}

export function TutorRoute({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute requiredRoles={['tutor']}>
            {children}
        </ProtectedRoute>
    );
}

export function ModeratorRoute({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute requiredRoles={['forum_moderator']}>
            {children}
        </ProtectedRoute>
    );
}

// Route for users with multiple roles (student + moderator, etc.)
export function MultiRoleRoute({
    children,
    roles
}: {
    children: React.ReactNode;
    roles: UserRole[];
}) {
    return (
        <ProtectedRoute requiredRoles={roles}>
            {children}
        </ProtectedRoute>
    );
} 