import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddOfficerDialog } from "./add-officer-dialog";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Shield, 
  Phone, 
  Mail, 
  Calendar,
  CheckCircle,
  AlertCircle,
  UserCheck,
  UserX,
  Edit
} from "lucide-react";

interface Officer {
  id: string;
  name: string;
  badgeNumber: string;
  rank: string;
  division: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'training' | 'pending';
  clearance: string;
  startDate: string;
  supervisor: string;
  specializations: string[];
}

const mockOfficers: Officer[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    badgeNumber: "CYBER-2024-089",
    rank: "Detective",
    division: "Cyber Crimes Unit",
    email: "s.johnson@metro.gov",
    phone: "(555) 123-4567",
    status: "active",
    clearance: "Secret",
    startDate: "2024-01-15",
    supervisor: "Captain Rodriguez",
    specializations: ["Cryptocurrency", "Digital Forensics"]
  },
  {
    id: "2",
    name: "Michael Chen",
    badgeNumber: "CYBER-2024-067",
    rank: "Officer",
    division: "Cyber Crimes Unit", 
    email: "m.chen@metro.gov",
    phone: "(555) 234-5678",
    status: "active",
    clearance: "Confidential",
    startDate: "2024-03-22",
    supervisor: "Lieutenant Johnson",
    specializations: ["Blockchain Analysis", "Financial Crimes"]
  },
  {
    id: "3", 
    name: "Ashley Martinez",
    badgeNumber: "CYBER-2024-134",
    rank: "Specialist",
    division: "Digital Forensics",
    email: "a.martinez@metro.gov",
    phone: "(555) 345-6789",
    status: "training",
    clearance: "Public Trust",
    startDate: "2024-07-08",
    supervisor: "Sergeant Williams",
    specializations: ["Mobile Forensics"]
  },
  {
    id: "4",
    name: "David Thompson",
    badgeNumber: "CYBER-2024-145",
    rank: "Corporal",
    division: "Financial Crimes",
    email: "d.thompson@metro.gov", 
    phone: "(555) 456-7890",
    status: "pending",
    clearance: "Secret",
    startDate: "2024-07-25",
    supervisor: "Captain Rodriguez",
    specializations: ["Cryptocurrency", "Money Laundering"]
  }
];

export function OfficerManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [officers] = useState<Officer[]>(mockOfficers);

  const filteredOfficers = officers.filter(officer => {
    const matchesSearch = officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         officer.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         officer.division.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || officer.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'training': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <UserX className="w-4 h-4" />;
      case 'training': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <UserCheck className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Officer Management</h2>
          <p className="text-slate-600">Add, manage, and oversee department officers</p>
        </div>
        <AddOfficerDialog />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Officers</p>
                <p className="text-2xl font-bold text-slate-900">{officers.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Officers</p>
                <p className="text-2xl font-bold text-green-600">
                  {officers.filter(o => o.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">In Training</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {officers.filter(o => o.status === 'training').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-blue-600">
                  {officers.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Department Officers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search officers by name, badge, or division..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter: {filterStatus === 'all' ? 'All' : filterStatus}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                  All Officers
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                  Active Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('training')}>
                  In Training
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('pending')}>
                  Pending Approval
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('inactive')}>
                  Inactive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Officers Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Officer</TableHead>
                  <TableHead>Badge & Rank</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Clearance</TableHead>
                  <TableHead>Specializations</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOfficers.map((officer) => (
                  <TableRow key={officer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{officer.name}</p>
                        <p className="text-sm text-slate-500">
                          Started {new Date(officer.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{officer.badgeNumber}</p>
                        <p className="text-sm text-slate-500">{officer.rank}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-slate-900">{officer.division}</p>
                      <p className="text-sm text-slate-500">Supervisor: {officer.supervisor}</p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <p className="text-sm text-slate-600">{officer.email}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <p className="text-sm text-slate-600">{officer.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`flex items-center space-x-1 ${getStatusColor(officer.status)}`}>
                        {getStatusIcon(officer.status)}
                        <span className="capitalize">{officer.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{officer.clearance}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {officer.specializations.map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="w-4 h-4 mr-2" />
                            Adjust Clearance
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="w-4 h-4 mr-2" />
                            View Schedule
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <UserX className="w-4 h-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredOfficers.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>No officers found matching your search criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}