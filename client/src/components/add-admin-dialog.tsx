import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Shield, AlertTriangle, Mail, User, Building, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddAdminDialogProps {
  variant?: "button" | "card";
}

export function AddAdminDialog({ variant = "button" }: AddAdminDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    badgeNumber: "",
    department: "",
    rank: "",
    specialization: "",
    phone: "",
    emergencyContact: "",
    justification: ""
  });
  const { toast } = useToast();

  const ranks = [
    "Captain",
    "Lieutenant", 
    "Sergeant",
    "Detective Supervisor",
    "Senior Administrator",
    "Department Head"
  ];

  const specializations = [
    "Cyber Crimes Division",
    "Financial Crimes Unit",
    "Major Cases Division", 
    "Technical Operations",
    "Training & Development",
    "Policy & Compliance",
    "Inter-Agency Coordination"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate administrator invitation process
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOpen(false);
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        badgeNumber: "",
        department: "",
        rank: "",
        specialization: "",
        phone: "",
        emergencyContact: "",
        justification: ""
      });
      
      toast({
        title: "Administrator Invitation Sent",
        description: `Invitation sent to ${formData.email}. They will receive setup instructions and department authorization codes.`,
      });
    }, 2000);
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && 
                    formData.badgeNumber && formData.department && formData.rank && 
                    formData.specialization && formData.justification;

  const AdminForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="w-4 h-4" />
        <AlertDescription className="text-amber-800">
          Administrator invitations require department authorization and security clearance verification.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="John"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Smith"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Official Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="j.smith@metropd.gov"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="badgeNumber">Administrator Badge Number *</Label>
          <Input
            id="badgeNumber"
            value={formData.badgeNumber}
            onChange={(e) => handleInputChange('badgeNumber', e.target.value)}
            placeholder="ADMIN-5678"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department Code *</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            placeholder="METRO-CYBER-01"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rank">Administrative Rank *</Label>
        <Select value={formData.rank} onValueChange={(value) => handleInputChange('rank', value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select administrative rank" />
          </SelectTrigger>
          <SelectContent>
            {ranks.map((rank) => (
              <SelectItem key={rank} value={rank}>{rank}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialization">Area of Specialization *</Label>
        <Select value={formData.specialization} onValueChange={(value) => handleInputChange('specialization', value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Select specialization area" />
          </SelectTrigger>
          <SelectContent>
            {specializations.map((spec) => (
              <SelectItem key={spec} value={spec}>{spec}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Direct Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="(555) 234-5678"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyContact">Emergency Contact</Label>
          <Input
            id="emergencyContact"
            value={formData.emergencyContact}
            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
            placeholder="(555) 987-6543"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="justification">Authorization Justification *</Label>
        <Textarea
          id="justification"
          value={formData.justification}
          onChange={(e) => handleInputChange('justification', e.target.value)}
          placeholder="Provide detailed justification for administrator access, including department needs, oversight responsibilities, and authorization from department leadership..."
          rows={3}
          required
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Invitation Process:</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>Email invitation sent to candidate</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Security clearance verification initiated</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            <span>Department authorization review (2-5 business days)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Account activation upon approval</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button 
          type="submit" 
          disabled={!isFormValid || isSubmitting} 
          className="flex-1"
        >
          {isSubmitting ? "Sending Invitation..." : "Send Administrator Invitation"}
        </Button>
        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );

  if (variant === "card") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Add Department Administrator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            Invite qualified personnel to join as department administrators with oversight and management capabilities.
          </p>
          
          <div className="space-y-2">
            <Badge variant="outline" className="text-xs">Requirements</Badge>
            <ul className="text-xs text-slate-600 space-y-1 ml-4">
              <li>• Valid department badge and authorization</li>
              <li>• Security clearance verification</li>
              <li>• Department leadership approval</li>
              <li>• Administrative rank qualification</li>
            </ul>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite New Administrator
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Department Administrator</DialogTitle>
                <DialogDescription>
                  Submit an invitation for qualified personnel to join as department administrators.
                </DialogDescription>
              </DialogHeader>
              <AdminForm />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Administrator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Department Administrator</DialogTitle>
          <DialogDescription>
            Submit an invitation for qualified personnel to join as department administrators.
          </DialogDescription>
        </DialogHeader>
        <AdminForm />
      </DialogContent>
    </Dialog>
  );
}