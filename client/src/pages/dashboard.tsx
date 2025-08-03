import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Layout } from "@/components/layout";
import { TraceForm } from "@/components/trace-form";
import { TraceReport } from "@/components/trace-report";
import { TraceStatus } from "@/components/trace-status";
import { PremiumModal } from "@/components/premium-modal";
import { QuickExportButton } from "@/components/quick-export-button";
import { AdminContact } from "@/components/admin-contact";
import { AddAdminDialog } from "@/components/add-admin-dialog";
import VictimAssignment from "@/components/officer/victim-assignment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  CheckCircle, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Zap, 
  Upload,
  Bitcoin,
  Clock,
  FileText,
  Bell,
  Shield,
  Download,
  UserPlus,
  Users
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getCurrentUser,
  });

  const { data: traces = [] } = useQuery({
    queryKey: ["/api/traces"],
  });

  // Calculate stats from traces
  const stats = {
    activeTraces: traces.filter((t: any) => t.status === 'processing' || t.status === 'queued').length,
    completed: traces.filter((t: any) => t.status === 'completed').length,
    recovered: traces
      .filter((t: any) => t.status === 'completed' && t.results)
      .reduce((acc: number, t: any) => acc + parseFloat(t.results?.totalValue?.split(' ')[0] || '0'), 0),
    successRate: traces.length > 0 ? Math.round((traces.filter((t: any) => t.status === 'completed').length / traces.length) * 100) : 0,
  };

  const recentTraces = traces.slice(0, 3);



  const generateReport = async (traceId: number) => {
    try {
      const response = await fetch(`/api/traces/${traceId}/generate-report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSelectedReport(data.report);
        toast({
          title: "Report Generated",
          description: "Cryptocurrency trace analysis completed successfully.",
        });
      } else {
        throw new Error('Failed to generate report');
      }
    } catch (error) {
      toast({
        title: "Report Generation Failed",
        description: "Unable to generate trace report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'queued': return 'bg-slate-100 text-slate-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'completed': return 100;
      case 'processing': return 75;
      case 'queued': return 25;
      default: return 0;
    }
  };

  if (selectedReport) {
    return (
      <Layout>
        <div className="p-6">
          <TraceReport 
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
        </div>
      </Layout>
    );
  }



  return (
    <Layout>
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Investigation Dashboard</h2>
            <p className="text-slate-600">Submit case information for cryptocurrency theft investigations</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="w-5 h-5 text-slate-400 hover:text-slate-600 cursor-pointer" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.department}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Submitted Cases</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.activeTraces}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Search className="text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-accent">+2</span>
                <span className="text-slate-600 ml-1">this week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Completed</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-accent">+8</span>
                <span className="text-slate-600 ml-1">this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Assets Recovered</p>
                  <p className="text-3xl font-bold text-slate-900">${stats.recovered.toFixed(1)}K</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-accent">+$340K</span>
                <span className="text-slate-600 ml-1">this quarter</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Success Rate</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.successRate}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-accent">+3%</span>
                <span className="text-slate-600 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>



        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Officer Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Officer Portal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center py-4">
                  <UserPlus className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold text-slate-900 mb-2">Victim Assignment</h3>
                  <p className="text-sm text-slate-600 mb-4">Case information and evidence files can only be submitted when assigning victims to your cases. Use the "Assign New Victim" button to begin.</p>
                </div>
                <div className="pt-2 space-y-2">
                  <AdminContact />
                  <AddAdminDialog />
                </div>
              </CardContent>
            </Card>

            {/* Workflow Info */}
            <Card className="mt-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Officer Workflow</h3>
                <p className="text-blue-100 mb-4">Victim-Centered Case Management</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Step 1:</span>
                    <span>Assign victim to case</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Step 2:</span>
                    <span>Add case information</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Step 3:</span>
                    <span>Upload evidence files</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-700 rounded-lg text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Victim Assignment Required</span>
                  </div>
                  <p className="text-blue-100">Case information and evidence can only be submitted through the victim assignment process</p>
                </div>
                <div className="mt-4 p-3 bg-blue-600/20 border border-blue-300 rounded text-sm">
                  <div className="flex items-center gap-2 text-blue-200 mb-1">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Secure Process</span>
                  </div>
                  <p className="text-blue-200">Assign victim → Add case details → Upload evidence → Victim chooses processing speed → Investigation begins</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Victim Assignment Section */}
          <div className="lg:col-span-2">
            <VictimAssignment />
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Case Submissions</CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTraces.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No cases submitted yet. Submit your first case information!</p>
                    </div>
                  ) : (
                    recentTraces.map((trace: any) => (
                      <div key={trace.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Bitcoin className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{trace.caseNumber}</p>
                            <p className="text-sm text-slate-500">
                              {trace.walletAddress.substring(0, 20)}...
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <TraceStatus 
                            status={trace.status}
                            isPremium={trace.isPremium}
                            estimatedCompletion={trace.estimatedCompletion ? new Date(trace.estimatedCompletion) : undefined}
                          />
                          {trace.status === 'completed' && (
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                onClick={() => generateReport(trace.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                View Report
                              </Button>
                              <QuickExportButton 
                                traceId={trace.id.toString()}
                                caseNumber={trace.caseNumber}
                                size="sm"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <PremiumModal 
        open={showPremiumModal}
        onOpenChange={setShowPremiumModal}
        onUpgrade={() => {
          toast({
            title: "Premium Access Activated",
            description: "You now have access to instant traces.",
          });
        }}
      />
    </Layout>
  );
}
