import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Search, 
  Clock, 
  FileText, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  Download,
  Eye,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  Activity,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function VictimPortal() {
  const [selectedTrace, setSelectedTrace] = useState<any>(null);
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getCurrentUser,
  });

  // Mock victim data - would come from API
  const victimCases = [
    {
      id: 1,
      caseNumber: "VIC-2024-001",
      submittedDate: "2024-01-15",
      status: "completed",
      cryptoType: "Bitcoin",
      stolenAmount: "$125,000",
      recoveredAmount: "$89,500",
      walletAddress: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      officerAssigned: "Detective Sarah Johnson",
      department: "Metro PD Cyber Crimes",
      lastUpdate: "2024-01-20",
      description: "Cryptocurrency theft through phishing email attack",
      priority: "high"
    },
    {
      id: 2,
      caseNumber: "VIC-2024-002", 
      submittedDate: "2024-01-18",
      status: "processing",
      cryptoType: "Ethereum",
      stolenAmount: "$45,000",
      recoveredAmount: "$0",
      walletAddress: "0x742d35Cc6634C0532925a3b8D84F5f9F9a5c2",
      officerAssigned: "Detective Mike Chen",
      department: "Metro PD Cyber Crimes",
      lastUpdate: "2024-01-19",
      description: "Investment scam via fake DeFi platform",
      priority: "medium"
    },
    {
      id: 3,
      caseNumber: "VIC-2024-003",
      submittedDate: "2024-01-22",
      status: "queued",
      cryptoType: "Bitcoin",
      stolenAmount: "$75,000",
      recoveredAmount: "$0",
      walletAddress: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
      officerAssigned: "Pending Assignment",
      department: "Metro PD Cyber Crimes",
      lastUpdate: "2024-01-22",
      description: "Romance scam with cryptocurrency payments",
      priority: "medium"
    }
  ];

  const actionHistory = [
    {
      date: "2024-01-20",
      action: "Case VIC-2024-001 completed",
      officer: "Detective Johnson",
      details: "Investigation concluded, $89,500 recovered"
    },
    {
      date: "2024-01-19",
      action: "Evidence analysis updated",
      officer: "Detective Chen", 
      details: "Blockchain trace in progress for VIC-2024-002"
    },
    {
      date: "2024-01-18",
      action: "New case submitted",
      officer: "System",
      details: "VIC-2024-002 received and assigned"
    },
    {
      date: "2024-01-17",
      action: "Report generated",
      officer: "Detective Johnson",
      details: "Final report for VIC-2024-001 prepared"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'queued': return 'bg-slate-100 text-slate-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'completed': return 100;
      case 'processing': return 60;
      case 'queued': return 20;
      default: return 0;
    }
  };

  const handleDownloadReport = (caseId: number) => {
    toast({
      title: "Download Started",
      description: "Your case report is being prepared for download.",
    });
  };

  const handleViewDetails = (trace: any) => {
    setSelectedTrace(trace);
  };

  const totalStolen = victimCases.reduce((sum, c) => sum + parseFloat(c.stolenAmount.replace('$', '').replace(',', '')), 0);
  const totalRecovered = victimCases.reduce((sum, c) => sum + parseFloat(c.recoveredAmount.replace('$', '').replace(',', '')), 0);
  const recoveryRate = totalStolen > 0 ? Math.round((totalRecovered / totalStolen) * 100) : 0;

  return (
    <Layout>
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Victim Portal</h1>
            <p className="text-blue-100">Track your cryptocurrency theft investigation</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{user?.name || "Victim User"}</p>
              <p className="text-sm text-blue-200">Case Victim</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Cases</p>
                  <p className="text-3xl font-bold text-slate-900">{victimCases.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Amount Stolen</p>
                  <p className="text-3xl font-bold text-red-600">${totalStolen.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Amount Recovered</p>
                  <p className="text-3xl font-bold text-green-600">${totalRecovered.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Recovery Rate</p>
                  <p className="text-3xl font-bold text-blue-600">{recoveryRate}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="cases" className="space-y-6">
          <TabsList>
            <TabsTrigger value="cases">My Cases</TabsTrigger>
            <TabsTrigger value="history">Action History</TabsTrigger>
            <TabsTrigger value="contact">Contact Information</TabsTrigger>
          </TabsList>

          <TabsContent value="cases" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Investigation Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {victimCases.map((case_) => (
                    <div key={case_.id} className="border rounded-lg p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900">{case_.caseNumber}</h3>
                            <Badge className={getStatusColor(case_.status)}>
                              {case_.status.charAt(0).toUpperCase() + case_.status.slice(1)}
                            </Badge>
                            <Badge className={getPriorityColor(case_.priority)}>
                              {case_.priority.charAt(0).toUpperCase() + case_.priority.slice(1)} Priority
                            </Badge>
                          </div>
                          <p className="text-slate-600 mb-2">{case_.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-slate-500">Submitted:</span>
                              <p className="font-medium">{case_.submittedDate}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Crypto Type:</span>
                              <p className="font-medium">{case_.cryptoType}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Amount Stolen:</span>
                              <p className="font-medium text-red-600">{case_.stolenAmount}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Recovered:</span>
                              <p className="font-medium text-green-600">{case_.recoveredAmount}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(case_)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          {case_.status === 'completed' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownloadReport(case_.id)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Report
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Investigation Progress</span>
                          <span className="text-slate-600">{getProgressValue(case_.status)}%</span>
                        </div>
                        <Progress value={getProgressValue(case_.status)} className="h-2" />
                        
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{case_.officerAssigned}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Last updated: {case_.lastUpdate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Action History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {actionHistory.map((action, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-slate-900">{action.action}</h4>
                          <div className="flex items-center text-sm text-slate-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {action.date}
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm mb-1">{action.details}</p>
                        <div className="text-sm text-slate-500">
                          By: {action.officer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Officers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Detective Sarah Johnson</h4>
                        <p className="text-sm text-slate-600">Lead Investigator</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span>s.johnson@metropd.gov</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>(555) 123-4567</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-slate-400" />
                        <span>Badge #4521</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Detective Mike Chen</h4>
                        <p className="text-sm text-slate-600">Digital Forensics</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span>m.chen@metropd.gov</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>(555) 123-4568</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-slate-400" />
                        <span>Badge #4522</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-slate-900">Metro PD Cyber Crimes Unit</h4>
                      <p className="text-sm text-slate-600">Cryptocurrency & Digital Asset Division</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>123 Police Plaza, Metro City, MC 12345</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>Main: (555) 123-4500</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span>cybercrimes@metropd.gov</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h5 className="font-medium text-slate-900 mb-2">Emergency Contact</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-red-500" />
                          <span className="text-red-600 font-medium">24/7 Hotline: (555) 911-CYBER</span>
                        </div>
                        <p className="text-slate-600">For urgent matters or active theft in progress</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Case Details Modal would go here */}
    </Layout>
  );
}