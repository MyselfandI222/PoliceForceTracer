import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Brain, AlertTriangle, CheckCircle } from "lucide-react";
import CaseAnalysisCard from "@/components/ai/CaseAnalysisCard";
import { useAIStatus } from "@/hooks/useAI";

export default function AIAssistant() {
  const { data: aiStatus, isLoading } = useAIStatus();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Investigation Assistant</h1>
          <p className="text-gray-600 mt-2">
            Use artificial intelligence to analyze cryptocurrency cases and get investigation insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Badge variant="outline">Checking...</Badge>
          ) : aiStatus?.status === "ready" ? (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              AI Ready
            </Badge>
          ) : (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Setup Required
            </Badge>
          )}
        </div>
      </div>

      {aiStatus?.status !== "ready" && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            OpenAI API key is required to use AI features. The AI assistant will provide case analysis, 
            transaction pattern detection, and investigation recommendations once configured.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CaseAnalysisCard />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm">Case Analysis</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Analyze case details, identify suspicious patterns, and assess risk levels
                  </p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm">Transaction Pattern Detection</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Identify money laundering patterns and suspicious transaction flows
                  </p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm">Investigation Recommendations</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get AI-powered suggestions for next investigation steps
                  </p>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <h4 className="font-semibold text-sm">Report Generation</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Generate professional investigation summaries and documentation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                  <span className="text-muted-foreground">Enter case details including what happened, amounts, and timeline</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                  <span className="text-muted-foreground">Add transaction data and cryptocurrency addresses if available</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                  <span className="text-muted-foreground">Click "Analyze with AI" to get comprehensive insights</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                  <span className="text-muted-foreground">Review risk assessment, patterns, and recommendations</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}