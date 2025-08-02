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
  const { toast } = useToast();

  // Get current assignment (check if victim has been assigned to an officer)
  const { data: assignment, isLoading: assignmentLoading } = useQuery({
    queryKey: ['/api/victim/officer-assignment'],
    retry: false,
  });

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
            Your Assigned Police Officer
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
              You have been assigned to {assignment.officer.rank} {assignment.officer.name}. All your case submissions will be sent directly to them. 
              Assignment made on {new Date(assignment.assignedAt).toLocaleDateString()}.
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
          <User className="w-5 h-5" />
          No Assigned Officer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <User className="h-4 w-4" />
          <AlertDescription>
            <strong>Waiting for Officer Assignment:</strong> You haven't been assigned to a police officer yet. 
            An officer will assign you to their cases when they begin investigating your submitted traces.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-3">
          <h4 className="font-semibold text-orange-800">What happens next:</h4>
          <div className="space-y-2 text-sm text-orange-700">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">1</div>
              <p>Continue submitting cryptocurrency traces through the platform</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">2</div>
              <p>A police officer will review your case and assign you to their investigation queue</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">3</div>
              <p>Once assigned, all your future submissions will go directly to that officer</p>
            </div>
          </div>
        </div>
        
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Good news:</strong> You can still submit "Punish Scammers" requests even without an assigned officer. 
            They will be routed to the appropriate department until an officer takes your case.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}