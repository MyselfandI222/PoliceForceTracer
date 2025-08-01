import { ReactNode } from "react";
import { VictimSidebar } from "./victim-sidebar";
import AIHelper from "./ai-helper";

interface VictimLayoutProps {
  children: ReactNode;
}

export function VictimLayout({ children }: VictimLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      <VictimSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <AIHelper currentPage="victim-portal" userRole="victim" />
    </div>
  );
}