import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Award,
  Activity,
  FileText,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Search,
  User,
  Shield,
  Phone,
  Mail
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function PoliceAdmin() {
  const [selectedMonth, setSelectedMonth] = useState("2024-01");
  const [selectedOfficer, setSelectedOfficer] = useState<any>(null);
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getCurrentUser,
  });

  // Mock officer performance data
  const officers = [
    {
      id: 1,
      name: "Detective Sarah Johnson",
      badgeNumber: "4521",
      email: "s.johnson@metropd.gov",
      phone: "(555) 123-4567",
      rank: "Detective",
      joinDate: "2022-03-15",
      cases: {
        total: 47,
        completed: 42,
        active: 3,
        pending: 2
      },
      recovery: {
        totalRecovered: 2840000,
        averageRecovery: 67619,
        successRate: 89
      },
      performance: {
        averageTime: 4.2,
        rating: 4.8,
        specialization: "Advanced Blockchain Analysis"
      },
      monthlyStats: {
        "2024-01": { cases: 8, completed: 7, recovered: 420000, successRate: 88 },
        "2023-12": { cases: 6, completed: 6, recovered: 315000, successRate: 100 },
        "2023-11": { cases: 9, completed: 8, recovered: 520000, successRate: 89 },
        "2023-10": { cases: 7, completed: 6, recovered: 280000, successRate: 86 },
        "2023-09": { cases: 5, completed: 5, recovered: 180000, successRate: 100 },
        "2023-08": { cases: 8, completed: 7, recovered: 390000, successRate: 88 }
      }
    },
    {
      id: 2,
      name: "Detective Mike Chen",
      badgeNumber: "4522",
      email: "m.chen@metropd.gov", 
      phone: "(555) 123-4568",
      rank: "Detective",
      joinDate: "2021-08-20",
      cases: {
        total: 62,
        completed: 56,
        active: 4,
        pending: 2
      },
      recovery: {
        totalRecovered: 3200000,
        averageRecovery: 57143,
        successRate: 90
      },
      performance: {
        averageTime: 3.8,
        rating: 4.9,
        specialization: "Digital Forensics & Cross-chain Analysis"
      },
      monthlyStats: {
        "2024-01": { cases: 10, completed: 9, recovered: 480000, successRate: 90 },
        "2023-12": { cases: 8, completed: 8, recovered: 360000, successRate: 100 },
        "2023-11": { cases: 11, completed: 10, recovered: 580000, successRate: 91 },
        "2023-10": { cases: 9, completed: 8, recovered: 320000, successRate: 89 },
        "2023-09": { cases: 7, completed: 7, recovered: 290000, successRate: 100 },
        "2023-08": { cases: 6, completed: 5, recovered: 210000, successRate: 83 }
      }
    },
    {
      id: 3,
      name: "Officer Lisa Rodriguez",
      badgeNumber: "4523",
      email: "l.rodriguez@metropd.gov",
      phone: "(555) 123-4569", 
      rank: "Officer",
      joinDate: "2023-01-10",
      cases: {
        total: 28,
        completed: 24,
        active: 2,
        pending: 2
      },
      recovery: {
        totalRecovered: 1580000,
        averageRecovery: 65833,
        successRate: 86
      },
      performance: {
        averageTime: 5.1,
        rating: 4.6,
        specialization: "Financial Crimes Investigation"
      },
      monthlyStats: {
        "2024-01": { cases: 4, completed: 3, recovered: 180000, successRate: 75 },
        "2023-12": { cases: 5, completed: 5, recovered: 240000, successRate: 100 },
        "2023-11": { cases: 6, completed: 5, recovered: 280000, successRate: 83 },
        "2023-10": { cases: 4, completed: 4, recovered: 160000, successRate: 100 },
        "2023-09": { cases: 3, completed: 2, recovered: 120000, successRate: 67 },
        "2023-08": { cases: 4, completed: 3, recovered: 140000, successRate: 75 }
      }
    }
  ];

  const months = [
    { value: "2024-01", label: "January 2024" },
    { value: "2023-12", label: "December 2023" },
    { value: "2023-11", label: "November 2023" },
    { value: "2023-10", label: "October 2023" },
    { value: "2023-09", label: "September 2023" },
    { value: "2023-08", label: "August 2023" }
  ];

  const getCurrentMonthData = () => {
    return officers.map(officer => ({
      ...officer,
      currentMonth: (officer.monthlyStats as any)[selectedMonth] || { cases: 0, completed: 0, recovered: 0, successRate: 0 }
    }));
  };

  const getDepartmentTotals = () => {
    const monthData = getCurrentMonthData();
    return {
      totalCases: monthData.reduce((sum, officer) => sum + officer.currentMonth.cases, 0),
      totalCompleted: monthData.reduce((sum, officer) => sum + officer.currentMonth.completed, 0),
      totalRecovered: monthData.reduce((sum, officer) => sum + officer.currentMonth.recovered, 0),
      averageSuccessRate: Math.round(monthData.reduce((sum, officer) => sum + officer.currentMonth.successRate, 0) / monthData.length),
      activeOfficers: officers.length
    };
  };

  const handlePreviousMonth = () => {
    const currentIndex = months.findIndex(month => month.value === selectedMonth);
    if (currentIndex < months.length - 1) {
      setSelectedMonth(months[currentIndex + 1].value);
    }
  };

  const handleNextMonth = () => {
    const currentIndex = months.findIndex(month => month.value === selectedMonth);
    if (currentIndex > 0) {
      setSelectedMonth(months[currentIndex - 1].value);
    }
  };

  const handleViewOfficer = (officer: any) => {
    setSelectedOfficer(officer);
  };

  const totals = getDepartmentTotals();
  const currentMonthLabel = months.find(month => month.value === selectedMonth)?.label;

  if (selectedOfficer) {
    return (
      <Layout>
        <div className="p-6">
          {/* Officer Detail Header */}
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedOfficer(null)}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </Button>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>

          {/* Officer Profile */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">{selectedOfficer.name}</h1>
                    <p className="text-slate-600">{selectedOfficer.rank} • Badge #{selectedOfficer.badgeNumber}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{selectedOfficer.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{selectedOfficer.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-slate-500">Performance Rating:</span>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">{selectedOfficer.performance.rating}/5.0</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">Joined: {selectedOfficer.joinDate}</p>
                  <p className="text-sm text-slate-600">{selectedOfficer.performance.specialization}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Officer Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Cases</p>
                    <p className="text-3xl font-bold text-slate-900">{selectedOfficer.cases.total}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Active: {selectedOfficer.cases.active} • Pending: {selectedOfficer.cases.pending}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Success Rate</p>
                    <p className="text-3xl font-bold text-green-600">{selectedOfficer.recovery.successRate}%</p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {selectedOfficer.cases.completed} of {selectedOfficer.cases.total} completed
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Recovered</p>
                    <p className="text-3xl font-bold text-yellow-600">${(selectedOfficer.recovery.totalRecovered / 1000000).toFixed(1)}M</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Avg: ${selectedOfficer.recovery.averageRecovery.toLocaleString()} per case
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Avg Time</p>
                    <p className="text-3xl font-bold text-purple-600">{selectedOfficer.performance.averageTime}</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Days per case completion
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {months.map(month => {
                  const monthData = selectedOfficer.monthlyStats[month.value];
                  if (!monthData) return null;
                  
                  return (
                    <div key={month.value} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{month.label}</h4>
                        <Badge className={monthData.successRate >= 90 ? 'bg-green-100 text-green-800' : 
                                       monthData.successRate >= 80 ? 'bg-yellow-100 text-yellow-800' : 
                                       'bg-red-100 text-red-800'}>
                          {monthData.successRate}% Success Rate
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Cases:</span>
                          <p className="font-medium">{monthData.cases}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Completed:</span>
                          <p className="font-medium">{monthData.completed}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Recovered:</span>
                          <p className="font-medium">${monthData.recovered.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Progress:</span>
                          <Progress value={(monthData.completed / monthData.cases) * 100} className="h-2 mt-1" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Police Administrator Dashboard</h1>
            <p className="text-slate-300">Monitor officer performance and department statistics</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{user?.name || "Administrator"}</p>
              <p className="text-sm text-slate-300">Police Administrator</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Month Navigation */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold">Performance Overview</h2>
                <Badge variant="outline">{currentMonthLabel}</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handlePreviousMonth}
                  disabled={selectedMonth === months[months.length - 1].value}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleNextMonth}
                  disabled={selectedMonth === months[0].value}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Department Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Officers</p>
                  <p className="text-3xl font-bold text-slate-900">{totals.activeOfficers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Cases</p>
                  <p className="text-3xl font-bold text-slate-900">{totals.totalCases}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{totals.totalCompleted}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Recovered</p>
                  <p className="text-3xl font-bold text-yellow-600">${(totals.totalRecovered / 1000000).toFixed(1)}M</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Success Rate</p>
                  <p className="text-3xl font-bold text-blue-600">{totals.averageSuccessRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Officer Performance Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Officer Performance - {currentMonthLabel}</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getCurrentMonthData().map(officer => (
                <div key={officer.id} className="border rounded-lg p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{officer.name}</h3>
                        <p className="text-slate-600">{officer.rank} • Badge #{officer.badgeNumber}</p>
                        <p className="text-sm text-slate-500">{officer.performance.specialization}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">{officer.performance.rating}/5.0</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewOfficer(officer)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-slate-900">{officer.currentMonth.cases}</p>
                      <p className="text-sm text-slate-600">Cases</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{officer.currentMonth.completed}</p>
                      <p className="text-sm text-slate-600">Completed</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-600">${(officer.currentMonth.recovered / 1000).toFixed(0)}K</p>
                      <p className="text-sm text-slate-600">Recovered</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{officer.currentMonth.successRate}%</p>
                      <p className="text-sm text-slate-600">Success Rate</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{officer.performance.averageTime}</p>
                      <p className="text-sm text-slate-600">Avg Days</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-slate-600 mb-1">
                      <span>Monthly Progress</span>
                      <span>{Math.round((officer.currentMonth.completed / officer.currentMonth.cases) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(officer.currentMonth.completed / officer.currentMonth.cases) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}