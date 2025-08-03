import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "./sidebar";
import AIHelper from "./ai-helper";
import { getCurrentUser } from "@/lib/auth";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getCurrentUser,
  });

  // Only show AI Assistant for victims and admins, not for officers
  const showAIAssistant = user?.role === 'victim' || user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      {showAIAssistant && <AIHelper currentPage="dashboard" userRole={user?.role || 'victim'} />}
    </div>
  );
}
