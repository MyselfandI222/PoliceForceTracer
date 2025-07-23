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
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Settings, 
  Users, 
  Database, 
  Key, 
  BarChart3, 
  AlertTriangle,
  Server,
  Clock,
  Mail,
  FileText,
  Globe,
  Lock,
  Save,
  Plus,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const [systemSettings, setSystemSettings] = useState({
    systemName: "CryptoTrace Law Enforcement Platform",
    maintenanceMode: false,
    registrationOpen: false,
    maxConcurrentTraces: "50",
    dataRetention: "7years",
    backupFrequency: "daily",
    logLevel: "info"
  });

  const [userManagement, setUserManagement] = useState({
    autoApproval: false,
    passwordComplexity: "high",
    sessionTimeout: "30",
    maxLoginAttempts: "3",
    accountLockDuration: "60",
    requireTwoFactor: true
  });

  const [departmentSettings, setDepartmentSettings] = useState({
    maxOfficersPerDept: "100",
    departmentApproval: true,
    crossDepartmentAccess: false,
    budgetTracking: true,
    caseSharing: "department"
  });

  const [apiSettings, setApiSettings] = useState({
    rateLimitPerHour: "1000",
    apiKeyExpiration: "90days",
    webhookEnabled: true,
    auditLogging: true,
    ipWhitelist: ""
  });

  const [departments, setDepartments] = useState([
    { id: 1, name: "Metro PD Cyber Crimes", code: "METRO-CYBER-01", officers: 25, active: true },
    { id: 2, name: "State Police Digital Forensics", code: "STATE-DF-02", officers: 18, active: true },
    { id: 3, name: "FBI Crypto Task Force", code: "FBI-CTF-03", officers: 42, active: true }
  ]);

  const { toast } = useToast();

  const handleSaveSystem = () => {
    toast({
      title: "System Settings Updated",
      description: "System configuration has been saved successfully.",
    });
  };

  const handleSaveUsers = () => {
    toast({
      title: "User Management Settings Updated",
      description: "User policies and security settings have been applied.",
    });
  };

  const handleSaveDepartments = () => {
    toast({
      title: "Department Settings Updated",
      description: "Department management configuration has been saved.",
    });
  };

  const handleSaveAPI = () => {
    toast({
      title: "API Settings Updated",
      description: "API configuration and security settings have been applied.",
    });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">System Administration</h1>
            <p className="text-slate-600">Manage platform settings and department configurations</p>
          </div>
          <Badge variant="outline" className="bg-red-50 text-red-700">
            <Shield className="w-3 h-3 mr-1" />
            Super Admin
          </Badge>
        </div>

        <Tabs defaultValue="system" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="api">API & Security</TabsTrigger>
          </TabsList>

          <TabsContent value="system">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Server className="w-5 h-5" />
                    <span>System Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="systemName">System Name</Label>
                    <Input
                      id="systemName"
                      value={systemSettings.systemName}
                      onChange={(e) => setSystemSettings({...systemSettings, systemName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Concurrent Traces</Label>
                    <Select value={systemSettings.maxConcurrentTraces} onValueChange={(value) => setSystemSettings({...systemSettings, maxConcurrentTraces: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25 Traces</SelectItem>
                        <SelectItem value="50">50 Traces</SelectItem>
                        <SelectItem value="100">100 Traces</SelectItem>
                        <SelectItem value="200">200 Traces</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Data Retention Period</Label>
                    <Select value={systemSettings.dataRetention} onValueChange={(value) => setSystemSettings({...systemSettings, dataRetention: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1year">1 Year</SelectItem>
                        <SelectItem value="3years">3 Years</SelectItem>
                        <SelectItem value="5years">5 Years</SelectItem>
                        <SelectItem value="7years">7 Years</SelectItem>
                        <SelectItem value="permanent">Permanent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Backup Frequency</Label>
                    <Select value={systemSettings.backupFrequency} onValueChange={(value) => setSystemSettings({...systemSettings, backupFrequency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>System Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-slate-600">Disable system for maintenance</p>
                    </div>
                    <Switch
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>User Registration</Label>
                      <p className="text-sm text-slate-600">Allow new officer registrations</p>
                    </div>
                    <Switch
                      checked={systemSettings.registrationOpen}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, registrationOpen: checked})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>System Log Level</Label>
                    <Select value={systemSettings.logLevel} onValueChange={(value) => setSystemSettings({...systemSettings, logLevel: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="error">Error Only</SelectItem>
                        <SelectItem value="warn">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Button onClick={handleSaveSystem} className="w-full mt-6">
              <Save className="w-4 h-4 mr-2" />
              Save System Settings
            </Button>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>User Management Policies</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-Approve Registrations</Label>
                        <p className="text-sm text-slate-600">Automatically approve new officer accounts</p>
                      </div>
                      <Switch
                        checked={userManagement.autoApproval}
                        onCheckedChange={(checked) => setUserManagement({...userManagement, autoApproval: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Require Two-Factor Auth</Label>
                        <p className="text-sm text-slate-600">Mandatory 2FA for all users</p>
                      </div>
                      <Switch
                        checked={userManagement.requireTwoFactor}
                        disabled={true}
                        onCheckedChange={(checked) => setUserManagement({...userManagement, requireTwoFactor: checked})}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Password Complexity</Label>
                      <Select value={userManagement.passwordComplexity} onValueChange={(value) => setUserManagement({...userManagement, passwordComplexity: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="maximum">Maximum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Session Timeout (minutes)</Label>
                      <Select value={userManagement.sessionTimeout} onValueChange={(value) => setUserManagement({...userManagement, sessionTimeout: value})}>
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
                    <div className="space-y-2">
                      <Label>Max Login Attempts</Label>
                      <Select value={userManagement.maxLoginAttempts} onValueChange={(value) => setUserManagement({...userManagement, maxLoginAttempts: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 Attempts</SelectItem>
                          <SelectItem value="5">5 Attempts</SelectItem>
                          <SelectItem value="10">10 Attempts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Account Lock Duration (minutes)</Label>
                      <Select value={userManagement.accountLockDuration} onValueChange={(value) => setUserManagement({...userManagement, accountLockDuration: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="1440">24 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <Button onClick={handleSaveUsers} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save User Management Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Department Management</span>
                    </div>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Department
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.map((dept) => (
                      <div key={dept.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h4 className="font-medium">{dept.name}</h4>
                          <p className="text-sm text-slate-600">Code: {dept.code} • {dept.officers} officers</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={dept.active ? "default" : "secondary"}>
                            {dept.active ? "Active" : "Inactive"}
                          </Badge>
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Policies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Max Officers per Department</Label>
                      <Select value={departmentSettings.maxOfficersPerDept} onValueChange={(value) => setDepartmentSettings({...departmentSettings, maxOfficersPerDept: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50">50 Officers</SelectItem>
                          <SelectItem value="100">100 Officers</SelectItem>
                          <SelectItem value="200">200 Officers</SelectItem>
                          <SelectItem value="unlimited">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Case Sharing Level</Label>
                      <Select value={departmentSettings.caseSharing} onValueChange={(value) => setDepartmentSettings({...departmentSettings, caseSharing: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Sharing</SelectItem>
                          <SelectItem value="department">Within Department</SelectItem>
                          <SelectItem value="region">Regional</SelectItem>
                          <SelectItem value="all">All Departments</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Department Approval</Label>
                      <p className="text-sm text-slate-600">Admin approval needed for new departments</p>
                    </div>
                    <Switch
                      checked={departmentSettings.departmentApproval}
                      onCheckedChange={(checked) => setDepartmentSettings({...departmentSettings, departmentApproval: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Cross-Department Access</Label>
                      <p className="text-sm text-slate-600">Allow officers to view other department cases</p>
                    </div>
                    <Switch
                      checked={departmentSettings.crossDepartmentAccess}
                      onCheckedChange={(checked) => setDepartmentSettings({...departmentSettings, crossDepartmentAccess: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Budget Tracking</Label>
                      <p className="text-sm text-slate-600">Track department spending on premium traces</p>
                    </div>
                    <Switch
                      checked={departmentSettings.budgetTracking}
                      onCheckedChange={(checked) => setDepartmentSettings({...departmentSettings, budgetTracking: checked})}
                    />
                  </div>
                  <Button onClick={handleSaveDepartments} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Department Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5" />
                  <span>API & Security Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Rate Limit (per hour)</Label>
                      <Select value={apiSettings.rateLimitPerHour} onValueChange={(value) => setApiSettings({...apiSettings, rateLimitPerHour: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100">100 requests</SelectItem>
                          <SelectItem value="500">500 requests</SelectItem>
                          <SelectItem value="1000">1,000 requests</SelectItem>
                          <SelectItem value="5000">5,000 requests</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>API Key Expiration</Label>
                      <Select value={apiSettings.apiKeyExpiration} onValueChange={(value) => setApiSettings({...apiSettings, apiKeyExpiration: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30days">30 Days</SelectItem>
                          <SelectItem value="90days">90 Days</SelectItem>
                          <SelectItem value="1year">1 Year</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Webhook Integration</Label>
                        <p className="text-sm text-slate-600">Enable webhook notifications</p>
                      </div>
                      <Switch
                        checked={apiSettings.webhookEnabled}
                        onCheckedChange={(checked) => setApiSettings({...apiSettings, webhookEnabled: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>API Audit Logging</Label>
                        <p className="text-sm text-slate-600">Log all API requests</p>
                      </div>
                      <Switch
                        checked={apiSettings.auditLogging}
                        onCheckedChange={(checked) => setApiSettings({...apiSettings, auditLogging: checked})}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>IP Whitelist</Label>
                  <Textarea
                    placeholder="Enter IP addresses or ranges (one per line)"
                    value={apiSettings.ipWhitelist}
                    onChange={(e) => setApiSettings({...apiSettings, ipWhitelist: e.target.value})}
                  />
                </div>
                <Button onClick={handleSaveAPI} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save API Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}