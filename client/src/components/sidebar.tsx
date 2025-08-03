import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Shield, BarChart3, Search, FolderOpen, FileText, Settings, HelpCircle, LogOut, Activity, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";
import { getCurrentUser } from "@/lib/auth";

// Navigation for officers (without AI Assistant)
const officerNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Live Demo", href: "/demo", icon: Activity },
  { name: "Active Traces", href: "/traces", icon: Search },
  { name: "Case Files", href: "/cases", icon: FolderOpen },
  { name: "Reports", href: "/reports", icon: FileText },
];

// Navigation for victims and admins (with AI Assistant)
const defaultNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "AI Assistant", href: "/ai-assistant", icon: Brain },
  { name: "Live Demo", href: "/demo", icon: Activity },
  { name: "Active Traces", href: "/traces", icon: Search },
  { name: "Case Files", href: "/cases", icon: FolderOpen },
  { name: "Reports", href: "/reports", icon: FileText },
];

const accountNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help & Support", href: "/help", icon: HelpCircle },
];

export function Sidebar() {
  const [location] = useLocation();
  
  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getCurrentUser,
  });

  // Use different navigation based on user role
  const navigation = user?.role === 'officer' ? officerNavigation : defaultNavigation;

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">CryptoTrace</h1>
            <p className="text-sm text-slate-500">Law Enforcement Portal</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <div className={`flex items-center px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    isActive 
                      ? "text-primary bg-blue-50 border border-blue-200" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}>
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        
        <div className="mt-8 pt-8 border-t border-slate-200">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Account</h3>
          <ul className="space-y-2">
            {accountNavigation.map((item) => {
              const Icon = item.icon;
              
              return (
                <li key={item.name}>
                  <Link href={item.href}>
                    <div className="flex items-center px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                  </Link>
                </li>
              );
            })}
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3 text-slate-600 hover:text-slate-900"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </Button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
}
