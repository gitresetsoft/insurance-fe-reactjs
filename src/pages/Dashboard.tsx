
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Sidebar from '@/components/layout/Sidebar';
import { useAppStore, Insurance } from '@/store/store';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  FileText,
  CreditCard,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { dummyInsurances, dummyClaims } from '@/data/dummyData';
import PageTitle from '@/components/ui/PageTitle';

const Dashboard = () => {
  const { user, insurances, claims, addInsurance, addClaim } = useAppStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Add dummy data on first load if empty
  useEffect(() => {
    if (!insurances.length) {
      dummyInsurances.forEach(insurance => {
        addInsurance(insurance);
      });
    }
    
    if (!claims.length) {
      dummyClaims.forEach(claim => {
        addClaim(claim);
      });
    }
  }, [addInsurance, addClaim, insurances.length, claims.length]);
  
  const activeInsurances = insurances.filter(insurance => insurance.status === 'active');
  const pendingClaims = claims.filter(claim => claim.status === 'pending');
  
  const upcomingRenewals = insurances.filter(insurance => {
    const endDate = new Date(insurance.endDate);
    const today = new Date();
    const diffInDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays <= 30 && diffInDays > 0;
  });
  
  const totalInsuranceValue = activeInsurances.reduce(
    (total, insurance) => total + insurance.coverage, 
    0
  );
  
  const getInsuranceTypeName = (type: Insurance['type']) => {
    const names = {
      home: 'Home',
      auto: 'Auto',
      life: 'Life',
      health: 'Health'
    };
    return names[type];
  };

  return (
    <Layout requireAuth>
      <div className="flex h-full">
        <Sidebar className="w-64 hidden md:block" />
        <div className="flex-1 p-6">
          <PageTitle
            title={`Welcome, ${user?.firstName || 'User'}!`}
            description="Manage your insurance from one central dashboard"
          >
            <Button onClick={() => navigate('/insurance/purchase')} className="gap-1">
              <Plus className="h-4 w-4" />
              New Insurance
            </Button>
          </PageTitle>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Active Policies
                </CardTitle>
                <ShieldCheck className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeInsurances.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total coverage: ${totalInsuranceValue.toLocaleString()}
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
                <div className="text-2xl font-bold">{pendingClaims.length}</div>
                <p className="text-xs text-muted-foreground">
                  {pendingClaims.length === 0 
                    ? 'No pending claims' 
                    : `Latest: ${new Date(pendingClaims[0].date).toLocaleDateString()}`}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Payments Due
                </CardTitle>
                <CreditCard className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$0</div>
                <p className="text-xs text-muted-foreground">
                  No payments due at this time
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Upcoming Renewals
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingRenewals.length}</div>
                <p className="text-xs text-muted-foreground">
                  {upcomingRenewals.length === 0 
                    ? 'No upcoming renewals' 
                    : `Next renewal: ${new Date(upcomingRenewals[0].endDate).toLocaleDateString()}`}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {activeInsurances.slice(0, 3).map((insurance) => (
                <Card key={insurance.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{getInsuranceTypeName(insurance.type)} Insurance</h3>
                      <p className="text-sm text-muted-foreground">
                        Coverage: ${insurance.coverage.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        Expires: {new Date(insurance.endDate).toLocaleDateString()}
                      </div>
                      <div className="mt-1">
                        <Button variant="outline" size="sm" onClick={() => navigate(`/insurance/${insurance.id}`)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {activeInsurances.length === 0 && (
                <p className="text-muted-foreground">No active insurances to display.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
