import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import AIHelper from "./ai-helper";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <AIHelper currentPage="dashboard" userRole="officer" />
    </div>
  );
}
