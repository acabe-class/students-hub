import { Bell, User, Menu, MessageSquare, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onMenuClick: () => void;
  userRole: 'student' | 'tutor' | 'admin';
}

export function Header({ onMenuClick, userRole }: HeaderProps) {
  const { user, logout } = useAuth();

  const mockUser = {
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "User",
    email: user?.email || "user@example.com",
    avatar: "/placeholder.svg?height=32&width=32",
    notifications: 3,
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 shadow-sm sticky top-0 z-50 backdrop-blur-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-foreground text-lg hidden sm:block">
            ACA Student Hub
          </span>
        </Link>
      </div>

      {/* Center - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses, assignments..."
            className="pl-10 bg-muted/50 border-border/50 focus:bg-background"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Forum Quick Access */}
        <Button variant="ghost" size="icon" asChild>
          <Link to="/forum">
            <MessageSquare className="h-5 w-5" />
          </Link>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {mockUser.notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-accent">
                  {mockUser.notifications}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="space-y-1">
                <p className="font-medium">New Assignment Posted</p>
                <p className="text-sm text-muted-foreground">
                  JavaScript Fundamentals Quiz is now available
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="space-y-1">
                <p className="font-medium">Forum Reply</p>
                <p className="text-sm text-muted-foreground">
                  Sarah replied to your React question
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-10 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{mockUser.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}