import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Shield, CheckCircle, User, Phone, Mail, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Officer {
  id: number;
  name: string;
  badgeNumber: string;
  department: string;
  email: string;
  phone: string;
  specialization: string;
  rank: string;
}

interface Assignment {
  id: number;
  officer: Officer;
  assignedAt: string;
  assignedBy: string;
  isActive: boolean;
}

export default function OfficerAssignment() {
  const [isOpen, setIsOpen] = useState(false);
  const [badgeNumber, setBadgeNumber] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current assignment
  const { data: assignment, isLoading: assignmentLoading } = useQuery({
    queryKey: ['/api/victim/officer-assignment'],
    retry: false,
  });

  // Search for officer by badge number
  const { data: searchedOfficer, isLoading: searchLoading } = useQuery({
    queryKey: ['/api/officers/search', badgeNumber],
    queryFn: () => fetch(`/api/officers/search?badgeNumber=${badgeNumber}`).then(res => res.ok ? res.json() : null),
    enabled: badgeNumber.length >= 3,
    retry: false,
  });

  // Assign officer mutation
  const assignOfficerMutation = useMutation({
    mutationFn: async (officerId: number) => {
      return apiRequest('/api/victim/assign-officer', {
        method: 'POST',
        body: { officerId, assignedBy: 'victim_request' }
      });
    },
    onSuccess: () => {
      toast({
        title: "Officer Assigned Successfully",
        description: "Your case submissions will now go directly to this officer.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/victim/officer-assignment'] });
      setIsOpen(false);
      setBadgeNumber("");
    },
    onError: (error) => {
      toast({
        title: "Assignment Failed",
        description: error.message || "Unable to assign officer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAssignOfficer = (officerId: number) => {
    assignOfficerMutation.mutate(officerId);
  };

  if (assignmentLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (assignment && assignment.isActive) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            Assigned Police Officer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">{assignment.officer.rank} {assignment.officer.name}</h3>
              <p className="text-green-700 text-sm">Badge #{assignment.officer.badgeNumber}</p>
              <p className="text-green-600 text-sm">{assignment.officer.department}</p>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Active Assignment
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-green-200">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Mail className="w-4 h-4" />
              <span>{assignment.officer.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Phone className="w-4 h-4" />
              <span>{assignment.officer.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Building className="w-4 h-4" />
              <span>{assignment.officer.specialization}</span>
            </div>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              All your case submissions will be sent directly to {assignment.officer.rank} {assignment.officer.name}. 
              Assigned on {new Date(assignment.assignedAt).toLocaleDateString()}.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <UserPlus className="w-5 h-5" />
          Assign Your Police Officer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-orange-700">
          To submit cases directly to a specific police officer, you need to add them first. 
          Once assigned, all your "Punish Scammers" submissions will go straight to this officer.
        </p>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-orange-600 hover:bg-orange-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Find & Assign Police Officer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Find Police Officer</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="badgeNumber">Officer Badge Number</Label>
                <Input
                  id="badgeNumber"
                  value={badgeNumber}
                  onChange={(e) => setBadgeNumber(e.target.value)}
                  placeholder="Enter badge number (e.g., 12345)"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter at least 3 characters to search for an officer
                </p>
              </div>

              {searchLoading && (
                <div className="text-center py-4">
                  <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Searching for officer...</p>
                </div>
              )}

              {searchedOfficer && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900">
                          {searchedOfficer.rank} {searchedOfficer.name}
                        </h4>
                        <p className="text-blue-700 text-sm">Badge #{searchedOfficer.badgeNumber}</p>
                        <p className="text-blue-600 text-sm">{searchedOfficer.department}</p>
                        <p className="text-blue-600 text-xs">{searchedOfficer.specialization}</p>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleAssignOfficer(searchedOfficer.id)}
                      disabled={assignOfficerMutation.isPending}
                      className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                    >
                      {assignOfficerMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Assigning...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Assign This Officer
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {badgeNumber.length >= 3 && !searchLoading && !searchedOfficer && (
                <Alert>
                  <AlertDescription>
                    No officer found with badge number "{badgeNumber}". Please verify the badge number with your local police department.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Alert>
          <UserPlus className="h-4 w-4" />
          <AlertDescription>
            <strong>How it works:</strong> Enter the badge number of the police officer handling your case. 
            Once assigned, all future case submissions will be sent directly to them for faster processing.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}