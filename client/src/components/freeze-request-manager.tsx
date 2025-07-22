import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Lock, 
  FileText, 
  Send, 
  Building2, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Download,
  Copy,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FreezeRequestData {
  caseNumber: string;
  walletAddress: string;
  exchange: string;
  location: any;
  evidence: string;
  requestType: string;
  urgency: string;
}

interface ExchangeContact {
  name: string;
  email: string;
  phone: string;
  legalEmail: string;
  complianceEmail: string;
  jurisdiction: string;
  website: string;
  responseTime: string;
}

interface FreezeRequestManagerProps {
  requestData: FreezeRequestData;
  onRequestSent: () => void;
}

const EXCHANGE_CONTACTS: Record<string, ExchangeContact> = {
  "Binance": {
    name: "Binance",
    email: "support@binance.com",
    phone: "+65 6950 6866",
    legalEmail: "legal@binance.com",
    complianceEmail: "compliance@binance.com",
    jurisdiction: "Singapore",
    website: "https://www.binance.com",
    responseTime: "24-48 hours"
  },
  "Coinbase": {
    name: "Coinbase",
    email: "support@coinbase.com", 
    phone: "+1 888 908 7930",
    legalEmail: "legal@coinbase.com",
    complianceEmail: "lawenforcement@coinbase.com",
    jurisdiction: "United States",
    website: "https://www.coinbase.com",
    responseTime: "48-72 hours"
  },
  "Kraken": {
    name: "Kraken",
    email: "support@kraken.com",
    phone: "+1 844 355 3769",
    legalEmail: "legal@kraken.com",
    complianceEmail: "compliance@kraken.com",
    jurisdiction: "United States",
    website: "https://www.kraken.com",
    responseTime: "24-48 hours"
  }
};

export function FreezeRequestManager({ requestData, onRequestSent }: FreezeRequestManagerProps) {
  const [activeTab, setActiveTab] = useState("request");
  const [requestStatus, setRequestStatus] = useState<"draft" | "sent" | "acknowledged" | "frozen">("draft");
  const [customMessage, setCustomMessage] = useState("");
  const [officerName, setOfficerName] = useState("Detective Sarah Johnson");
  const [department, setDepartment] = useState("Metro Cyber Crimes Unit");
  const [badgeNumber, setBadgeNumber] = useState("ADMIN-4987");
  const { toast } = useToast();

  const exchangeInfo = EXCHANGE_CONTACTS[requestData.exchange] || EXCHANGE_CONTACTS["Binance"];

  const generateLegalRequest = () => {
    return `URGENT: ASSET FREEZE REQUEST - CRYPTOCURRENCY INVESTIGATION

TO: ${exchangeInfo.name} Legal & Compliance Department
FROM: ${department}
CASE NUMBER: ${requestData.caseNumber}
OFFICER: ${officerName} (Badge: ${badgeNumber})
DATE: ${new Date().toLocaleDateString()}

SUBJECT: Emergency Asset Freeze Request - Suspected Criminal Activity

Dear ${exchangeInfo.name} Legal Team,

We are requesting an immediate freeze of cryptocurrency assets associated with the following wallet address:

TARGET WALLET: ${requestData.walletAddress}
JURISDICTION: ${exchangeInfo.jurisdiction}
URGENCY LEVEL: ${requestData.urgency}

INVESTIGATION DETAILS:
This wallet address has been identified through our cryptocurrency investigation as being connected to suspected criminal activity. Our blockchain analysis has revealed:

1. Transaction patterns consistent with money laundering
2. Connections to known illicit cryptocurrency services
3. Geographic location traced to ${requestData.location?.country}
4. Estimated value at risk: Significant

LEGAL BASIS:
This request is made under the authority of [relevant law enforcement statute] and in compliance with mutual legal assistance treaties. We have probable cause to believe these assets are connected to criminal activity and may be subject to forfeiture.

REQUESTED ACTIONS:
1. IMMEDIATE FREEZE of all assets in wallets associated with this address
2. PRESERVATION of all transaction records and account information
3. NOTIFICATION to us upon completion of freeze
4. PREPARATION for potential seizure proceedings

EVIDENCE PACKAGE:
- Comprehensive blockchain analysis report
- Transaction flow diagrams  
- Risk assessment documentation
- Supporting investigative materials

This is a time-sensitive matter. Please confirm receipt of this request and provide freeze confirmation within 24 hours.

Contact Information:
Officer: ${officerName}
Department: ${department}
Email: investigations@metrocyber.gov
Phone: +1 (555) 123-4567

Thank you for your cooperation in this matter.

Respectfully,
${officerName}
Detective, Cyber Crimes Unit
Badge #${badgeNumber}

---
This communication contains confidential law enforcement information.`;
  };

  const handleSendRequest = async () => {
    setRequestStatus("sent");
    onRequestSent();
    
    toast({
      title: "Freeze Request Submitted",
      description: `Request sent to ${exchangeInfo.name} legal team`,
    });

    // Simulate exchange response
    setTimeout(() => {
      setRequestStatus("acknowledged");
      toast({
        title: "Request Acknowledged",
        description: `${exchangeInfo.name} has acknowledged the freeze request`,
      });
    }, 3000);

    setTimeout(() => {
      setRequestStatus("frozen");
      toast({
        title: "Assets Frozen",
        description: `${exchangeInfo.name} has frozen the target wallet assets`,
      });
    }, 8000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Content copied successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "frozen": return "bg-green-600 text-white";
      case "acknowledged": return "bg-blue-600 text-white";
      case "sent": return "bg-yellow-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "frozen": return <Lock className="w-4 h-4" />;
      case "acknowledged": return <CheckCircle className="w-4 h-4" />;
      case "sent": return <Send className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-red-600" />
              <span>Asset Freeze Request</span>
            </div>
            <Badge className={getStatusColor(requestStatus)}>
              {getStatusIcon(requestStatus)}
              <span className="ml-1">{requestStatus.toUpperCase()}</span>
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="request">Legal Request</TabsTrigger>
              <TabsTrigger value="exchange">Exchange Info</TabsTrigger>
              <TabsTrigger value="tracking">Status Tracking</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="request" className="space-y-4">
              <Alert>
                <FileText className="w-4 h-4" />
                <AlertDescription>
                  Legal freeze request ready for submission to {exchangeInfo.name}. 
                  Review and customize before sending.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Officer Name</label>
                  <Input 
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Department</label>
                  <Input 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Badge Number</label>
                  <Input 
                    value={badgeNumber}
                    onChange={(e) => setBadgeNumber(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Legal Request Letter</label>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(generateLegalRequest())}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <Textarea 
                  value={generateLegalRequest()}
                  rows={20}
                  className="font-mono text-xs"
                  readOnly
                />
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={handleSendRequest}
                  disabled={requestStatus !== "draft"}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Freeze Request
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="exchange" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5" />
                    <span>{exchangeInfo.name} Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Legal Email</span>
                      </div>
                      <p className="text-sm font-mono">{exchangeInfo.legalEmail}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Compliance Email</span>
                      </div>
                      <p className="text-sm font-mono">{exchangeInfo.complianceEmail}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">Phone</span>
                      </div>
                      <p className="text-sm font-mono">{exchangeInfo.phone}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium">Jurisdiction</span>
                      </div>
                      <p className="text-sm">{exchangeInfo.jurisdiction}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Expected Response Time</span>
                    <Badge variant="outline">{exchangeInfo.responseTime}</Badge>
                  </div>

                  <Alert>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      All freeze requests must be submitted to both legal and compliance departments 
                      simultaneously for fastest processing.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tracking" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        requestStatus === "draft" ? "bg-gray-400" : "bg-green-500"
                      }`} />
                      <div>
                        <p className="font-medium">Request Prepared</p>
                        <p className="text-xs text-slate-600">Legal documentation generated</p>
                      </div>
                    </div>
                    {requestStatus !== "draft" && <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        requestStatus === "draft" ? "bg-gray-400" : "bg-green-500"
                      }`} />
                      <div>
                        <p className="font-medium">Request Submitted</p>
                        <p className="text-xs text-slate-600">Sent to {exchangeInfo.name} legal team</p>
                      </div>
                    </div>
                    {(requestStatus === "sent" || requestStatus === "acknowledged" || requestStatus === "frozen") && 
                      <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        (requestStatus === "acknowledged" || requestStatus === "frozen") ? "bg-green-500" : "bg-gray-400"
                      }`} />
                      <div>
                        <p className="font-medium">Request Acknowledged</p>
                        <p className="text-xs text-slate-600">Exchange confirms receipt and processing</p>
                      </div>
                    </div>
                    {(requestStatus === "acknowledged" || requestStatus === "frozen") && 
                      <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        requestStatus === "frozen" ? "bg-green-500" : "bg-gray-400"
                      }`} />
                      <div>
                        <p className="font-medium">Assets Frozen</p>
                        <p className="text-xs text-slate-600">Wallet funds successfully frozen</p>
                      </div>
                    </div>
                    {requestStatus === "frozen" && <Lock className="w-5 h-5 text-red-600" />}
                  </div>
                </div>

                {requestStatus === "frozen" && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <strong>Success!</strong> The target wallet assets have been frozen by {exchangeInfo.name}. 
                      Proceed with seizure proceedings as needed.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <div className="space-y-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Asset Freeze Request Letter</p>
                          <p className="text-xs text-slate-600">Legal documentation for exchange</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium">Blockchain Investigation Report</p>
                          <p className="text-xs text-slate-600">Complete trace analysis and evidence</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium">Seizure Affidavit Template</p>
                          <p className="text-xs text-slate-600">Court documents for asset seizure</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}