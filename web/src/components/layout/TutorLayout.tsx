import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout } from "./Layout";
import { useAuth } from "@/contexts/AuthContext";

export default function TutorLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    const tutorMenuItems = [
        {
            title: "Dashboard",
            path: "/tutor",
            icon: "📊",
            description: "Overview and quick actions"
        },
        {
            title: "Classes",
            path: "/tutor/classes",
            icon: "🎓",
            description: "Manage teaching sessions"
        },
        {
            title: "Students",
            path: "/tutor/students",
            icon: "👥",
            description: "Monitor student progress"
        },
        {
            title: "Assignments",
            path: "/tutor/assignments",
            icon: "📝",
            description: "Create and manage assignments"
        },
        {
            title: "Grading",
            path: "/tutor/grading",
            icon: "✅",
            description: "Grade student submissions"
        },
        {
            title: "Messages",
            path: "/tutor/messages",
            icon: "💬",
            description: "Communicate with students"
        }
    ];

    return (
        <Layout userRole="tutor">
            <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-64 bg-background border-r border-border p-4 space-y-4">
                    <div className="pb-4 border-b border-border">
                        <h2 className="text-lg font-semibold text-primary">Tutor Portal</h2>
                        <p className="text-sm text-muted-foreground">
                            Welcome, {user?.firstName}
                        </p>
                    </div>

                    <nav className="space-y-2">
                        {tutorMenuItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${isActive(item.path)
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted"
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <div>
                                    <div className="font-medium">{item.title}</div>
                                    <div className="text-xs opacity-75">{item.description}</div>
                                </div>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-6">
                        <Outlet />
                    </div>
                </div>
            </div>
        </Layout>
    );
} 