import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Loader2, AlertTriangle, CheckCircle, Shield } from "lucide-react";
import { useAnalyzeCryptoCase, type CaseAnalysis } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";

export default function CaseAnalysisCard() {
  const [caseDetails, setCaseDetails] = useState("");
  const [transactionData, setTransactionData] = useState("");
  const [addresses, setAddresses] = useState("");
  const [analysis, setAnalysis] = useState<CaseAnalysis | null>(null);
  
  const { toast } = useToast();
  const analyzeMutation = useAnalyzeCryptoCase();

  const handleAnalyze = async () => {
    if (!caseDetails.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide case details to analyze",
        variant: "destructive"
      });
      return;
    }

    const addressList = addresses
      .split("\n")
      .map(addr => addr.trim())
      .filter(addr => addr.length > 0);

    try {
      const result = await analyzeMutation.mutateAsync({
        caseDetails,
        transactionData,
        addresses: addressList
      });
      setAnalysis(result);
      toast({
        title: "Analysis Complete",
        description: "AI analysis has been generated successfully"
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the case. Please check your OpenAI API key.",
        variant: "destructive"
      });
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "LOW": return "bg-green-100 text-green-800 border-green-200";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "HIGH": return "bg-orange-100 text-orange-800 border-orange-200";
      case "CRITICAL": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "LOW": return <CheckCircle className="w-4 h-4" />;
      case "MEDIUM": return <AlertTriangle className="w-4 h-4" />;
      case "HIGH": return <AlertTriangle className="w-4 h-4" />;
      case "CRITICAL": return <Shield className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Case Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="case-details">Case Details *</Label>
            <Textarea
              id="case-details"
              placeholder="Describe the cryptocurrency case details, including what happened, amounts involved, timeline, etc."
              value={caseDetails}
              onChange={(e) => setCaseDetails(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transaction-data">Transaction Data (Optional)</Label>
            <Textarea
              id="transaction-data"
              placeholder="Paste transaction details, blockchain data, or other relevant technical information"
              value={transactionData}
              onChange={(e) => setTransactionData(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addresses">Cryptocurrency Addresses (Optional)</Label>
            <Textarea
              id="addresses"
              placeholder="Enter addresses one per line:&#10;1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa&#10;0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae"
              value={addresses}
              onChange={(e) => setAddresses(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={handleAnalyze} 
            disabled={analyzeMutation.isPending || !caseDetails.trim()}
            className="w-full"
          >
            {analyzeMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Case...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Analyze with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              AI Analysis Results
              <Badge className={`${getRiskLevelColor(analysis.riskLevel)} flex items-center gap-1`}>
                {getRiskIcon(analysis.riskLevel)}
                {analysis.riskLevel} RISK
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Summary</h4>
              <p className="text-sm text-muted-foreground">{analysis.summary}</p>
            </div>

            {analysis.suspiciousPatterns.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Suspicious Patterns</h4>
                <ul className="space-y-1">
                  {analysis.suspiciousPatterns.map((pattern, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {pattern}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.recommendations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Confidence Score: {Math.round(analysis.confidence * 100)}%
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {analyzeMutation.isError && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to analyze case. Please ensure your OpenAI API key is configured correctly.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}