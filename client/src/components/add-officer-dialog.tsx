import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  UserPlus, 
  Shield, 
  Badge, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

const addOfficerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  badgeNumber: z.string().min(3, "Badge number must be at least 3 characters"),
  rank: z.string().min(1, "Please select a rank"),
  department: z.string().min(1, "Department code is required"),
  email: z.string().email("Valid email address required"),
  phone: z.string().min(10, "Valid phone number required"),
  division: z.string().min(1, "Please select a division"),
  clearanceLevel: z.string().min(1, "Please select clearance level"),
  supervisor: z.string().min(1, "Supervisor assignment required"),
  startDate: z.string().min(1, "Start date required"),
  emergencyContact: z.string().min(5, "Emergency contact required"),
  emergencyPhone: z.string().min(10, "Emergency contact phone required"),
  specializations: z.string().optional(),
  notes: z.string().optional()
});

type AddOfficerForm = z.infer<typeof addOfficerSchema>;

export function AddOfficerDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<AddOfficerForm>({
    resolver: zodResolver(addOfficerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      badgeNumber: "",
      rank: "",
      department: "METRO-CYBER-01",
      email: "",
      phone: "",
      division: "",
      clearanceLevel: "",
      supervisor: "",
      startDate: "",
      emergencyContact: "",
      emergencyPhone: "",
      specializations: "",
      notes: ""
    }
  });

  const handleSubmit = async (data: AddOfficerForm) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Officer Invitation Sent",
      description: `Invitation email sent to ${data.email}. Officer will receive setup instructions and temporary credentials.`,
    });

    form.reset();
    setOpen(false);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <UserPlus className="w-4 h-4" />
          <span>Add Officer</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <span>Add New Police Officer</span>
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>Email Address</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="officer@department.gov" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>Phone Number</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Department Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Badge className="w-5 h-5 text-blue-600" />
                  <span>Department Assignment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="badgeNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Badge Number</FormLabel>
                      <FormControl>
                        <Input placeholder="CYBER-2024-089" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rank</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rank" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="officer">Police Officer</SelectItem>
                          <SelectItem value="corporal">Corporal</SelectItem>
                          <SelectItem value="sergeant">Sergeant</SelectItem>
                          <SelectItem value="lieutenant">Lieutenant</SelectItem>
                          <SelectItem value="captain">Captain</SelectItem>
                          <SelectItem value="detective">Detective</SelectItem>
                          <SelectItem value="senior-detective">Senior Detective</SelectItem>
                          <SelectItem value="specialist">Specialist</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department Code</FormLabel>
                      <FormControl>
                        <Input placeholder="METRO-CYBER-01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="division"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Division</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select division" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cyber-crimes">Cyber Crimes Unit</SelectItem>
                          <SelectItem value="financial-crimes">Financial Crimes</SelectItem>
                          <SelectItem value="digital-forensics">Digital Forensics</SelectItem>
                          <SelectItem value="investigations">Criminal Investigations</SelectItem>
                          <SelectItem value="intelligence">Intelligence Division</SelectItem>
                          <SelectItem value="patrol">Patrol Division</SelectItem>
                          <SelectItem value="special-operations">Special Operations</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Security & Access */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <span>Security Clearance & Access</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clearanceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Clearance Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select clearance level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public-trust">Public Trust</SelectItem>
                          <SelectItem value="confidential">Confidential</SelectItem>
                          <SelectItem value="secret">Secret</SelectItem>
                          <SelectItem value="top-secret">Top Secret</SelectItem>
                          <SelectItem value="sci">Top Secret/SCI</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="supervisor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Direct Supervisor</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select supervisor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="capt-rodriguez">Captain Rodriguez (ADMIN-4987)</SelectItem>
                          <SelectItem value="lt-johnson">Lieutenant Johnson (ADMIN-5023)</SelectItem>
                          <SelectItem value="sgt-williams">Sergeant Williams (ADMIN-4765)</SelectItem>
                          <SelectItem value="det-sup-davis">Detective Supervisor Davis (ADMIN-5134)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Start Date</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specializations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specializations</FormLabel>
                      <FormControl>
                        <Input placeholder="Cryptocurrency, Digital Forensics, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Phone className="w-5 h-5 text-red-600" />
                  <span>Emergency Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Smith (spouse)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 987-6543" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span>Additional Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Administrative Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional information, training requirements, or special considerations..."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Invitation Process</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Officer will receive an email with setup instructions, temporary credentials, 
                      and system access requirements.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="min-w-[140px]"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}