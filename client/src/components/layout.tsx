import { ReactNode } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "./sidebar";
import AIHelper from "./ai-helper";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  
  // Extract page name from location for contextual AI assistance
  const getCurrentPage = () => {
    if (location.includes('/ai-assistant')) return 'ai-assistant';
    if (location.includes('/traces')) return 'traces';
    if (location.includes('/cases')) return 'cases';
    if (location.includes('/reports')) return 'reports';
    if (location.includes('/settings')) return 'settings';
    if (location.includes('/demo')) return 'demo';
    return 'dashboard';
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <AIHelper currentPage={getCurrentPage()} userRole="officer" />
    </div>
  );
}
