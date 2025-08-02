import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Users, Search, Mail, Phone, MapPin, AlertTriangle } from "lucide-react";
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

export default function VictimAssignment() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [assignmentReason, setAssignmentReason] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get officer's assigned victims
  const { data: assignedVictims, isLoading: victimsLoading } = useQuery({
    queryKey: ['/api/officer/assigned-victims'],
    retry: false,
  });

  // Search for victim by email
  const { data: searchedVictim, isLoading: searchLoading } = useQuery({
    queryKey: ['/api/victims/search', email],
    queryFn: () => fetch(`/api/victims/search?email=${email}`).then(res => res.ok ? res.json() : null),
    enabled: email.length >= 3,
    retry: false,
  });

  // Assign victim mutation
  const assignVictimMutation = useMutation({
    mutationFn: async (data: { victimId: number, assignmentReason: string }) => {
      return apiRequest('/api/officer/assign-victim', {
        method: 'POST',
        body: data
      });
    },
    onSuccess: () => {
      toast({
        title: "Victim Assigned Successfully",
        description: "The victim has been assigned to you and will receive direct case routing.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/officer/assigned-victims'] });
      setIsOpen(false);
      setEmail("");
      setAssignmentReason("");
    },
    onError: (error) => {
      toast({
        title: "Assignment Failed",
        description: error.message || "Unable to assign victim. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAssignVictim = () => {
    if (!searchedVictim || !assignmentReason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide an assignment reason.",
        variant: "destructive",
      });
      return;
    }
    
    assignVictimMutation.mutate({
      victimId: searchedVictim.id,
      assignmentReason: assignmentReason.trim()
    });
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Victim to Your Cases</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
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
                      Assign to My Cases
                    </>
                  )}
                </Button>
              )}

              {email.length >= 3 && !searchLoading && !searchedVictim && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No victim found with email "{email}". Please verify the email address or ensure the victim has an account.
                  </AlertDescription>
                </Alert>
              )}
            </div>
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
          ) : assignedVictims && assignedVictims.length > 0 ? (
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