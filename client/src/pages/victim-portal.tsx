import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { VictimLayout } from "@/components/victim-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuickExportButton } from "@/components/quick-export-button";

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
  BarChart3,
  Zap,
  Star,
  Timer
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

  const victimCases = [
    {
      id: 1,
      caseNumber: "CRY-2024-78432",
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
      caseNumber: "CRY-2024-78433", 
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
      caseNumber: "CRY-2024-78434",
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
      action: "Case CRY-2024-78432 completed",
      officer: "Detective Johnson",
      details: "Investigation concluded, $89,500 recovered"
    },
    {
      date: "2024-01-19",
      action: "Evidence analysis updated",
      officer: "Detective Chen", 
      details: "Blockchain trace in progress for CRY-2024-78433"
    },
    {
      date: "2024-01-18",
      action: "New case submitted",
      officer: "System",
      details: "CRY-2024-78433 received and assigned"
    },
    {
      date: "2024-01-17",
      action: "Report generated",
      officer: "Detective Johnson",
      details: "Final report for CRY-2024-78432 prepared"
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

  const handleUpgradeCase = () => {
    toast({
      title: "Upgrade Initiated",
      description: "Redirecting to secure payment processing...",
    });
    // In a real app, this would redirect to Stripe payment or similar
    setTimeout(() => {
      toast({
        title: "Payment Processing",
        description: "Please complete payment to upgrade your case to instant trace.",
      });
    }, 1500);
  };

  const totalStolen = victimCases.reduce((sum, c) => sum + parseFloat(c.stolenAmount.replace('$', '').replace(',', '')), 0);
  const totalRecovered = victimCases.reduce((sum, c) => sum + parseFloat(c.recoveredAmount.replace('$', '').replace(',', '')), 0);
  const recoveryRate = totalStolen > 0 ? Math.round((totalRecovered / totalStolen) * 100) : 0;

  return (
    <VictimLayout>
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
            <TabsTrigger value="instant">Upgrade Cases</TabsTrigger>
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
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDownloadReport(case_.id)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Report
                              </Button>
                              <QuickExportButton 
                                traceId={case_.id.toString()}
                                caseNumber={case_.caseNumber}
                                size="sm"
                              />
                            </div>
                          )}
                          {(case_.status === 'queued' || case_.status === 'processing') && (
                            <Button 
                              className="bg-yellow-600 hover:bg-yellow-700 text-white"
                              size="sm"
                              onClick={handleUpgradeCase}
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              Upgrade to Instant ($995)
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

          <TabsContent value="instant" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <span>Upgrade Cases to Instant Processing</span>
                  </CardTitle>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">
                      <Timer className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Upgrade Existing Cases</h3>
                      <p className="text-slate-700 mb-4">
                        Upgrade cases submitted by law enforcement to instant processing for $995 per trace. Cases automatically process free every Wednesday at midnight, or you can upgrade individual cases for immediate 1-2 hour processing.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">1-2 hour processing time</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Advanced blockchain analysis</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Real-time status updates</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Priority investigator assignment</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Detailed recovery analysis</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Cross-chain transaction tracking</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-2 border-slate-200">
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <Clock className="w-8 h-8 text-slate-600 mx-auto" />
                        <div>
                          <h4 className="font-semibold text-slate-900">Standard Processing</h4>
                          <p className="text-sm text-slate-600">Current service level</p>
                        </div>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-slate-900">FREE</div>
                          <div className="text-sm text-slate-600">3-7 business days</div>
                          <div className="text-xs text-slate-500">Queue-based processing</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50">
                    <CardContent className="p-6">
                      <div className="text-center space-y-4">
                        <Zap className="w-8 h-8 text-yellow-600 mx-auto" />
                        <div>
                          <div className="bg-slate-100 p-3 rounded-lg mb-4">
                            <p className="text-sm text-slate-600 text-center">
                              Select a case from "My Cases" tab to upgrade
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">Instant Processing</h4>
                          <p className="text-sm text-slate-600">Upgrade existing cases</p>
                        </div>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-yellow-600">$995</div>
                          <div className="text-sm text-slate-600">1-2 hours</div>
                          <div className="text-xs text-slate-500">Priority queue</div>
                        </div>
                        <Button 
                          className="w-full bg-slate-400 text-white cursor-not-allowed"
                          disabled
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Select Case to Upgrade
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3">Why Choose Instant Trace?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                        <span><strong>Time-Critical Cases:</strong> When immediate action could prevent further losses or help recovery efforts</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                        <span><strong>Higher Recovery Potential:</strong> Faster analysis means better chance of asset recovery</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                        <span><strong>Peace of Mind:</strong> Quick resolution reduces stress and uncertainty</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                        <span><strong>Legal Proceedings:</strong> Urgent evidence needed for court cases or insurance claims</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                        <span><strong>Business Cases:</strong> Corporate theft requiring immediate investigation</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                        <span><strong>Large Amounts:</strong> High-value cases where speed is crucial</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-slate-50">
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="w-4 h-4 text-slate-600" />
                    <span className="font-medium text-slate-900">Service Guarantee</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    If we cannot deliver your instant trace results within 2 hours, you will receive a full refund. 
                    Our premium service maintains a 99.2% on-time delivery rate with the same investigative quality as standard traces.
                  </p>
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
    </VictimLayout>
  );
}