import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout } from "./Layout";
import { useAuth } from "@/contexts/AuthContext";

export default function ModeratorLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    const moderatorMenuItems = [
        {
            title: "Dashboard",
            path: "/moderator",
            icon: "📊",
            description: "Overview and quick access"
        },
        {
            title: "Post Review",
            path: "/moderator/posts",
            icon: "📝",
            description: "Review and approve posts"
        },
        {
            title: "Content Moderation",
            path: "/moderator/content",
            icon: "🛡️",
            description: "Remove inappropriate content"
        },
        {
            title: "Conflict Resolution",
            path: "/moderator/conflicts",
            icon: "🤝",
            description: "Mediate discussions"
        },
        {
            title: "Thread Management",
            path: "/moderator/threads",
            icon: "📌",
            description: "Highlight and manage threads"
        },
        {
            title: "User Management",
            path: "/moderator/users",
            icon: "👥",
            description: "Manage user permissions"
        },
        {
            title: "Reports",
            path: "/moderator/reports",
            icon: "🚨",
            description: "Handle user reports"
        },
        {
            title: "Analytics",
            path: "/moderator/analytics",
            icon: "📈",
            description: "Forum activity insights"
        },
        {
            title: "Settings",
            path: "/moderator/settings",
            icon: "⚙️",
            description: "Moderation settings"
        }
    ];

    return (
        <Layout userRole="moderator">
            <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-64 bg-background border-r border-border p-4 space-y-4">
                    <div className="pb-4 border-b border-border">
                        <h2 className="text-lg font-semibold text-primary">Moderator Portal</h2>
                        <p className="text-sm text-muted-foreground">
                            Welcome, {user?.firstName}
                        </p>
                    </div>

                    <nav className="space-y-2">
                        {moderatorMenuItems.map((item) => (
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