import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  userRole: 'student' | 'tutor' | 'admin';
}

export function Layout({ children, userRole }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-background w-full">
      <Header onMenuClick={toggleSidebar} userRole={userRole} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} userRole={userRole} />
        
        <main className={cn(
          "flex-1 transition-all duration-300 ease-smooth min-h-[calc(100vh-4rem)]",
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        )}>
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}