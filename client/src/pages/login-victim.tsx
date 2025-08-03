import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { TEST_CREDENTIALS } from "@/constants/test-credentials";

export default function VictimLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState(TEST_CREDENTIALS.VICTIM.email);
  const [password, setPassword] = useState(TEST_CREDENTIALS.VICTIM.password);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      return await response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      toast({
        title: "Login Successful",
        description: "Welcome to the CryptoTrace Victim Portal",
      });
      setLocation("/victim-portal");
    },
    onError: (error) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ email, password });
  };

  const fillTestCredentials = () => {
    setEmail(TEST_CREDENTIALS.VICTIM.email);
    setPassword(TEST_CREDENTIALS.VICTIM.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CryptoTrace</h1>
          <p className="text-gray-600">Victim Portal Access</p>
        </div>

        {/* Login Card */}
        <Card className="border-orange-200 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-orange-800">
              Sign In
            </CardTitle>
            <p className="text-sm text-center text-gray-600">
              Access your cryptocurrency investigation cases
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-orange-800">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="victim@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-orange-800">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Test Credentials */}
            <div className="mt-4">
              <Alert className="border-orange-200 bg-orange-50">
                <AlertDescription className="text-sm">
                  <strong>Demo Access:</strong> Use the pre-filled credentials or{" "}
                  <button
                    onClick={fillTestCredentials}
                    className="text-orange-600 hover:text-orange-700 underline"
                  >
                    click here
                  </button>{" "}
                  to auto-fill them.
                </AlertDescription>
              </Alert>
            </div>

            {/* Navigation */}
            <div className="mt-6 pt-4 border-t border-orange-200 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Are you a law enforcement officer?{" "}
                <button
                  onClick={() => setLocation("/login")}
                  className="text-orange-600 hover:text-orange-700 underline"
                >
                  Officer Login
                </button>
              </p>
              <p className="text-sm text-gray-600">
                Administrator access?{" "}
                <button
                  onClick={() => setLocation("/login-admin")}
                  className="text-orange-600 hover:text-orange-700 underline"
                >
                  Admin Portal
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact your assigned police officer or call the CryptoTrace support line.
          </p>
        </div>
      </div>
    </div>
  );
}