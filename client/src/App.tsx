import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/theme-context";
import { isAuthenticated } from "@/lib/auth";
import { Suspense } from "react";
import LoginSelector from "@/pages/login-selector";
import Login from "@/pages/login";
import LoginVictim from "@/pages/login-victim";
import LoginAdmin from "@/pages/login-admin";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import Admin from "@/pages/admin";
import PremiumServices from "@/pages/premium-services";
import Settings from "@/pages/settings";
import OfficerSettings from "@/pages/officer-settings";
import AdminSettings from "@/pages/admin-settings";
import VictimSettings from "@/pages/victim-settings";
import Help from "@/pages/help";
import VictimPortal from "@/pages/victim-portal";
import PoliceAdmin from "@/pages/police-admin";
import { lazy } from "react";
const DemoInvestigation = lazy(() => import("@/pages/demo-investigation"));
import NotFound from "@/pages/not-found";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Redirect to="/login" />;
  }
  return <>{children}</>;
}

function Router() {
  const userType = localStorage.getItem('userType');
  
  const getDefaultRoute = () => {
    if (!isAuthenticated()) return "/login";
    
    switch (userType) {
      case 'victim': return "/victim-portal";
      case 'admin': return "/police-admin";
      case 'officer':
      default: return "/dashboard";
    }
  };

  return (
    <Switch>
      {/* Login Routes */}
      <Route path="/login" component={LoginSelector} />
      <Route path="/login/officer" component={Login} />
      <Route path="/login/victim" component={LoginVictim} />
      <Route path="/login/admin" component={LoginAdmin} />
      <Route path="/signup" component={Signup} />
      
      {/* Officer Routes */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      </Route>
      <Route path="/premium">
        <ProtectedRoute>
          <PremiumServices />
        </ProtectedRoute>
      </Route>
      <Route path="/premium-services">
        <ProtectedRoute>
          <PremiumServices />
        </ProtectedRoute>
      </Route>
      <Route path="/settings">
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      </Route>
      <Route path="/officer-settings">
        <ProtectedRoute>
          <OfficerSettings />
        </ProtectedRoute>
      </Route>
      <Route path="/admin-settings">
        <ProtectedRoute>
          <AdminSettings />
        </ProtectedRoute>
      </Route>
      <Route path="/victim-settings">
        <ProtectedRoute>
          <VictimSettings />
        </ProtectedRoute>
      </Route>
      
      <Route path="/help">
        <ProtectedRoute>
          <Help />
        </ProtectedRoute>
      </Route>
      <Route path="/demo">
        <Suspense fallback={<div className="flex items-center justify-center h-screen">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>}>
          <DemoInvestigation />
        </Suspense>
      </Route>
      
      {/* Victim Routes */}
      <Route path="/victim-portal">
        <ProtectedRoute>
          <VictimPortal />
        </ProtectedRoute>
      </Route>
      
      {/* Admin Routes */}
      <Route path="/police-admin">
        <ProtectedRoute>
          <PoliceAdmin />
        </ProtectedRoute>
      </Route>
      
      <Route path="/">
        <Redirect to={getDefaultRoute()} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
