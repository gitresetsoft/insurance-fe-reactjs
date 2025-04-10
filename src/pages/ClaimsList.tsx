import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Sidebar from '@/components/layout/Sidebar';
import { useAppStore } from '@/store/store';
import DataTable from '@/components/ui/DataTable';
import PageTitle from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useClaims, Claim } from '@/hooks/useClaims';
import { useInsurance } from '@/hooks/useInsurance';
import { formatCurrency } from '@/utils/helper';

interface Column {
  header: string;
  accessorKey: keyof Claim;
  cell?: (item: Claim) => React.ReactNode;
}

const ClaimsList = () => {
  const navigate = useNavigate();
  const { GetUserClaims } = useClaims();
  const { GetAllInsurance } = useInsurance();
  
  const { data: claims, isLoading: claimsLoading, error: claimsError } = GetUserClaims();
  const { data: insurances } = GetAllInsurance();

  const getInsuranceType = (policyId: string) => {
    const insurance = insurances?.find(ins => ins.id === policyId);
    if (!insurance) return 'Unknown';
    return insurance.insuranceProduct.name;
  };

  const columns: Column[] = [
    {
      header: 'Insurance Type',
      accessorKey: 'policyId',
      cell: (claim) => getInsuranceType(claim.policyId),
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (claim) => new Date(claim.date).toLocaleDateString(),
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: (claim) => formatCurrency(claim.amount),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (claim) => {
        const statusStyles = {
          pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
          approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
        
        return (
          <Badge variant="outline" className={statusStyles[claim.status]}>
            {claim.status.toString().charAt(0).toUpperCase() + claim.status.toString().slice(1)}
          </Badge>
        );
      },
    },
  ];

  if (claimsLoading) {
    return (
      <Layout requireAuth>
        <div className="flex h-full">
          <Sidebar className="w-64 hidden md:block" />
          <div className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <p>Loading claims...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (claimsError) {
    return (
      <Layout requireAuth>
        <div className="flex h-full">
          <Sidebar className="w-64 hidden md:block" />
          <div className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">Error loading claims: {claimsError.message}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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
            data={claims || []} 
            columns={columns} 
            searchable 
            searchKeys={['description', 'status']}
            onRowClick={(claim) => navigate(`/claims/${claim.id}`)}
          />
          
          {(!claims || claims.length === 0) && (
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
