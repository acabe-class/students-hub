import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout } from "./Layout";
import { useAuth } from "@/contexts/AuthContext";

export default function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const studentMenuItems = [
    {
      title: "Dashboard",
      path: "/student",
      icon: "📊",
      description: "Overview and quick access"
    },
    {
      title: "Courses",
      path: "/student/courses",
      icon: "📚",
      description: "Course content and progress"
    },
    {
      title: "Assignments",
      path: "/student/assignments",
      icon: "📝",
      description: "View and submit assignments"
    },
    {
      title: "Grades",
      path: "/student/grades",
      icon: "📊",
      description: "View grades and feedback"
    },
    {
      title: "Schedule",
      path: "/student/schedule",
      icon: "📅",
      description: "Class schedule and attendance"
    },
    {
      title: "Resources",
      path: "/student/resources",
      icon: "📁",
      description: "Notes, recordings, and projects"
    },
    {
      title: "Forum",
      path: "/student/forum",
      icon: "💬",
      description: "Discussion boards"
    },
    {
      title: "Challenges",
      path: "/student/challenges",
      icon: "🎯",
      description: "Weekly challenges and competitions"
    },
    {
      title: "Leaderboard",
      path: "/student/leaderboard",
      icon: "🏆",
      description: "Student rankings and achievements"
    },
    {
      title: "Social",
      path: "/student/social",
      icon: "👥",
      description: "Events and community"
    },
    {
      title: "Analytics",
      path: "/student/analytics",
      icon: "📈",
      description: "Progress analytics and insights"
    }
  ];

  return (
    <Layout userRole="student">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 bg-background border-r border-border p-4 space-y-4">
          <div className="pb-4 border-b border-border">
            <h2 className="text-lg font-semibold text-primary">Student Portal</h2>
            <p className="text-sm text-muted-foreground">
              Welcome, {user?.firstName}
            </p>
          </div>
          
          <nav className="space-y-2">
            {studentMenuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive(item.path)
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