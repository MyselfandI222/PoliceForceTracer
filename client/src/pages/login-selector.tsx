import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, UserCheck } from "lucide-react";

export default function LoginSelector() {
  const [, setLocation] = useLocation();

  const loginTypes = [
    {
      id: "victim",
      title: "Victim Portal",
      description: "Track your cryptocurrency theft investigation case status and results",
      icon: UserCheck,
      features: [
        "View case progress and status",
        "Download investigation reports", 
        "Track recovery amounts",
        "Contact assigned officers",
        "View action history"
      ],
      buttonText: "Access Victim Portal",
      route: "/login/victim",
      gradient: "from-blue-600 to-blue-800"
    },
    {
      id: "officer", 
      title: "Police Officer Portal",
      description: "Investigate cryptocurrency theft cases and manage traces",
      icon: Shield,
      features: [
        "Submit and manage trace requests",
        "Access premium instant traces",
        "Generate investigation reports",
        "Case management dashboard",
        "Evidence documentation"
      ],
      buttonText: "Officer Login",
      route: "/login/officer", 
      gradient: "from-slate-700 to-slate-900"
    },
    {
      id: "admin",
      title: "Police Administrator",
      description: "Monitor department performance and officer statistics",
      icon: Users,
      features: [
        "Officer performance monitoring",
        "Department-wide statistics", 
        "Monthly performance reports",
        "Success rate analytics",
        "Resource allocation insights"
      ],
      buttonText: "Administrator Access",
      route: "/login/admin",
      gradient: "from-red-600 to-red-800"
    }
  ];

  const handleLoginTypeSelect = (route: string) => {
    setLocation(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">CryptoTrace</h1>
          <p className="text-xl text-slate-600 mb-2">Law Enforcement Cryptocurrency Investigation Platform</p>
          <p className="text-slate-500">Select your portal to access the system</p>
        </div>

        {/* Login Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loginTypes.map((type) => {
            const Icon = type.icon;
            
            return (
              <Card key={type.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
                <CardHeader>
                  <div className={`w-full h-32 bg-gradient-to-br ${type.gradient} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="text-xl text-center">{type.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 text-center">{type.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-900">Features:</h4>
                    <ul className="space-y-1">
                      {type.features.map((feature, index) => (
                        <li key={index} className="text-sm text-slate-600 flex items-start">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    className={`w-full bg-gradient-to-r ${type.gradient} hover:opacity-90 transition-opacity`}
                    onClick={() => handleLoginTypeSelect(type.route)}
                  >
                    {type.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-slate-500">
            Secure access for law enforcement agencies and cryptocurrency theft victims
          </p>
          <p className="text-xs text-slate-400">
            SOC 2 Type II Certified • CJIS Security Policy Compliant • End-to-End Encryption
          </p>
        </div>
      </div>
    </div>
  );
}