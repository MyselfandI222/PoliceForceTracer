import { useState, useEffect, startTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  MapPin, 
  Building2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Shield,
  Download,
  Send,
  Lock,
  Eye,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TraceStep {
  id: string;
  name: string;
  description: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  details?: string[];
  findings?: any;
}

interface LocationInfo {
  country: string;
  city: string;
  exchange?: string;
  confidence: number;
  method: string;
  coordinates?: { lat: number; lng: number };
}

interface TraceExecutionViewerProps {
  walletAddress: string;
  caseNumber: string;
  onLocationFound: (location: LocationInfo) => void;
  onFreezeRequest: (requestData: any) => void;
}

export function TraceExecutionViewer({ 
  walletAddress, 
  caseNumber, 
  onLocationFound,
  onFreezeRequest 
}: TraceExecutionViewerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [traceSteps, setTraceSteps] = useState<TraceStep[]>([
    {
      id: "blockchain-scan",
      name: "Blockchain Analysis",
      description: "Analyzing transaction history and patterns",
      status: "pending",
      progress: 0
    },
    {
      id: "cluster-analysis",
      name: "Address Clustering",
      description: "Identifying connected addresses and wallets",
      status: "pending",
      progress: 0
    },
    {
      id: "exchange-detection",
      name: "Exchange Detection",
      description: "Identifying cryptocurrency exchanges",
      status: "pending",
      progress: 0
    },
    {
      id: "location-discovery",
      name: "Location Discovery",
      description: "Tracing geographical location and IP analysis",
      status: "pending",
      progress: 0
    },
    {
      id: "risk-assessment",
      name: "Risk Assessment",
      description: "Analyzing threat level and compliance status",
      status: "pending",
      progress: 0
    },
    {
      id: "report-generation",
      name: "Report Generation",
      description: "Compiling investigation results",
      status: "pending",
      progress: 0
    }
  ]);

  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [freezeRequestSent, setFreezeRequestSent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate progressive trace execution
    const executeTrace = async () => {
      for (let i = 0; i < traceSteps.length; i++) {
        // Update current step to processing
        setCurrentStep(i);
        setTraceSteps(prev => prev.map((step, index) => 
          index === i 
            ? { ...step, status: "processing", progress: 0 }
            : step
        ));

        // Simulate processing with progress updates
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 300));
          setTraceSteps(prev => prev.map((step, index) => 
            index === i 
              ? { ...step, progress }
              : step
          ));
        }

        // Complete step with findings
        const stepFindings = generateStepFindings(traceSteps[i].id);
        setTraceSteps(prev => prev.map((step, index) => 
          index === i 
            ? { 
                ...step, 
                status: "completed", 
                progress: 100,
                findings: stepFindings,
                details: generateStepDetails(step.id)
              }
            : step
        ));

        // Special handling for location discovery
        if (traceSteps[i].id === "location-discovery") {
          const location: LocationInfo = {
            country: "Singapore",
            city: "Singapore",
            exchange: "Binance",
            confidence: 87,
            method: "IP correlation + exchange KYC data",
            coordinates: { lat: 1.3521, lng: 103.8198 }
          };
          setLocationInfo(location);
          onLocationFound(location);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
      }
    };

    executeTrace();
  }, [walletAddress]);

  const generateStepFindings = (stepId: string) => {
    switch (stepId) {
      case "blockchain-scan":
        return {
          transactions: 1247,
          totalValue: "125,430.50 USD",
          timespan: "2019-03-15 to 2024-07-21",
          patterns: ["Large inflows from mixing services", "Regular outflows to exchanges"]
        };
      case "cluster-analysis":
        return {
          connectedAddresses: 23,
          clusters: 3,
          mainCluster: "Exchange hot wallet cluster",
          riskAddresses: 5
        };
      case "exchange-detection":
        return {
          exchanges: ["Binance", "Coinbase", "Kraken"],
          primaryExchange: "Binance",
          kycStatus: "Verified account detected"
        };
      case "location-discovery":
        return {
          country: "Singapore",
          confidence: 87,
          sources: ["IP geolocation", "Exchange compliance data", "Transaction timing"]
        };
      case "risk-assessment":
        return {
          riskScore: 75,
          level: "Medium-High",
          factors: ["Connected to known mixer", "Large value transactions", "Exchange verified"]
        };
      case "report-generation":
        return {
          sections: 6,
          pages: 12,
          evidence: "Blockchain data, IP logs, Exchange records"
        };
      default:
        return {};
    }
  };

  const generateStepDetails = (stepId: string) => {
    switch (stepId) {
      case "blockchain-scan":
        return [
          "Scanned 1,247 transactions across 847 blocks",
          "Identified transaction patterns indicating automated trading",
          "Found connections to known exchange hot wallets",
          "Detected potential privacy coin conversions"
        ];
      case "cluster-analysis":
        return [
          "Grouped 23 related addresses into 3 distinct clusters",
          "Primary cluster shows exchange operational patterns",
          "Secondary cluster linked to privacy-focused services",
          "5 addresses flagged for high-risk associations"
        ];
      case "exchange-detection":
        return [
          "Confirmed transactions with Binance Singapore",
          "Detected Coinbase Pro API activity patterns",
          "Found KYC-verified account status",
          "Identified compliance reporting jurisdiction"
        ];
      case "location-discovery":
        return [
          "IP geolocation: Singapore (87% confidence)",
          "Exchange compliance data confirms Singapore entity",
          "Transaction timing analysis supports Asia/Singapore timezone",
          "Cross-referenced with known exchange server locations"
        ];
      case "risk-assessment":
        return [
          "Medium-High risk due to mixing service connections",
          "Positive factors: Exchange KYC verification",
          "Compliance status: Regulated jurisdiction",
          "Freeze potential: High (exchange cooperation likely)"
        ];
      case "report-generation":
        return [
          "Generated comprehensive 12-page investigation report",
          "Compiled blockchain evidence with transaction graphs",
          "Included legal precedents for asset freezing",
          "Prepared exchange cooperation request template"
        ];
      default:
        return [];
    }
  };

  const handleFreezeRequest = () => {
    const requestData = {
      caseNumber,
      walletAddress,
      exchange: locationInfo?.exchange || "Binance",
      location: locationInfo,
      evidence: "Comprehensive blockchain analysis report",
      requestType: "Asset Freeze Order",
      urgency: "High Priority"
    };
    
    setFreezeRequestSent(true);
    onFreezeRequest(requestData);
    
    toast({
      title: "Freeze Request Submitted",
      description: `Asset freeze request sent to ${locationInfo?.exchange || 'exchange'}`,
    });
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "processing": return <TrendingUp className="w-5 h-5 text-blue-600 animate-pulse" />;
      case "failed": return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-blue-600" />
            <span>Live Trace Execution</span>
            <Badge variant="outline" className="ml-2">Case: {caseNumber}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Eye className="w-4 h-4" />
              <AlertDescription>
                Real-time cryptocurrency investigation in progress. Watch as our system analyzes blockchain data, 
                identifies locations, and prepares legal documentation.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {traceSteps.map((step, index) => (
                <div key={step.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStepIcon(step.status)}
                      <div>
                        <h4 className="font-medium">{step.name}</h4>
                        <p className="text-sm text-slate-600">{step.description}</p>
                      </div>
                    </div>
                    <Badge variant={
                      step.status === "completed" ? "default" :
                      step.status === "processing" ? "secondary" : "outline"
                    }>
                      {step.status.toUpperCase()}
                    </Badge>
                  </div>

                  {step.status === "processing" && (
                    <Progress value={step.progress} className="w-full" />
                  )}

                  {step.status === "completed" && step.details && (
                    <div className="ml-8 p-3 bg-green-50 rounded-md">
                      <ul className="text-xs space-y-1">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {locationInfo && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <span>Location Discovered</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Location</label>
                <p className="font-semibold">{locationInfo.city}, {locationInfo.country}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Confidence</label>
                <div className="flex items-center space-x-2">
                  <Progress value={locationInfo.confidence} className="flex-1" />
                  <span className="font-semibold">{locationInfo.confidence}%</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Exchange</label>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">{locationInfo.exchange}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Detection Method</label>
                <p className="text-sm">{locationInfo.method}</p>
              </div>
            </div>

            <Separator />

            <div className="flex space-x-3">
              <Button 
                onClick={handleFreezeRequest}
                disabled={freezeRequestSent}
                className="bg-red-600 hover:bg-red-700"
              >
                {freezeRequestSent ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Request Sent
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Request Asset Freeze
                  </>
                )}
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Generate Legal Documents
              </Button>
              <Button variant="outline">
                <Send className="w-4 h-4 mr-2" />
                Contact Exchange
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}