
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Sidebar from '@/components/layout/Sidebar';
import { useAppStore, Claim } from '@/store/store';
import DataTable from '@/components/ui/DataTable';
import PageTitle from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

const ClaimsList = () => {
  const { claims, insurances } = useAppStore();
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getInsuranceType = (insuranceId: string) => {
    const insurance = insurances.find(ins => ins.id === insuranceId);
    if (!insurance) return 'Unknown';
    
    const insuranceTypes = {
      home: 'Home',
      auto: 'Auto',
      life: 'Life',
      health: 'Health',
    };
    
    return insuranceTypes[insurance.type];
  };

  const columns = [
    {
      header: 'Insurance Type',
      accessorKey: 'insuranceId',
      cell: (claim: Claim) => getInsuranceType(claim.insuranceId),
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (claim: Claim) => new Date(claim.date).toLocaleDateString(),
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: (claim: Claim) => formatCurrency(claim.amount),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (claim: Claim) => {
        const statusStyles = {
          pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
          approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
        
        return (
          <Badge variant="outline" className={statusStyles[claim.status]}>
            {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
          </Badge>
        );
      },
    },
  ];

  return (
    <Layout requireAuth>
      <div className="flex h-full">
        <Sidebar className="w-64 hidden md:block" />
        <div className="flex-1 p-6">
          <PageTitle 
            title="My Claims" 
            description="View and manage all your insurance claims"
          >
            <Button onClick={() => navigate('/claims/new')} className="gap-1">
              <Plus className="h-4 w-4" />
              New Claim
            </Button>
          </PageTitle>
          
          <DataTable 
            data={claims} 
            columns={columns} 
            searchable 
            searchKeys={['description', 'status']}
            onRowClick={(claim) => navigate(`/claims/${claim.id}`)}
          />
          
          {claims.length === 0 && (
            <div className="mt-8 text-center">
              <p className="mb-4 text-muted-foreground">
                You don't have any claims yet.
              </p>
              <Button onClick={() => navigate('/claims/new')}>
                File a Claim
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ClaimsList;
