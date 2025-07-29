import { useState } from "react";
import { 
  Home, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Trophy, 
  Calendar,
  FileText,
  Settings,
  HelpCircle,
  GraduationCap,
  BarChart3,
  Shield,
  ChevronRight,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  userRole: 'student' | 'tutor' | 'admin';
}

export function Sidebar({ isOpen, userRole }: SidebarProps) {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['main']);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  const studentMenuItems = [
    {
      group: "main",
      title: "Main",
      items: [
        { icon: Home, label: "Dashboard", path: "/", badge: null },
        { icon: BookOpen, label: "My Courses", path: "/courses", badge: null },
        { icon: FileText, label: "Assignments", path: "/assignments", badge: 3 },
        { icon: Calendar, label: "Schedule", path: "/schedule", badge: null },
      ]
    },
    {
      group: "progress",
      title: "Progress",
      items: [
        { icon: Trophy, label: "Leaderboard", path: "/leaderboard", badge: null },
        { icon: Target, label: "Challenges", path: "/challenges", badge: 2 },
        { icon: BarChart3, label: "Analytics", path: "/analytics", badge: null },
      ]
    },
    {
      group: "community",
      title: "Community",
      items: [
        { icon: MessageSquare, label: "Forum", path: "/forum", badge: 5 },
        { icon: Users, label: "Study Groups", path: "/groups", badge: null },
      ]
    },
    {
      group: "support",
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", path: "/help", badge: null },
        { icon: Settings, label: "Settings", path: "/settings", badge: null },
      ]
    }
  ];

  const tutorMenuItems = [
    {
      group: "main",
      title: "Main",
      items: [
        { icon: Home, label: "Dashboard", path: "/tutor", badge: null },
        { icon: GraduationCap, label: "My Students", path: "/tutor/students", badge: null },
        { icon: FileText, label: "Assignments", path: "/tutor/assignments", badge: null },
        { icon: BarChart3, label: "Grading", path: "/tutor/grading", badge: 8 },
      ]
    },
    {
      group: "community",
      title: "Community",
      items: [
        { icon: MessageSquare, label: "Forum", path: "/forum", badge: 2 },
        { icon: Calendar, label: "Schedule", path: "/tutor/schedule", badge: null },
      ]
    }
  ];

  const adminMenuItems = [
    {
      group: "main",
      title: "Main",
      items: [
        { icon: Home, label: "Dashboard", path: "/admin", badge: null },
        { icon: Users, label: "Users", path: "/admin/users", badge: null },
        { icon: Shield, label: "Cohorts", path: "/admin/cohorts", badge: null },
        { icon: BarChart3, label: "Analytics", path: "/admin/analytics", badge: null },
      ]
    }
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case 'tutor': return tutorMenuItems;
      case 'admin': return adminMenuItems;
      default: return studentMenuItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-smooth bg-sidebar border-r border-sidebar-border",
      isOpen ? "w-64" : "w-0 lg:w-16"
    )}>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
          {isOpen ? (
            <div className="flex items-center gap-2 px-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-sidebar-foreground">ACA Hub</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-2">
          {menuItems.map((group) => (
            <div key={group.group} className="space-y-1">
              {isOpen && (
                <Button
                  variant="ghost"
                  className="w-full justify-between h-8 px-2 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground"
                  onClick={() => toggleGroup(group.group)}
                >
                  <span className="font-medium">{group.title}</span>
                  <ChevronRight className={cn(
                    "h-3 w-3 transition-transform",
                    expandedGroups.includes(group.group) && "rotate-90"
                  )} />
                </Button>
              )}
              
              {(expandedGroups.includes(group.group) || !isOpen) && (
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      size={isOpen ? "default" : "icon"}
                      className={cn(
                        "w-full transition-all duration-200",
                        isOpen ? "justify-start px-3" : "justify-center",
                        isActive(item.path) 
                          ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-sidebar-primary" 
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                      asChild
                    >
                      <Link to={item.path}>
                        <item.icon className={cn("h-5 w-5", isOpen && "mr-3")} />
                        {isOpen && (
                          <>
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                              <Badge className="ml-auto bg-accent text-accent-foreground">
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </Link>
                    </Button>
                  ))}
                </div>
              )}
              
              {isOpen && <Separator className="my-2" />}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="p-3 border-t border-sidebar-border">
            <div className="bg-gradient-card rounded-lg p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">
                Track Progress
              </div>
              <div className="text-lg font-bold text-primary">Level 8</div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div className="progress-bar h-2 rounded-full w-3/4"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}