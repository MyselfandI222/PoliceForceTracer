import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ExportDialog } from "@/components/export-dialog";
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Users, 
  FileText,
  Download,
  Eye,
  AlertCircle,
  Printer,
  Share
} from "lucide-react";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  amount: number;
  timestamp: Date;
  blockHeight: number;
  confirmations: number;
  fee: number;
}

interface AddressInfo {
  address: string;
  balance: number;
  totalReceived: number;
  totalSent: number;
  transactionCount: number;
  firstSeen: Date;
  lastSeen: Date;
  riskScore: number;
  tags: string[];
  cluster?: string;
}

interface TraceReport {
  targetAddress: string;
  cryptocurrency: string;
  totalValue: number;
  riskAssessment: string;
  summary: string;
  transactions: Transaction[];
  connectedAddresses: AddressInfo[];
  flowAnalysis: {
    incomingValue: number;
    outgoingValue: number;
    netFlow: number;
    majorRecipients: Array<{ address: string; amount: number; percentage: number }>;
    timePattern: string;
  };
  riskFactors: Array<{ factor: string; severity: "low" | "medium" | "high"; description: string }>;
  recommendations: string[];
  reportId: string;
  generatedAt: Date;
}

interface TraceReportProps {
  report: TraceReport;
  onClose?: () => void;
}

export function TraceReport({ report, onClose }: TraceReportProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(amount);
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const getRiskIcon = (severity: string) => {
    switch (severity) {
      case "high": return <AlertTriangle className="h-4 w-4" />;
      case "medium": return <AlertCircle className="h-4 w-4" />;
      case "low": return <Shield className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Cryptocurrency Trace Report</h2>
          <p className="text-sm text-slate-500">Report ID: {report.reportId}</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportDialog report={report} caseNumber="CRY-2024-78432">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </ExportDialog>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          {onClose && (
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Risk Assessment Banner */}
      <Card className={`border-l-4 ${
        report.riskAssessment === "HIGH RISK" ? "border-l-red-500 bg-red-50" :
        report.riskAssessment === "MEDIUM RISK" ? "border-l-yellow-500 bg-yellow-50" :
        "border-l-green-500 bg-green-50"
      }`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {report.riskAssessment === "HIGH RISK" ? (
                <AlertTriangle className="h-6 w-6 text-red-600" />
              ) : report.riskAssessment === "MEDIUM RISK" ? (
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              ) : (
                <Shield className="h-6 w-6 text-green-600" />
              )}
              <div>
                <h3 className="font-semibold text-lg">{report.riskAssessment}</h3>
                <p className="text-sm text-slate-600">{report.summary}</p>
              </div>
            </div>
            <Badge variant={
              report.riskAssessment === "HIGH RISK" ? "destructive" :
              report.riskAssessment === "MEDIUM RISK" ? "default" : "secondary"
            }>
              {report.riskAssessment}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(report.totalValue)} {report.cryptocurrency.includes('BTC') ? 'BTC' : 'ETH'}</p>
              </div>
              <DollarSign className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Transactions</p>
                <p className="text-2xl font-bold">{report.transactions.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Connected Addresses</p>
                <p className="text-2xl font-bold">{report.connectedAddresses.length}</p>
              </div>
              <Users className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Generated</p>
                <p className="text-sm font-bold">{new Date(report.generatedAt).toLocaleDateString()}</p>
              </div>
              <Clock className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="flow">Flow Analysis</TabsTrigger>
          <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Target Address Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">Address</p>
                  <p className="font-mono text-sm break-all">{report.targetAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Cryptocurrency</p>
                  <p className="text-sm">{report.cryptocurrency}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Analysis Summary</p>
                  <p className="text-sm">{report.summary}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {report.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full mt-2" />
                      <p className="text-sm">{rec}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.transactions.slice(0, 10).map((tx, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-xs text-slate-500">{formatAddress(tx.hash)}</p>
                        <Badge variant="outline">{tx.confirmations} confirmations</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm">From: {formatAddress(tx.from)}</p>
                        <p className="text-sm">To: {formatAddress(tx.to)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(tx.amount)} {report.cryptocurrency.includes('BTC') ? 'BTC' : 'ETH'}</p>
                      <p className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Addresses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.connectedAddresses.map((addr, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-mono text-sm break-all">{formatAddress(addr.address)}</p>
                      <div className="flex items-center gap-2">
                        <Progress value={addr.riskScore * 100} className="w-20" />
                        <Badge variant={getRiskColor(addr.riskScore > 0.7 ? "high" : addr.riskScore > 0.4 ? "medium" : "low")}>
                          {addr.riskScore > 0.7 ? "High Risk" : addr.riskScore > 0.4 ? "Medium Risk" : "Low Risk"}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Balance</p>
                        <p className="font-medium">{formatCurrency(addr.balance)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Transactions</p>
                        <p className="font-medium">{addr.transactionCount}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Tags</p>
                        <div className="flex gap-1 flex-wrap">
                          {addr.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flow" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Flow Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">Incoming Value</p>
                  <p className="text-lg font-bold text-green-600">
                    +{formatCurrency(report.flowAnalysis.incomingValue)} {report.cryptocurrency.includes('BTC') ? 'BTC' : 'ETH'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Outgoing Value</p>
                  <p className="text-lg font-bold text-red-600">
                    -{formatCurrency(report.flowAnalysis.outgoingValue)} {report.cryptocurrency.includes('BTC') ? 'BTC' : 'ETH'}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-slate-500">Net Flow</p>
                  <p className={`text-lg font-bold ${report.flowAnalysis.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {report.flowAnalysis.netFlow >= 0 ? '+' : ''}{formatCurrency(report.flowAnalysis.netFlow)} {report.cryptocurrency.includes('BTC') ? 'BTC' : 'ETH'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Activity Pattern</p>
                  <Badge variant="outline">{report.flowAnalysis.timePattern}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Major Recipients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.flowAnalysis.majorRecipients.map((recipient, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-mono text-sm">{formatAddress(recipient.address)}</p>
                        <Progress value={recipient.percentage} className="mt-1" />
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-bold">{formatCurrency(recipient.amount)}</p>
                        <p className="text-xs text-slate-500">{recipient.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {getRiskIcon(factor.severity)}
                      <Badge variant={getRiskColor(factor.severity)}>
                        {factor.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{factor.factor}</p>
                      <p className="text-sm text-slate-600">{factor.description}</p>
                    </div>
                  </div>
                ))}
                {report.riskFactors.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <Shield className="h-12 w-12 mx-auto mb-2" />
                    <p>No significant risk factors identified</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}