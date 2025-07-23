import { useState } from "react";
import { Layout } from "@/components/layout";
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
  Shield, 
  Bell, 
  Key, 
  Eye, 
  Clock, 
  FileText, 
  Mail,
  Phone,
  MapPin,
  Building2,
  Settings,
  Save,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OfficerSettings() {
  const [profileData, setProfileData] = useState({
    name: "Officer John Smith",
    email: "j.smith@metropd.gov",
    badgeNumber: "OFF-1234",
    department: "Metro PD Cyber Crimes",
    rank: "Detective",
    phone: "(555) 123-4567",
    division: "Digital Asset Investigation",
    supervisor: "Lieutenant Sarah Wilson"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    caseUpdates: true,
    newAssignments: true,
    traceCompletion: true,
    urgentAlerts: true,
    weeklyReports: false,
    systemMaintenance: true,
    emailDigest: "daily",
    soundAlerts: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    sessionTimeout: "30",
    autoLock: true,
    auditLogging: true,
    ipRestrictions: false,
    deviceTracking: true
  });

  const [investigationPreferences, setInvestigationPreferences] = useState({
    defaultTraceType: "standard",
    autoAssignPriority: true,
    preferredReportFormat: "comprehensive",
    evidenceRetention: "5years",
    caseLoadLimit: "25",
    specialization: "cryptocurrency"
  });

  const { toast } = useToast();

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Updated", 
      description: "Your notification preferences have been saved.",
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: "Security Settings Updated",
      description: "Your security preferences have been applied.",
    });
  };

  const handleSaveInvestigation = () => {
    toast({
      title: "Investigation Preferences Updated",
      description: "Your investigation settings have been configured.",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Officer Settings</h1>
            <p className="text-slate-600">Manage your law enforcement profile and preferences</p>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Shield className="w-3 h-3 mr-1" />
            Verified Officer
          </Badge>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="investigation">Investigation</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Officer Profile</span>
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
                    <Label htmlFor="badgeNumber">Badge Number</Label>
                    <Input
                      id="badgeNumber"
                      value={profileData.badgeNumber}
                      onChange={(e) => setProfileData({...profileData, badgeNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Official Email</Label>
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
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={profileData.department}
                      onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rank">Rank</Label>
                    <Select value={profileData.rank} onValueChange={(value) => setProfileData({...profileData, rank: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Officer">Officer</SelectItem>
                        <SelectItem value="Detective">Detective</SelectItem>
                        <SelectItem value="Sergeant">Sergeant</SelectItem>
                        <SelectItem value="Lieutenant">Lieutenant</SelectItem>
                        <SelectItem value="Captain">Captain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="division">Division</Label>
                    <Input
                      id="division"
                      value={profileData.division}
                      onChange={(e) => setProfileData({...profileData, division: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supervisor">Supervisor</Label>
                    <Input
                      id="supervisor"
                      value={profileData.supervisor}
                      onChange={(e) => setProfileData({...profileData, supervisor: e.target.value})}
                    />
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
                      <p className="text-sm text-slate-600">Get notified when case status changes</p>
                    </div>
                    <Switch
                      checked={notificationSettings.caseUpdates}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, caseUpdates: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Case Assignments</Label>
                      <p className="text-sm text-slate-600">Alerts for newly assigned cases</p>
                    </div>
                    <Switch
                      checked={notificationSettings.newAssignments}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, newAssignments: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Trace Completion</Label>
                      <p className="text-sm text-slate-600">When cryptocurrency traces are completed</p>
                    </div>
                    <Switch
                      checked={notificationSettings.traceCompletion}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, traceCompletion: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Urgent Alerts</Label>
                      <p className="text-sm text-slate-600">High-priority case notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.urgentAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, urgentAlerts: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-slate-600">Summary of weekly activities</p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weeklyReports: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Sound Alerts</Label>
                      <p className="text-sm text-slate-600">Audio notifications for urgent cases</p>
                    </div>
                    <Switch
                      checked={notificationSettings.soundAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, soundAlerts: checked})}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Email Digest Frequency</Label>
                  <Select value={notificationSettings.emailDigest} onValueChange={(value) => setNotificationSettings({...notificationSettings, emailDigest: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
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

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5" />
                  <span>Security Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-slate-600">Required for law enforcement accounts</p>
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      <Shield className="w-3 h-3 mr-1" />
                      Enabled
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-Lock Screen</Label>
                      <p className="text-sm text-slate-600">Lock after period of inactivity</p>
                    </div>
                    <Switch
                      checked={securitySettings.autoLock}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, autoLock: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Audit Logging</Label>
                      <p className="text-sm text-slate-600">Track all system activities</p>
                    </div>
                    <Switch
                      checked={securitySettings.auditLogging}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, auditLogging: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Device Tracking</Label>
                      <p className="text-sm text-slate-600">Monitor access from different devices</p>
                    </div>
                    <Switch
                      checked={securitySettings.deviceTracking}
                      onCheckedChange={(checked) => setSecuritySettings({...securitySettings, deviceTracking: checked})}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Select value={securitySettings.sessionTimeout} onValueChange={(value) => setSecuritySettings({...securitySettings, sessionTimeout: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSaveSecurity} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investigation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Investigation Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Trace Type</Label>
                    <Select value={investigationPreferences.defaultTraceType} onValueChange={(value) => setInvestigationPreferences({...investigationPreferences, defaultTraceType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (Free)</SelectItem>
                        <SelectItem value="premium">Premium (Instant)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Report Format</Label>
                    <Select value={investigationPreferences.preferredReportFormat} onValueChange={(value) => setInvestigationPreferences({...investigationPreferences, preferredReportFormat: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprehensive">Comprehensive</SelectItem>
                        <SelectItem value="summary">Summary</SelectItem>
                        <SelectItem value="technical">Technical Details</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Evidence Retention Period</Label>
                    <Select value={investigationPreferences.evidenceRetention} onValueChange={(value) => setInvestigationPreferences({...investigationPreferences, evidenceRetention: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1year">1 Year</SelectItem>
                        <SelectItem value="5years">5 Years</SelectItem>
                        <SelectItem value="10years">10 Years</SelectItem>
                        <SelectItem value="permanent">Permanent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Case Load Limit</Label>
                    <Select value={investigationPreferences.caseLoadLimit} onValueChange={(value) => setInvestigationPreferences({...investigationPreferences, caseLoadLimit: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 Cases</SelectItem>
                        <SelectItem value="25">25 Cases</SelectItem>
                        <SelectItem value="35">35 Cases</SelectItem>
                        <SelectItem value="50">50 Cases</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-Assign Priority</Label>
                      <p className="text-sm text-slate-600">Automatically prioritize cases based on value and urgency</p>
                    </div>
                    <Switch
                      checked={investigationPreferences.autoAssignPriority}
                      onCheckedChange={(checked) => setInvestigationPreferences({...investigationPreferences, autoAssignPriority: checked})}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveInvestigation} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Investigation Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}