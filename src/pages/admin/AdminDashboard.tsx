import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Sidebar from '@/components/layout/Sidebar';
import { useAppStore } from '@/store/store';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, FileText, Calendar } from 'lucide-react';
import { useGetAllUsers } from '@/hooks/useUser';
import PageTitle from '@/components/ui/PageTitle';
import DataTable from '@/components/ui/DataTable';
import { useNavigate } from 'react-router-dom';
import { ClaimStatus, PolicyStatus } from '@/store/interface';

const AdminDashboard = () => {
  const { user, policies, claims } = useAppStore();
  const { users, isLoading, error } = useGetAllUsers();
  const navigate = useNavigate();

  const activeInsurancesCount = policies.filter(
    insurance => insurance.status === PolicyStatus.ACTIVE
  ).length;

  const pendingClaimsCount = claims.filter(
    claim => claim.status === ClaimStatus.SUBMITTED
  ).length;

  let usersCount = 0;
  let recentUsers = '';

  if (users) {
    console.log(users)
    usersCount = users.length;
    recentUsers = users
      .slice(0, 5)
      .map((user) => `${user.firstName} ${user.lastName}`)
      .join(', ');
  }

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: (user: any) => `${user.firstName} ${user.lastName}`,
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: (user: any) => (
        <span className="capitalize">{user.role}</span>
      ),
    },
  ];

  return (
    <Layout requireAuth adminOnly>
      <div className="flex h-full">
        <Sidebar className="w-64 hidden md:block" />
        <div className="flex-1 p-6">
          <PageTitle
            title={`Welcome, ${user?.firstName || 'Admin'}!`}
            description="Manage all aspects of the insurance system"
          />
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usersCount}</div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs"
                  onClick={() => navigate('/admin/users')}
                >
                  View All Users
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Active Policies
                </CardTitle>
                <Shield className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeInsurancesCount}</div>
                <p className="text-xs text-muted-foreground">
                  {activeInsurancesCount === 0 
                    ? 'No active policies' 
                    : `Across ${usersCount} users`}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Pending Claims
                </CardTitle>
                <FileText className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingClaimsCount}</div>
                <p className="text-xs text-muted-foreground">
                  {pendingClaimsCount === 0 
                    ? 'No pending claims' 
                    : 'Need review'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Today's Date
                </CardTitle>
                <Calendar className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Date().toLocaleDateString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>
                  Recently registered users in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div>Loading...</div>
                ) : error ? (
                  <div>Error fetching users: {error.message}</div>
                ) : (
                  <DataTable 
                    data={users} 
                    columns={columns}
                    onRowClick={(user) => navigate(`/admin/users/${user.id}`)}
                  />
                )}
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" onClick={() => navigate('/admin/users')}>
                    View All Users
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;