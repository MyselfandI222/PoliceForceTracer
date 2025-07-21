import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Users, ArrowLeft, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginAdmin() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    badgeNumber: "",
    email: "",
    password: "",
    department: ""
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
      
      // Mock successful login - accept standard test credentials
      if ((formData.email === 'test@test.com' && formData.password === 'password') || 
          (formData.badgeNumber && formData.email && formData.password && formData.department)) {
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('token', 'admin-mock-token');
        toast({
          title: "Administrator Access Granted",
          description: "Welcome to the police administrator dashboard.",
        });
        setLocation('/police-admin');
      } else {
        toast({
          title: "Authentication Failed", 
          description: "Please verify your credentials and department authorization.",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6">
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
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-xl mx-auto flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Administrator Access</CardTitle>
              <p className="text-slate-600 mt-2">Department performance monitoring and oversight</p>
            </div>
          </CardHeader>
          
          <CardContent>
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription className="text-red-800">
                Administrative access requires department authorization and elevated security clearance.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="badgeNumber">Administrator Badge Number</Label>
                <Input
                  id="badgeNumber"
                  name="badgeNumber"
                  placeholder="ADMIN-001"
                  value={formData.badgeNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department Code</Label>
                <Input
                  id="department"
                  name="department"
                  placeholder="METRO-PD-CYBER"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Official Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@metropd.gov"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Secure Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your secure password"
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
                className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Access Administrator Dashboard"}
              </Button>
            </form>

            <div className="mt-6 space-y-4 text-center">
              <div className="text-sm text-slate-600">
                <p>Demo Credentials:</p>
                <p className="font-mono text-xs bg-slate-100 p-2 rounded mt-1">
                  Badge: ADMIN-001<br />
                  Department: METRO-PD-CYBER<br />
                  Email: test@test.com<br />
                  Password: password
                </p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-slate-600 mb-3">Administrative Support</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" size="sm">
                    Contact IT Department
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    Request Access Reset
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-slate-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-slate-600 mt-0.5" />
                <div className="text-xs text-slate-600">
                  <p className="font-medium mb-1">Security Notice:</p>
                  <p>All administrative actions are logged and monitored. Unauthorized access attempts will be reported to internal affairs.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-red-600">
            Maximum security • Multi-factor authentication required
          </p>
        </div>
      </div>
    </div>
  );
}