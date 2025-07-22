import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Bitcoin, 
  AlertTriangle, 
  Shield, 
  DollarSign, 
  MapPin, 
  Building2,
  Clock,
  TrendingUp,
  Eye,
  Copy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const KNOWN_WALLETS: KnownWallet[] = [
  {
    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    name: "Genesis Block Address",
    cryptocurrency: "Bitcoin (BTC)",
    riskLevel: "low",
    estimatedValue: 68.71,
    lastActivity: "2024-07-15",
    knownFor: "Satoshi Nakamoto's first Bitcoin transaction",
    location: "Unknown/Historical",
    tags: ["genesis", "satoshi", "historical"],
    description: "The first Bitcoin address to receive coins from the genesis block. Contains unspendable coins sent as tribute."
  },
  {
    address: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
    name: "Bitfinex Hack Address",
    cryptocurrency: "Bitcoin (BTC)",
    riskLevel: "high",
    estimatedValue: 120000,
    lastActivity: "2024-03-22",
    knownFor: "2016 Bitfinex exchange hack - 119,756 BTC stolen",
    location: "Unknown/Dispersed",
    exchange: "Multiple exchanges (laundering)",
    tags: ["hack", "stolen", "exchange", "laundering"],
    description: "Address linked to the 2016 Bitfinex hack where 119,756 BTC were stolen. Funds have been partially moved and laundered."
  },
  {
    address: "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be",
    name: "Binance Hot Wallet",
    cryptocurrency: "Ethereum (ETH)",
    riskLevel: "low",
    estimatedValue: 250000,
    lastActivity: "2024-07-21",
    knownFor: "Binance exchange operational wallet",
    location: "Malta/Singapore",
    exchange: "Binance",
    tags: ["exchange", "hot-wallet", "legitimate"],
    description: "Main operational hot wallet for Binance exchange. Handles large volumes of legitimate customer transactions."
  },
  {
    address: "0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae",
    name: "Ethereum Foundation",
    cryptocurrency: "Ethereum (ETH)",
    riskLevel: "low",
    estimatedValue: 45000,
    lastActivity: "2024-06-10",
    knownFor: "Ethereum Foundation treasury",
    location: "Switzerland",
    tags: ["foundation", "legitimate", "treasury"],
    description: "Official Ethereum Foundation wallet used for development funding and ecosystem support."
  },
  {
    address: "15gHNr4TCKmhHDEG31L2XFNvpnEcnPSQvd",
    name: "Silk Road Seizure",
    cryptocurrency: "Bitcoin (BTC)",
    riskLevel: "high",
    estimatedValue: 69000,
    lastActivity: "2023-11-15",
    knownFor: "Silk Road marketplace seizure by FBI",
    location: "US Government Custody",
    tags: ["darkweb", "seized", "government", "drugs"],
    description: "Bitcoin wallet seized by FBI from Silk Road dark web marketplace. Currently held by US government."
  },
  {
    address: "1FeexV6bAHb8ybZjqQMjJrcCrHGW9sb6uF",
    name: "Bitcoin Pizza Address",
    cryptocurrency: "Bitcoin (BTC)",
    riskLevel: "low",
    estimatedValue: 0.001,
    lastActivity: "2010-05-22",
    knownFor: "First commercial Bitcoin transaction - 10,000 BTC for pizza",
    location: "Florida, USA",
    tags: ["historical", "pizza", "first-purchase"],
    description: "Address involved in the famous Bitcoin pizza transaction where 10,000 BTC was paid for two pizzas."
  }
];

interface DemoWalletSelectorProps {
  onWalletSelect: (wallet: KnownWallet) => void;
  onStartTrace: (address: string, caseNumber: string) => void;
}

export function DemoWalletSelector({ onWalletSelect, onStartTrace }: DemoWalletSelectorProps) {
  const [selectedWallet, setSelectedWallet] = useState<KnownWallet | null>(null);
  const [caseNumber, setCaseNumber] = useState("");
  const { toast } = useToast();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "high": return <AlertTriangle className="w-4 h-4" />;
      case "medium": return <TrendingUp className="w-4 h-4" />;
      case "low": return <Shield className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const handleWalletSelection = (walletAddress: string) => {
    const wallet = KNOWN_WALLETS.find(w => w.address === walletAddress);
    if (wallet) {
      setSelectedWallet(wallet);
      onWalletSelect(wallet);
      // Generate auto case number
      const autoCase = `CRY-DEMO-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;
      setCaseNumber(autoCase);
    }
  };

  const handleStartTrace = () => {
    if (selectedWallet && caseNumber) {
      onStartTrace(selectedWallet.address, caseNumber);
      toast({
        title: "Demo Trace Started",
        description: `Initiating trace for ${selectedWallet.name}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bitcoin className="w-5 h-5 text-orange-500" />
            <span>Demo Wallet Selection</span>
            <Badge variant="outline" className="ml-2">Live Demo</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Eye className="w-4 h-4" />
            <AlertDescription>
              Select from known cryptocurrency addresses to demonstrate the complete investigation workflow.
              These are real addresses with actual blockchain history.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Demo Wallet</label>
            <Select onValueChange={handleWalletSelection}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a known wallet to trace..." />
              </SelectTrigger>
              <SelectContent>
                {KNOWN_WALLETS.map((wallet) => (
                  <SelectItem key={wallet.address} value={wallet.address}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        wallet.riskLevel === 'high' ? 'bg-red-500' :
                        wallet.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="font-medium">{wallet.name}</span>
                      <span className="text-xs text-slate-500">({wallet.cryptocurrency})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedWallet && (
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedWallet.name}</h3>
                    <p className="text-sm text-slate-600">{selectedWallet.description}</p>
                  </div>
                  <Badge className={getRiskColor(selectedWallet.riskLevel)}>
                    {getRiskIcon(selectedWallet.riskLevel)}
                    <span className="ml-1">{selectedWallet.riskLevel.toUpperCase()} RISK</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Bitcoin className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium">Address</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                        {selectedWallet.address.substring(0, 20)}...
                      </code>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => copyAddress(selectedWallet.address)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Estimated Value</span>
                    </div>
                    <p className="text-sm font-mono">
                      ${selectedWallet.estimatedValue.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">Last Activity</span>
                    </div>
                    <p className="text-sm">{selectedWallet.lastActivity}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium">Location</span>
                    </div>
                    <p className="text-sm">{selectedWallet.location || "Unknown"}</p>
                  </div>
                </div>

                {selectedWallet.exchange && (
                  <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Exchange:</span>
                    <span className="text-sm">{selectedWallet.exchange}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <span className="text-sm font-medium">Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedWallet.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Case Number</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={caseNumber}
                      onChange={(e) => setCaseNumber(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border rounded-md"
                      placeholder="Auto-generated case number..."
                    />
                    <Button 
                      onClick={handleStartTrace}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={!selectedWallet || !caseNumber}
                    >
                      Start Demo Trace
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}