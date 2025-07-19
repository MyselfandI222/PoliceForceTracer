import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, DollarSign, Activity, AlertCircle } from "lucide-react";

export default function Admin() {
  const { data: adminData } = useQuery({
    queryKey: ["/api/admin/dashboard"],
  });

  if (!adminData) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto text-slate-400 mb-4" />
              <p className="text-slate-500">Loading admin dashboard...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const { stats, traces, officers } = adminData;

  return (
    <Layout>
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Department Administration</h2>
            <p className="text-slate-600">Metro PD Cyber Crimes Unit</p>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Active Officers</h4>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalOfficers}</p>
                  <p className="text-sm text-slate-600">Authorized users</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">This Month</h4>
                  <p className="text-2xl font-bold text-slate-900">{stats.completed + stats.activeTraces}</p>
                  <p className="text-sm text-slate-600">Total traces</p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Department Spend</h4>
                  <p className="text-2xl font-bold text-slate-900">${stats.monthlySpend.toLocaleString()}</p>
                  <p className="text-sm text-slate-600">Premium traces</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Officers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Department Officers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Officer</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Badge #</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Active Cases</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Last Activity</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {officers?.map((officer: any) => (
                    <tr key={officer.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {officer.name.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900">{officer.name}</p>
                            <p className="text-sm text-slate-500">{officer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{officer.badgeNumber}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {traces?.filter((t: any) => t.userId === officer.id && t.status !== 'completed').length || 0}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {new Date().getHours() > 12 ? `${24 - new Date().getHours()} hours ago` : '2 hours ago'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800">
                          Active
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Traces */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Department Traces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {traces?.slice(0, 5).map((trace: any) => (
                <div key={trace.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Activity className="text-blue-600 w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{trace.caseNumber}</p>
                      <p className="text-sm text-slate-500">{trace.victimName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={
                      trace.status === 'completed' ? 'bg-green-100 text-green-800' :
                      trace.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-slate-100 text-slate-800'
                    }>
                      {trace.status}
                    </Badge>
                    {trace.isPremium && (
                      <Badge className="bg-purple-100 text-purple-800">Premium</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
