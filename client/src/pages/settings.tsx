import { useState } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Shield, 
  Bell, 
  Database, 
  Key, 
  Monitor,
  Mail,
  FileText,
  Download,
  Trash2,
  AlertCircle,
  Save,
  RefreshCw,
  Globe,
  Clock,
  Phone,
  Badge as BadgeIcon,
  Building,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/auth";

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getCurrentUser,
  });

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings Saved",
        description: `Your ${section} settings have been updated successfully.`,
      });
    }, 1500);
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your data export will be emailed to you within 24 hours.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Contact Administrator",
      description: "Account deletion requires approval from your department administrator.",
      variant: "destructive",
    });
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">Manage your account, preferences, and security settings</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="data">Data & Privacy</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Officer Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="badge">Badge Number</Label>
                    <Input id="badge" defaultValue={user?.badgeNumber} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" defaultValue={user?.department} readOnly className="bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rank">Rank/Position</Label>
                    <Select defaultValue="detective">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="officer">Officer</SelectItem>
                        <SelectItem value="detective">Detective</SelectItem>
                        <SelectItem value="sergeant">Sergeant</SelectItem>
                        <SelectItem value="lieutenant">Lieutenant</SelectItem>
                        <SelectItem value="captain">Captain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="(555) 123-4567" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio/Specialization</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Describe your specialization and experience in financial crimes investigation..."
                    className="min-h-20"
                  />
                </div>
                <Button onClick={() => handleSaveSettings("profile")} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Profile"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Account Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Password</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                  </div>
                  <Button variant="outline">
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">SMS Authentication</p>
                      <p className="text-sm text-slate-600">Receive codes via text message</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg mt-2">
                    <div>
                      <p className="font-medium">App Authentication</p>
                      <p className="text-sm text-slate-600">Use authenticator app (recommended)</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Active Sessions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Monitor className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-slate-600">Chrome on Windows • 192.168.1.100</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="font-medium">Mobile Session</p>
                          <p className="text-sm text-slate-600">Safari on iPhone • Last active 2 hours ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Revoke</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Email Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Trace Completion</p>
                        <p className="text-sm text-slate-600">When a trace analysis is completed</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Case Updates</p>
                        <p className="text-sm text-slate-600">Status changes and new findings</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weekly Summary</p>
                        <p className="text-sm text-slate-600">Weekly report of your investigation activity</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Security Alerts</p>
                        <p className="text-sm text-slate-600">Login attempts and security events</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">SMS Notifications</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Urgent Alerts</p>
                        <p className="text-sm text-slate-600">Critical findings requiring immediate attention</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Premium Trace Ready</p>
                        <p className="text-sm text-slate-600">When premium traces are completed</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Notification Timing</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quiet-hours-start">Quiet Hours Start</Label>
                      <Input id="quiet-hours-start" type="time" defaultValue="22:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quiet-hours-end">Quiet Hours End</Label>
                      <Input id="quiet-hours-end" type="time" defaultValue="08:00" />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSaveSettings("notifications")} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="w-5 h-5" />
                  <span>Display & Interface</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select defaultValue="light">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="america/new_york">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="america/new_york">Eastern Time (ET)</SelectItem>
                          <SelectItem value="america/chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="america/denver">Mountain Time (MT)</SelectItem>
                          <SelectItem value="america/los_angeles">Pacific Time (PT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date-format">Date Format</Label>
                      <Select defaultValue="mm/dd/yyyy">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Dashboard Preferences</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-refresh Dashboard</p>
                        <p className="text-sm text-slate-600">Automatically update trace status every 30 seconds</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Compact View</p>
                        <p className="text-sm text-slate-600">Show more information in less space</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Advanced Analytics</p>
                        <p className="text-sm text-slate-600">Display detailed charts and metrics</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSaveSettings("preferences")} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data & Privacy */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>Data Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Data Retention</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Case Data Retention</p>
                        <p className="text-sm text-slate-600">How long to keep completed case data</p>
                      </div>
                      <Select defaultValue="7-years">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5-years">5 Years</SelectItem>
                          <SelectItem value="7-years">7 Years</SelectItem>
                          <SelectItem value="10-years">10 Years</SelectItem>
                          <SelectItem value="permanent">Permanent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Activity Logs</p>
                        <p className="text-sm text-slate-600">Keep audit trail of user actions</p>
                      </div>
                      <Select defaultValue="2-years">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-year">1 Year</SelectItem>
                          <SelectItem value="2-years">2 Years</SelectItem>
                          <SelectItem value="5-years">5 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Data Export</h4>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      Export your investigation data for backup or transfer purposes.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" onClick={handleExportData}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Case Data
                      </Button>
                      <Button variant="outline" onClick={handleExportData}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Reports
                      </Button>
                      <Button variant="outline" onClick={handleExportData}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Activity Logs
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Privacy Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Usage Analytics</p>
                        <p className="text-sm text-slate-600">Help improve the platform by sharing anonymous usage data</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Performance Monitoring</p>
                        <p className="text-sm text-slate-600">Allow monitoring of app performance and errors</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 border-red-200">
                  <h4 className="font-medium text-red-600 mb-4 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Danger Zone
                  </h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700 mb-3">
                      Account deletion requires approval from your department administrator and will 
                      permanently remove all your investigation data.
                    </p>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Request Account Deletion
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>System Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Account Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>User ID:</span>
                        <span className="font-mono text-slate-600">{user?.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Account Created:</span>
                        <span className="text-slate-600">January 15, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Login:</span>
                        <span className="text-slate-600">Today, 2:22 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Role:</span>
                        <Badge variant="secondary">{user?.role}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">System Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Platform Version:</span>
                        <span className="text-slate-600">v2.4.1</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Database Status:</span>
                        <Badge className="bg-green-100 text-green-800">Online</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>API Status:</span>
                        <Badge className="bg-green-100 text-green-800">Operational</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Backup:</span>
                        <span className="text-slate-600">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Usage Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">47</div>
                        <div className="text-sm text-slate-600">Total Traces</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">38</div>
                        <div className="text-sm text-slate-600">Completed</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">3</div>
                        <div className="text-sm text-slate-600">Premium Used</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">128</div>
                        <div className="text-sm text-slate-600">Days Active</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Maintenance</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Clear Cache
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Logs
                    </Button>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      System Report
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Help & Support</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      View Documentation
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Technical Support
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Globe className="w-4 h-4 mr-2" />
                      Check System Status
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}