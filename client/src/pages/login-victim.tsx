import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, UserCheck, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginVictim() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    caseNumber: "CRY-2024-78432",
    email: "test@test.com",
    password: "password"
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      
      // Mock successful login - accept standard test credentials or specific case number
      if ((formData.email === 'test@test.com' && formData.password === 'password' && formData.caseNumber === 'CRY-2024-78432') || 
          (formData.caseNumber && formData.email && formData.password)) {
        localStorage.setItem('userType', 'victim');
        localStorage.setItem('token', 'victim-mock-token');
        toast({
          title: "Login Successful",
          description: "Welcome to your victim portal.",
        });
        setLocation('/victim-portal');
      } else {
        toast({
          title: "Login Failed",
          description: "Please check your case number, email, and password.",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 hover:bg-white hover:bg-opacity-20"
          onClick={() => setLocation('/login')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Portal Selection
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl mx-auto flex items-center justify-center">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Victim Portal Access</CardTitle>
              <p className="text-slate-600 mt-2">Enter your case details to access your investigation</p>
            </div>
          </CardHeader>
          
          <CardContent>
            <Alert className="mb-6 border-blue-200 bg-blue-50">
              <Shield className="w-4 h-4" />
              <AlertDescription className="text-blue-800">
                Your case number and login credentials were provided by the investigating officer or department.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="caseNumber">Case Number</Label>
                <Input
                  id="caseNumber"
                  name="caseNumber"
                  placeholder="CRY-2024-78432"
                  value={formData.caseNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Access My Cases"}
              </Button>
            </form>

            <div className="mt-6 space-y-4 text-center">
              <div className="text-sm text-slate-600">
                <p>Demo Credentials:</p>
                <p className="font-mono text-xs bg-slate-100 p-2 rounded mt-1">
                  Case: CRY-2024-78432<br />
                  Email: test@test.com<br />
                  Password: password
                </p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-slate-600 mb-3">Need help accessing your case?</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" size="sm">
                    Contact Assigned Officer
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    Reset Password
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-blue-600">
            Your information is protected with bank-level security
          </p>
        </div>
      </div>
    </div>
  );
}