import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Clock, 
  Shield, 
  FileText, 
  Phone, 
  TrendingUp, 
  Users, 
  Headphones,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Database,
  AlertTriangle,
  Award,
  Target,
  BarChart3
} from "lucide-react";
import { PremiumModal } from "@/components/premium-modal";
import { useToast } from "@/hooks/use-toast";

export default function PremiumServices() {
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { toast } = useToast();

  const handleStartPremiumTrace = () => {
    setShowPremiumModal(true);
  };

  const handleContactSales = () => {
    toast({
      title: "Contact Information",
      description: "Enterprise sales: enterprise@cryptotrace.gov | (555) 123-4567",
    });
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-8 text-white mb-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-4">Premium Investigation Services</h1>
            <p className="text-xl text-blue-100 mb-6">
              Advanced cryptocurrency tracing with expedited processing, enhanced analytics, 
              and dedicated support for critical law enforcement operations.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={handleStartPremiumTrace}
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Premium Trace - $995
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={handleContactSales}
              >
                <Phone className="w-5 h-5 mr-2" />
                Enterprise Solutions
              </Button>
            </div>
          </div>
        </div>

        {/* Service Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Free Tier */}
          <Card className="border-2 border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Free Tier</CardTitle>
                <Badge variant="secondary">Current Plan</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-slate-900">$0</div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <span>3-7 day processing time</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-slate-400" />
                  <span>5 traces per week limit</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <span>Basic analysis reports</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-slate-400" />
                  <span>Standard support</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Tier */}
          <Card className="border-2 border-blue-500 bg-blue-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-blue-900">Premium Instant Trace</CardTitle>
                <Badge className="bg-blue-600">Recommended</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-blue-900">$995</div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800">1-2 hour priority processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800">Unlimited traces</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800">Advanced analytics & insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Headphones className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800">Dedicated analyst support</span>
                </div>
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleStartPremiumTrace}
              >
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Service Features */}
        <Tabs defaultValue="processing" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="processing">Processing Speed</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="processing" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-slate-600" />
                    <span>Standard Processing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-slate-900">3-7 Days</div>
                    <p className="text-slate-600">
                      Traces are processed in order with standard priority queue. 
                      Suitable for non-urgent investigations with flexible timelines.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Queue position</span>
                        <span className="text-slate-500">#15-30</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Business hours processing</span>
                        <span className="text-slate-500">Mon-Fri 9AM-5PM</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-900">Premium Processing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-blue-900">1-2 Hours</div>
                    <p className="text-blue-700">
                      Immediate priority processing with dedicated analysts. 
                      Perfect for time-sensitive investigations and active pursuit cases.
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Queue position</span>
                        <span className="text-blue-600 font-medium">#1 Priority</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>24/7 processing</span>
                        <span className="text-blue-600 font-medium">Available</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Standard Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Transaction history</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Address clustering</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Basic flow visualization</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900">Premium Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Advanced pattern recognition</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Cross-chain analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Entity identification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Risk scoring algorithms</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Enterprise Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4" />
                      <span className="text-sm">Custom algorithms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4" />
                      <span className="text-sm">API integration</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <span className="text-sm">Multi-jurisdiction support</span>
                    </div>
                    <Button variant="outline" size="sm" className="border-white text-blue-600 bg-white hover:bg-blue-50 mt-2">
                      Contact Sales
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="support" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Standard Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Response time</span>
                      <span className="text-slate-600">24-48 hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Support hours</span>
                      <span className="text-slate-600">Business hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Support channels</span>
                      <span className="text-slate-600">Email, portal</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Technical guidance</span>
                      <span className="text-slate-600">Documentation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-900">Premium Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Response time</span>
                      <span className="text-blue-600 font-medium">30 minutes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Support hours</span>
                      <span className="text-blue-600 font-medium">24/7</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Support channels</span>
                      <span className="text-blue-600 font-medium">Phone, email, chat</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Technical guidance</span>
                      <span className="text-blue-600 font-medium">Dedicated analyst</span>
                    </div>
                  </div>
                  <div className="bg-white rounded p-3 border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Headphones className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Dedicated Analyst</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Direct access to a certified cryptocurrency analyst for 
                      interpretation and consultation on trace results.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>Security & Compliance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">SOC 2 Type II certified</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">CJIS Security Policy compliant</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">End-to-end encryption</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Full audit trail</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Data retention policies</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>Court-Ready Reports</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 mb-4">
                    All premium traces include comprehensive reports designed 
                    for legal proceedings and evidence presentation.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Executive summary</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Detailed methodology</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Chain of custody documentation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ArrowRight className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Expert witness availability</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Use Cases */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">When to Use Premium Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-900">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>Active Pursuit</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 text-sm mb-3">
                  Suspect is actively moving funds or assets are at immediate risk of being moved to mixers or privacy coins.
                </p>
                <div className="text-xs text-red-600">
                  ⚡ Time-sensitive • Requires immediate action
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-yellow-900">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span>Court Deadlines</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-yellow-700 text-sm mb-3">
                  Evidence needed for upcoming hearings, warrant applications, or prosecution deadlines.
                </p>
                <div className="text-xs text-yellow-600">
                  📅 Legal timelines • Documentation required
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-900">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span>High-Value Cases</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 text-sm mb-3">
                  Large financial losses, organized crime, or cases requiring detailed forensic analysis.
                </p>
                <div className="text-xs text-green-600">
                  💰 High-stakes • Advanced analytics needed
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ROI Calculator */}
        <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-2 border-blue-200 mb-12">
          <CardHeader>
            <CardTitle className="text-xl text-slate-900">Return on Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">$995</div>
                <div className="text-sm text-slate-600">Premium trace cost</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">$2.1M</div>
                <div className="text-sm text-slate-600">Average recovery per case</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">2,100x</div>
                <div className="text-sm text-slate-600">Average ROI multiplier</div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg border">
              <p className="text-sm text-slate-700">
                <strong>Case Study:</strong> Metro PD recovered $3.2M in stolen cryptocurrency 
                within 6 hours using premium instant trace, preventing funds from being 
                moved to privacy coins. Traditional processing would have taken 5 days.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Start a Premium Trace?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Get priority processing, advanced analytics, and dedicated support 
                for your most critical cryptocurrency investigations.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  onClick={handleStartPremiumTrace}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Start Premium Trace - $995
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                  onClick={handleContactSales}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Enterprise Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <PremiumModal 
        open={showPremiumModal}
        onOpenChange={setShowPremiumModal}
        onUpgrade={() => {
          toast({
            title: "Premium Access Activated",
            description: "Your trace will be processed within 1-2 hours.",
          });
        }}
      />
    </Layout>
  );
}