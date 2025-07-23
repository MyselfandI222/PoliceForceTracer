import { useState } from "react";
import { VictimLayout } from "@/components/victim-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Bell, 
  CreditCard, 
  Eye, 
  Mail,
  Phone,
  MapPin,
  Settings,
  Save,
  Shield,
  Lock,
  AlertTriangle,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VictimSettings() {
  const [profileData, setProfileData] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 987-6543",
    address: "123 Main Street, City, State 12345",
    caseContact: "Detective Mike Chen",
    emergencyContact: "John Johnson - (555) 123-4567"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    caseUpdates: true,
    paymentConfirmations: true,
    reportReady: true,
    systemAlerts: false,
    emailSummary: "daily",
    smsAlerts: true,
    pushNotifications: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: false,
    analyticsTracking: false,
    marketingEmails: false,
    caseNumberVisible: true,
    publicProfile: false
  });

  const [paymentSettings, setPaymentSettings] = useState({
    autoPayEnabled: false,
    preferredMethod: "card",
    savePaymentInfo: true,
    receiptEmail: true,
    budgetAlerts: true,
    monthlySpendLimit: "5000"
  });

  const { toast } = useToast();

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your personal information has been saved.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleSavePrivacy = () => {
    toast({
      title: "Privacy Settings Updated",
      description: "Your privacy preferences have been applied.",
    });
  };

  const handleSavePayment = () => {
    toast({
      title: "Payment Settings Updated",
      description: "Your payment preferences have been configured.",
    });
  };

  return (
    <VictimLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
            <p className="text-slate-600">Manage your personal information and preferences</p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <User className="w-3 h-3 mr-1" />
            Verified Victim
          </Badge>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={profileData.emergencyContact}
                      onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Case Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Assigned Officer</Label>
                      <div className="p-3 bg-slate-50 rounded-md">
                        <p className="font-medium">{profileData.caseContact}</p>
                        <p className="text-sm text-slate-600">Metro PD Cyber Crimes</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Case Status</Label>
                      <div className="p-3 bg-blue-50 rounded-md">
                        <Badge variant="default">Active Investigation</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveProfile} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Case Updates</Label>
                      <p className="text-sm text-slate-600">When your case status changes</p>
                    </div>
                    <Switch
                      checked={notificationSettings.caseUpdates}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, caseUpdates: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Payment Confirmations</Label>
                      <p className="text-sm text-slate-600">Premium trace payment receipts</p>
                    </div>
                    <Switch
                      checked={notificationSettings.paymentConfirmations}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, paymentConfirmations: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Report Ready</Label>
                      <p className="text-sm text-slate-600">When investigation reports are available</p>
                    </div>
                    <Switch
                      checked={notificationSettings.reportReady}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, reportReady: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Alerts</Label>
                      <p className="text-sm text-slate-600">Text message notifications for urgent updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsAlerts: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-slate-600">Browser notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>System Alerts</Label>
                      <p className="text-sm text-slate-600">Platform maintenance and updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.systemAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, systemAlerts: checked})}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Email Summary Frequency</Label>
                  <Select value={notificationSettings.emailSummary} onValueChange={(value) => setNotificationSettings({...notificationSettings, emailSummary: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSaveNotifications} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Privacy & Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data Sharing</Label>
                      <p className="text-sm text-slate-600">Share case data with partner agencies</p>
                    </div>
                    <Switch
                      checked={privacySettings.dataSharing}
                      onCheckedChange={(checked) => setPrivacySettings({...privacySettings, dataSharing: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Analytics Tracking</Label>
                      <p className="text-sm text-slate-600">Help improve platform performance</p>
                    </div>
                    <Switch
                      checked={privacySettings.analyticsTracking}
                      onCheckedChange={(checked) => setPrivacySettings({...privacySettings, analyticsTracking: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-slate-600">Receive information about new features</p>
                    </div>
                    <Switch
                      checked={privacySettings.marketingEmails}
                      onCheckedChange={(checked) => setPrivacySettings({...privacySettings, marketingEmails: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Case Number</Label>
                      <p className="text-sm text-slate-600">Display case number in communications</p>
                    </div>
                    <Switch
                      checked={privacySettings.caseNumberVisible}
                      onCheckedChange={(checked) => setPrivacySettings({...privacySettings, caseNumberVisible: checked})}
                    />
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-900">Privacy Notice</h4>
                      <p className="text-sm text-amber-800 mt-1">
                        Your case information is protected under law enforcement privacy regulations. 
                        Only authorized personnel involved in your investigation have access to your data.
                      </p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSavePrivacy} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Privacy Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment & Billing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Save Payment Information</Label>
                      <p className="text-sm text-slate-600">Securely store payment methods</p>
                    </div>
                    <Switch
                      checked={paymentSettings.savePaymentInfo}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, savePaymentInfo: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Receipts</Label>
                      <p className="text-sm text-slate-600">Send payment confirmations to email</p>
                    </div>
                    <Switch
                      checked={paymentSettings.receiptEmail}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, receiptEmail: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Budget Alerts</Label>
                      <p className="text-sm text-slate-600">Notify when approaching spending limits</p>
                    </div>
                    <Switch
                      checked={paymentSettings.budgetAlerts}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, budgetAlerts: checked})}
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Preferred Payment Method</Label>
                    <Select value={paymentSettings.preferredMethod} onValueChange={(value) => setPaymentSettings({...paymentSettings, preferredMethod: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Spending Limit</Label>
                    <Select value={paymentSettings.monthlySpendLimit} onValueChange={(value) => setPaymentSettings({...paymentSettings, monthlySpendLimit: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1000">$1,000</SelectItem>
                        <SelectItem value="2500">$2,500</SelectItem>
                        <SelectItem value="5000">$5,000</SelectItem>
                        <SelectItem value="10000">$10,000</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Secure Payments</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        All payments are processed through encrypted, PCI-compliant systems. 
                        Premium trace fees are $995 per individual case upgrade.
                      </p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSavePayment} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Payment Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </VictimLayout>
  );
}