import { ReactNode } from "react";
import { VictimSidebar } from "./victim-sidebar";

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
    </div>
  );
}