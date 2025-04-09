
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Sidebar from '@/components/layout/Sidebar';
import { useAppStore } from '@/store/store';
import PageTitle from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PolicyStatus } from '@/store/interface';
import { useInsurance } from '@/hooks/useInsurance';

const Insurance = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateInsurance } = useAppStore();
  const { toast } = useToast();
  
  const { GetInsurance } = useInsurance();
  const { data: insurance, isLoading, isError, error } = GetInsurance(id || '');
  
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  const insuranceClaims = [];
  //claims.filter(claim => claim.insuranceId === id);
  
  if (!insurance) {
    return (
      <Layout requireAuth>
        <div className="flex h-full">
          <Sidebar className="w-64 hidden md:block" />
          <div className="flex-1 p-6">
            <Button variant="ghost" onClick={() => navigate('/insurance')} className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Insurance List
            </Button>
            
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <h2 className="text-2xl font-bold mb-2">Insurance Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The insurance policy you're looking for doesn't exist.
              </p>
              <Button onClick={() => navigate('/insurance')}>
                View All Insurance Policies
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }else{console.log(insurance)}

  const handleRenew = () => {
    const today = new Date();
    const currentEndDate = new Date(insurance.endDate);
    const newEndDate = new Date(currentEndDate);
    newEndDate.setFullYear(newEndDate.getFullYear() + 1);
    
    updateInsurance(insurance.id, {
      endDate: newEndDate.toISOString().split('T')[0],
      startDate: today.toISOString().split('T')[0],
      status: PolicyStatus.ACTIVE,
    });
    
    toast({
      title: "Insurance Renewed",
      description: `Your ${insurance.type} insurance has been renewed for another year.`,
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const insuranceTypes = {
    home: 'Home',
    auto: 'Auto',
    life: 'Life',
    health: 'Health',
  };
  
  const statusColors = {
    active: 'text-green-500',
    expired: 'text-red-500',
    pending: 'text-yellow-500',
  };

  return (
    <Layout requireAuth>
      <div className="flex h-full">
        <Sidebar className="w-64 hidden md:block" />
        <div className="flex-1 p-6">
          <Button variant="ghost" onClick={() => navigate('/insurance')} className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Insurance List
          </Button>
          
          <PageTitle title={`${insurance.insuranceProduct.name} Details`}>
            {insurance.status !== PolicyStatus.ACTIVE && (
              <Button onClick={handleRenew} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Renew Policy
              </Button>
            )}
          </PageTitle>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Policy Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Type:</div>
                  <div>{insuranceTypes[insurance.type]}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Premium:</div>
                  <div>{formatCurrency(insurance.premium)}/year</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Coverage Amount:</div>
                  <div>{formatCurrency(insurance.coverageLimit)}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Start Date:</div>
                  <div>{new Date(insurance.startDate).toLocaleDateString()}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">End Date:</div>
                  <div>{new Date(insurance.endDate).toLocaleDateString()}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Status:</div>
                  <div className={statusColors[insurance.status]}>
                    {insurance.status.charAt(0).toUpperCase() + insurance.status.slice(1)}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Claims History</CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigate(`/claims/new/${insurance.id}`)}>
                  File a Claim
                </Button>
              </CardHeader>
              <CardContent>
                {insuranceClaims.length > 0 ? (
                  <div className="space-y-4">
                    {insuranceClaims.map((claim) => (
                      <div key={claim.id} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <p className="font-medium">{claim.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(claim.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <div className="font-medium">{formatCurrency(claim.amount)}</div>
                          <div className={`text-sm text-${
                            claim.status === 'approved' ? 'green' : 
                            claim.status === 'rejected' ? 'red' : 
                            'yellow'
                          }-500`}>
                            {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No claims filed for this policy</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Insurance;
