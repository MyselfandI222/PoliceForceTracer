import { useState, startTransition } from "react";
import { Layout } from "@/components/layout";
import { VictimLayout } from "@/components/victim-layout";
import { DemoWalletSelector } from "@/components/demo-wallet-selector";
import { TraceExecutionViewer } from "@/components/trace-execution-viewer";
import { FreezeRequestManager } from "@/components/freeze-request-manager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Play, 
  Eye, 
  Shield, 
  Lock, 
  Activity,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface KnownWallet {
  address: string;
  name: string;
  cryptocurrency: string;
  riskLevel: "low" | "medium" | "high";
  estimatedValue: number;
  lastActivity: string;
  knownFor: string;
  location?: string;
  exchange?: string;
  tags: string[];
  description: string;
}

interface LocationInfo {
  country: string;
  city: string;
  exchange?: string;
  confidence: number;
  method: string;
  coordinates?: { lat: number; lng: number };
}

export default function DemoInvestigation() {
  const [currentPhase, setCurrentPhase] = useState<"selection" | "tracing" | "freeze">("selection");
  
  // Determine which layout to use based on user type
  const userType = localStorage.getItem('userType');
  const LayoutComponent = userType === 'victim' ? VictimLayout : Layout;
  const [selectedWallet, setSelectedWallet] = useState<KnownWallet | null>(null);
  const [caseNumber, setCaseNumber] = useState("");
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [freezeRequestData, setFreezeRequestData] = useState<any>(null);

  const handleWalletSelect = (wallet: KnownWallet) => {
    startTransition(() => {
      setSelectedWallet(wallet);
    });
  };

  const handleStartTrace = (address: string, caseNum: string) => {
    startTransition(() => {
      setCaseNumber(caseNum);
      setCurrentPhase("tracing");
    });
  };

  const handleLocationFound = (location: LocationInfo) => {
    startTransition(() => {
      setLocationInfo(location);
    });
  };

  const handleFreezeRequest = (requestData: any) => {
    startTransition(() => {
      setFreezeRequestData(requestData);
      setCurrentPhase("freeze");
    });
  };

  const handleRequestSent = () => {
    // Request successfully sent
  };

  const resetDemo = () => {
    startTransition(() => {
      setCurrentPhase("selection");
      setSelectedWallet(null);
      setCaseNumber("");
      setLocationInfo(null);
      setFreezeRequestData(null);
    });
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case "selection": return <Eye className="w-4 h-4" />;
      case "tracing": return <Activity className="w-4 h-4" />;
      case "freeze": return <Lock className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getPhaseStatus = (phase: string) => {
    if (phase === "selection" && currentPhase === "selection") return "current";
    if (phase === "tracing" && currentPhase === "tracing") return "current";
    if (phase === "freeze" && currentPhase === "freeze") return "current";
    if (
      (phase === "selection" && (currentPhase === "tracing" || currentPhase === "freeze")) ||
      (phase === "tracing" && currentPhase === "freeze")
    ) return "completed";
    return "pending";
  };

  return (
    <LayoutComponent>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Cryptocurrency Investigation Demo
            </h1>
            <p className="text-slate-600 mt-1">
              Complete workflow from wallet selection to asset freezing
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <Play className="w-3 h-3 mr-1" />
              Live Demo
            </Badge>
            <Button variant="outline" onClick={resetDemo}>
              Reset Demo
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card className="bg-slate-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    getPhaseStatus("selection") === "completed" ? "bg-green-600 text-white" :
                    getPhaseStatus("selection") === "current" ? "bg-blue-600 text-white" :
                    "bg-gray-300 text-gray-600"
                  }`}>
                    {getPhaseStatus("selection") === "completed" ? 
                      <CheckCircle className="w-4 h-4" /> : 
                      getPhaseIcon("selection")
                    }
                  </div>
                  <span className={`text-sm font-medium ${
                    getPhaseStatus("selection") === "current" ? "text-blue-600" : "text-slate-600"
                  }`}>
                    Wallet Selection
                  </span>
                </div>

                <div className={`h-px w-12 ${
                  getPhaseStatus("tracing") !== "pending" ? "bg-blue-600" : "bg-gray-300"
                }`} />

                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    getPhaseStatus("tracing") === "completed" ? "bg-green-600 text-white" :
                    getPhaseStatus("tracing") === "current" ? "bg-blue-600 text-white" :
                    "bg-gray-300 text-gray-600"
                  }`}>
                    {getPhaseStatus("tracing") === "completed" ? 
                      <CheckCircle className="w-4 h-4" /> : 
                      getPhaseIcon("tracing")
                    }
                  </div>
                  <span className={`text-sm font-medium ${
                    getPhaseStatus("tracing") === "current" ? "text-blue-600" : "text-slate-600"
                  }`}>
                    Live Tracing
                  </span>
                </div>

                <div className={`h-px w-12 ${
                  getPhaseStatus("freeze") !== "pending" ? "bg-blue-600" : "bg-gray-300"
                }`} />

                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    getPhaseStatus("freeze") === "completed" ? "bg-green-600 text-white" :
                    getPhaseStatus("freeze") === "current" ? "bg-red-600 text-white" :
                    "bg-gray-300 text-gray-600"
                  }`}>
                    {getPhaseIcon("freeze")}
                  </div>
                  <span className={`text-sm font-medium ${
                    getPhaseStatus("freeze") === "current" ? "text-red-600" : "text-slate-600"
                  }`}>
                    Asset Freeze
                  </span>
                </div>
              </div>

              {selectedWallet && (
                <div className="text-right">
                  <p className="text-sm font-medium">Current Target</p>
                  <p className="text-xs text-slate-600">{selectedWallet.name}</p>
                  {caseNumber && (
                    <Badge variant="outline" className="mt-1">{caseNumber}</Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={currentPhase} className="space-y-6">
          <TabsContent value="selection">
            <div className="space-y-6">
              <Alert>
                <Eye className="w-4 h-4" />
                <AlertDescription>
                  <strong>Phase 1: Wallet Selection</strong> - Choose from real cryptocurrency addresses 
                  with known blockchain history to begin the investigation process.
                </AlertDescription>
              </Alert>
              
              <DemoWalletSelector 
                onWalletSelect={handleWalletSelect}
                onStartTrace={handleStartTrace}
              />
            </div>
          </TabsContent>

          <TabsContent value="tracing">
            <div className="space-y-6">
              <Alert>
                <Activity className="w-4 h-4" />
                <AlertDescription>
                  <strong>Phase 2: Live Investigation</strong> - Watch real-time blockchain analysis, 
                  location discovery, and evidence compilation in action.
                </AlertDescription>
              </Alert>

              {selectedWallet && (
                <TraceExecutionViewer 
                  walletAddress={selectedWallet.address}
                  caseNumber={caseNumber}
                  onLocationFound={handleLocationFound}
                  onFreezeRequest={handleFreezeRequest}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="freeze">
            <div className="space-y-6">
              <Alert className="border-red-200 bg-red-50">
                <Lock className="w-4 h-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Phase 3: Asset Freeze</strong> - Generate legal documentation and 
                  coordinate with exchanges to freeze criminal assets.
                </AlertDescription>
              </Alert>

              {freezeRequestData && (
                <FreezeRequestManager 
                  requestData={freezeRequestData}
                  onRequestSent={handleRequestSent}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Demo Information Panel */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Demo Capabilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-blue-800">Real Blockchain Data</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Actual Bitcoin/Ethereum addresses</li>
                  <li>• Historical transaction data</li>
                  <li>• Known exchange connections</li>
                  <li>• Risk assessment algorithms</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-blue-800">Investigation Tools</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Address clustering analysis</li>
                  <li>• Geographic location tracing</li>
                  <li>• Exchange identification</li>
                  <li>• Risk scoring & compliance</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-blue-800">Legal Workflow</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Automated legal documentation</li>
                  <li>• Exchange cooperation protocols</li>
                  <li>• Asset freeze procedures</li>
                  <li>• Evidence preservation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutComponent>
  );
}