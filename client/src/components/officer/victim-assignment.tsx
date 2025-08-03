import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Users, Search, Mail, Phone, MapPin, AlertTriangle, FileText, Upload, Plus, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Victim {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  incidentType: string;
}

interface CaseInfo {
  caseNumber: string;
  cryptoType: string;
  walletAddress: string;
  amount: string;
  description: string;
  incidentDate: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface EvidenceFile {
  name: string;
  size: number;
  type: string;
  url?: string;
}

export default function VictimAssignment() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [assignmentReason, setAssignmentReason] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [caseInfo, setCaseInfo] = useState<CaseInfo>({
    caseNumber: '',
    cryptoType: 'Bitcoin',
    walletAddress: '',
    amount: '',
    description: '',
    incidentDate: '',
    riskLevel: 'medium'
  });
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get officer's assigned victims
  const { data: assignedVictims, isLoading: victimsLoading } = useQuery({
    queryKey: ['/api/officer/assigned-victims'],
    retry: false,
  });

  // Search for victim by email
  const { data: searchedVictim, isLoading: searchLoading } = useQuery({
    queryKey: ['/api/victims/search', { email }],
    queryFn: async () => {
      if (!email || email.length < 3) return null;
      try {
        const res = await apiRequest('GET', `/api/victims/search?email=${encodeURIComponent(email)}`);
        return await res.json();
      } catch (error: any) {
        if (error.message?.includes('404')) {
          return null;
        }
        throw error;
      }
    },
    enabled: email.length >= 3,
    retry: false,
  });

  // Assign victim with case info mutation
  const assignVictimMutation = useMutation({
    mutationFn: async (data: { 
      victimId: number, 
      assignmentReason: string, 
      caseInfo?: CaseInfo,
      evidenceFiles?: EvidenceFile[]
    }) => {
      return apiRequest('POST', '/api/officer/assign-victim-with-case', data);
    },
    onSuccess: () => {
      toast({
        title: "Victim Assigned Successfully",
        description: "The victim has been assigned to you with case information and evidence files.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/officer/assigned-victims'] });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Assignment Failed",
        description: error.message || "Unable to assign victim. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setIsOpen(false);
    setEmail("");
    setAssignmentReason("");
    setActiveTab("search");
    setCaseInfo({
      caseNumber: '',
      cryptoType: 'Bitcoin',
      walletAddress: '',
      amount: '',
      description: '',
      incidentDate: '',
      riskLevel: 'medium'
    });
    setEvidenceFiles([]);
  };

  const handleAssignVictim = () => {
    if (!searchedVictim || !assignmentReason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide an assignment reason.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if case info is provided
    const hasCaseInfo = caseInfo.caseNumber || caseInfo.walletAddress || caseInfo.description;
    
    assignVictimMutation.mutate({
      victimId: searchedVictim.id,
      assignmentReason: assignmentReason.trim(),
      caseInfo: hasCaseInfo ? caseInfo : undefined,
      evidenceFiles: evidenceFiles.length > 0 ? evidenceFiles : undefined
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: EvidenceFile[] = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));
      setEvidenceFiles([...evidenceFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setEvidenceFiles(evidenceFiles.filter((_, i) => i !== index));
  };

  const generateCaseNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setCaseInfo({ ...caseInfo, caseNumber: `CASE-${year}${month}${day}-${random}` });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Victim Assignment</h2>
          <p className="text-gray-600">Assign victims to receive their case submissions directly</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Assign New Victim
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Assign Victim to Your Cases</DialogTitle>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="search">Find Victim</TabsTrigger>
                <TabsTrigger value="case" disabled={!searchedVictim}>Case Info</TabsTrigger>
                <TabsTrigger value="evidence" disabled={!searchedVictim}>Evidence</TabsTrigger>
              </TabsList>
              
              <TabsContent value="search" className="space-y-4">
              <div>
                <Label htmlFor="email">Victim Email Address</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter victim email address"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter at least 3 characters to search for a victim
                </p>
              </div>

              {searchLoading && (
                <div className="text-center py-4">
                  <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Searching for victim...</p>
                </div>
              )}

              {searchedVictim && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-blue-900">{searchedVictim.name}</h4>
                        <p className="text-blue-700 text-sm">{searchedVictim.incidentType}</p>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-blue-600">
                          <Mail className="w-4 h-4" />
                          <span>{searchedVictim.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600">
                          <Phone className="w-4 h-4" />
                          <span>{searchedVictim.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600">
                          <MapPin className="w-4 h-4" />
                          <span>{searchedVictim.address}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

                {searchedVictim && (
                  <div>
                    <Label htmlFor="assignmentReason">Assignment Reason</Label>
                    <Textarea
                      id="assignmentReason"
                      value={assignmentReason}
                      onChange={(e) => setAssignmentReason(e.target.value)}
                      placeholder="Explain why you're taking this case (e.g., similar case history, jurisdiction, etc.)"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                )}

                {searchedVictim && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleAssignVictim}
                      disabled={assignVictimMutation.isPending || !assignmentReason.trim()}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {assignVictimMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Assigning...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Quick Assign
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => setActiveTab("case")}
                      variant="outline"
                      className="flex-1"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Add Case Info
                    </Button>
                  </div>
                )}

                {email.length >= 3 && !searchLoading && !searchedVictim && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      No victim found with email "{email}". Please verify the email address or ensure the victim has an account.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="case" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Case Information</h4>
                  <Button
                    onClick={generateCaseNumber}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Generate Case #
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="caseNumber">Case Number</Label>
                    <Input
                      id="caseNumber"
                      value={caseInfo.caseNumber}
                      onChange={(e) => setCaseInfo({ ...caseInfo, caseNumber: e.target.value })}
                      placeholder="CASE-2024-001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cryptoType">Cryptocurrency Type</Label>
                    <select
                      id="cryptoType"
                      value={caseInfo.cryptoType}
                      onChange={(e) => setCaseInfo({ ...caseInfo, cryptoType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Bitcoin">Bitcoin (BTC)</option>
                      <option value="Ethereum">Ethereum (ETH)</option>
                      <option value="Litecoin">Litecoin (LTC)</option>
                      <option value="Monero">Monero (XMR)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="walletAddress">Wallet Address</Label>
                  <Input
                    id="walletAddress"
                    value={caseInfo.walletAddress}
                    onChange={(e) => setCaseInfo({ ...caseInfo, walletAddress: e.target.value })}
                    placeholder="Enter cryptocurrency wallet address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount Lost (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="amount"
                        value={caseInfo.amount}
                        onChange={(e) => setCaseInfo({ ...caseInfo, amount: e.target.value })}
                        placeholder="0.00"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="incidentDate">Incident Date</Label>
                    <Input
                      id="incidentDate"
                      type="date"
                      value={caseInfo.incidentDate}
                      onChange={(e) => setCaseInfo({ ...caseInfo, incidentDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="riskLevel">Risk Level</Label>
                  <select
                    id="riskLevel"
                    value={caseInfo.riskLevel}
                    onChange={(e) => setCaseInfo({ ...caseInfo, riskLevel: e.target.value as CaseInfo['riskLevel'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                    <option value="critical">Critical Risk</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="description">Case Description</Label>
                  <Textarea
                    id="description"
                    value={caseInfo.description}
                    onChange={(e) => setCaseInfo({ ...caseInfo, description: e.target.value })}
                    placeholder="Describe the incident, how the fraud occurred, any communication with scammers..."
                    rows={4}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => setActiveTab("evidence")}
                    variant="outline"
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Add Evidence
                  </Button>
                  <Button
                    onClick={handleAssignVictim}
                    disabled={assignVictimMutation.isPending || !assignmentReason.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {assignVictimMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Assign with Case
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="evidence" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Evidence Files</h4>
                  <Badge variant="secondary">{evidenceFiles.length} files</Badge>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload screenshots, transaction records, communication logs
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer">
                      <Plus className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
                  </Label>
                  <p className="text-xs text-gray-500 mt-2">
                    Supports: PDF, JPG, PNG, TXT, DOC, DOCX
                  </p>
                </div>

                {evidenceFiles.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium">Uploaded Files:</h5>
                    {evidenceFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => removeFile(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={handleAssignVictim}
                  disabled={assignVictimMutation.isPending || !assignmentReason.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {assignVictimMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Assign with Case & Evidence
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assigned Victims List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            My Assigned Victims
          </CardTitle>
        </CardHeader>
        <CardContent>
          {victimsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : assignedVictims && Array.isArray(assignedVictims) && assignedVictims.length > 0 ? (
            <div className="space-y-4">
              {assignedVictims.map((victim: any) => (
                <div key={victim.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{victim.name}</h4>
                      <p className="text-sm text-gray-600">{victim.incidentType}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {victim.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {victim.phone}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Assigned: {new Date(victim.assignedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No Assigned Victims</h3>
              <p className="text-gray-600 mb-4">
                You haven't assigned any victims to your cases yet.
              </p>
              <Button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Assign Your First Victim
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information */}
      <Alert>
        <UserPlus className="h-4 w-4" />
        <AlertDescription>
          <strong>How it works:</strong> When you assign a victim to your cases, all their future "Punish Scammers" submissions will be routed directly to you instead of the general queue. This ensures continuity and better case management.
        </AlertDescription>
      </Alert>
    </div>
  );
}