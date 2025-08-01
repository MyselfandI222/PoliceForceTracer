import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shield, DollarSign, ExternalLink, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PostTraceActionsProps {
  traceId: string;
  traceStatus: string;
  recoveryAmount?: string;
  riskLevel?: string;
}

export default function PostTraceActions({ 
  traceId, 
  traceStatus, 
  recoveryAmount = "Unknown", 
  riskLevel = "MEDIUM" 
}: PostTraceActionsProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [isSubmittingCase, setIsSubmittingCase] = useState(false);
  const { toast } = useToast();

  // Only show actions if trace is completed
  if (traceStatus !== 'completed') {
    return null;
  }

  const handlePunishScammers = async () => {
    setIsSubmittingCase(true);
    try {
      // Submit case to police officers
      const response = await fetch('/api/victim/submit-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          traceId,
          actionType: 'prosecute',
          reason: 'Victim wants to pursue criminal prosecution of scammers',
          recoveryAmount,
          riskLevel
        })
      });

      if (response.ok) {
        toast({
          title: "Case Submitted Successfully",
          description: "Your case has been forwarded to law enforcement officers for criminal investigation."
        });
        setSelectedAction('prosecute');
      } else {
        throw new Error('Failed to submit case');
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Unable to submit case to law enforcement. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingCase(false);
    }
  };

  const handleRetrieveMoney = () => {
    // Only set recovery action if not already in prosecution mode
    if (selectedAction !== 'prosecute') {
      setSelectedAction('recovery');
    }
    // Demo: In production, this would link to a legitimate recovery service
    // Using Chainalysis as an example of a real recovery service
    toast({
      title: "Demo Mode",
      description: "In production, this would redirect to a legitimate crypto recovery service like Chainalysis or CNC Intelligence.",
    });
    // For demo purposes, we'll show a placeholder
    window.open('https://www.chainalysis.com/', '_blank');
  };

  const handleCapitalLossClaim = () => {
    // If recovery fails, redirect to tax authority for capital loss claim
    window.open('https://www.canada.ca/en/revenue-agency.html', '_blank');
    toast({
      title: "Capital Loss Claim",
      description: "You've been directed to the Canada Revenue Agency to claim your capital loss."
    });
  };

  if (selectedAction === 'prosecute') {
    return (
      <div className="space-y-4">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              Case Submitted to Law Enforcement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 mb-4">
              Your case has been successfully submitted to police officers for criminal investigation. 
              You will receive updates on the investigation progress.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Case ID:</span>
                <span>{traceId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Status:</span>
                <Badge variant="default">Under Investigation</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recovery options still available */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <DollarSign className="w-5 h-5" />
              Recovery Options Still Available
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-blue-700">
              While your case is under investigation, you can still pursue fund recovery through our partner services.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={handleRetrieveMoney}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Contact Recovery Service (Demo)
              </Button>
              
              <Button 
                onClick={handleCapitalLossClaim}
                variant="outline" 
                className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <FileText className="w-4 h-4 mr-2" />
                Claim Capital Loss (CRA)
              </Button>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Recovery efforts can run parallel to the criminal investigation. Both approaches may help maximize your chances of getting funds back.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedAction === 'recovery') {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <DollarSign className="w-5 h-5" />
            Recovery Process Initiated
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-700">
            You've been directed to our partner recovery service. If they cannot track down your funds, 
            you can claim a capital loss with the Canada Revenue Agency.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={handleRetrieveMoney}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit RecoveryCrypto.org Again
            </Button>
            
            <Button 
              onClick={handleCapitalLossClaim}
              variant="outline" 
              className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <FileText className="w-4 h-4 mr-2" />
              Claim Capital Loss (CRA)
            </Button>
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              If the recovery service cannot locate your funds, the capital loss claim may help 
              you recover some value through tax deductions.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          Trace Complete - Choose Your Next Step
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Punish Scammers Option */}
          <Card className="border-red-200 hover:border-red-300 transition-colors cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                <Shield className="w-5 h-5" />
                Punish Scammers
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <p className="text-sm text-gray-600">
                Submit your case to law enforcement officers for criminal investigation and prosecution of the scammers.
              </p>
              
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span>Criminal investigation initiated</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span>Potential asset freezing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span>Legal prosecution of criminals</span>
                </div>
              </div>

              <Button 
                onClick={handlePunishScammers}
                disabled={isSubmittingCase}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {isSubmittingCase ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting Case...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Submit to Police
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Retrieve Money Option */}
          <Card className="border-green-200 hover:border-green-300 transition-colors cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                <DollarSign className="w-5 h-5" />
                Retrieve Money
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <p className="text-sm text-gray-600">
                Use professional recovery services to attempt to retrieve your stolen cryptocurrency funds.
              </p>
              
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Professional fund recovery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Capital loss claim backup</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Tax deduction possibilities</span>
                </div>
              </div>

              <Button 
                onClick={handleRetrieveMoney}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Start Recovery Process (Demo)
              </Button>
            </CardContent>
          </Card>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> You can choose both options, but submitting to police may affect 
            recovery timelines. Consider your priorities: justice vs. fund recovery speed.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}