import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Phone, Mail, MessageSquare, AlertTriangle, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminContactProps {
  variant?: "button" | "card";
}

export function AdminContact({ variant = "button" }: AdminContactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [requestType, setRequestType] = useState("");
  const [message, setMessage] = useState("");
  const [traceId, setTraceId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const adminContacts = [
    {
      name: "Captain Michael Rodriguez",
      title: "Cyber Crimes Division Head",
      badge: "ADMIN-4987",
      phone: "(555) 234-5678",
      email: "m.rodriguez@metropd.gov",
      hours: "Mon-Fri 8AM-6PM",
      specialization: "Major Cases & Policy"
    },
    {
      name: "Lieutenant Sarah Chen", 
      title: "Technical Operations Supervisor",
      badge: "ADMIN-3421",
      phone: "(555) 234-5679",
      email: "s.chen@metropd.gov", 
      hours: "Mon-Fri 7AM-7PM",
      specialization: "System Issues & Training"
    }
  ];

  const requestTypes = [
    { value: "technical", label: "Technical Issue", icon: AlertTriangle },
    { value: "case-escalation", label: "Case Escalation", icon: Shield },
    { value: "policy", label: "Policy Question", icon: Users },
    { value: "training", label: "Training Request", icon: MessageSquare },
    { value: "urgent", label: "Urgent Matter", icon: Clock }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsOpen(false);
      setMessage("");
      setTraceId("");
      setRequestType("");
      
      toast({
        title: "Request Submitted",
        description: "Your administrator contact request has been sent. Expect a response within 2-4 hours during business hours.",
      });
    }, 1500);
  };

  const ContactForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="requestType">Request Type</Label>
        <Select value={requestType} onValueChange={setRequestType} required>
          <SelectTrigger>
            <SelectValue placeholder="Select request type" />
          </SelectTrigger>
          <SelectContent>
            {requestTypes.map((type) => {
              const Icon = type.icon;
              return (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {type.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {(requestType === "case-escalation" || requestType === "technical") && (
        <div className="space-y-2">
          <Label htmlFor="traceId">Case/Trace Number (Optional)</Label>
          <Input
            id="traceId"
            value={traceId}
            onChange={(e) => setTraceId(e.target.value)}
            placeholder="CRY-2024-001 or trace ID"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="message">Detailed Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please provide details about your request, including any relevant case information, technical issues, or questions..."
          rows={4}
          required
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Submitting..." : "Submit Request"}
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
            <Shield className="w-5 h-5" />
            Administrator Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            Need to escalate a case or contact your department administrator? 
            Submit a request through the secure internal communication system.
          </p>
          
          <div className="space-y-3">
            {adminContacts.map((admin, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{admin.name}</p>
                    <p className="text-xs text-slate-500">{admin.title}</p>
                  </div>
                  <Badge variant="outline">{admin.badge}</Badge>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    {admin.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    {admin.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {admin.hours}
                  </div>
                </div>
                <p className="text-xs text-blue-600 font-medium">{admin.specialization}</p>
              </div>
            ))}
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Submit Administrator Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Contact Administrator</DialogTitle>
              </DialogHeader>
              <ContactForm />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Shield className="w-4 h-4 mr-2" />
          Contact Administrator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Administrator</DialogTitle>
        </DialogHeader>
        <ContactForm />
      </DialogContent>
    </Dialog>
  );
}