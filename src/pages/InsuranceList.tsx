
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Sidebar from '@/components/layout/Sidebar';
import { useAppStore } from '@/store/store';
import { Policies, PolicyType } from '@/store/interface';
import DataTable from '@/components/ui/DataTable';
import PageTitle from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useInsurance } from '@/hooks/useInsurance';
import { formatCurrency } from '@/utils/helper';

const InsuranceList = () => {
  const { getAllInsurance } = useInsurance();
  const { data: insurance, isLoading, isError, error } = getAllInsurance();
  const navigate = useNavigate();

  const columns: {
    header: string;
    accessorKey: keyof Policies;
    cell?: (item: Policies) => React.ReactNode;
  }[] = [
    {
      header: 'Type',
      accessorKey: 'type',
      cell: (insurance: Policies) => {
        return insurance.insuranceProduct.type;
      },
    },
    {
      header: 'Premium',
      accessorKey: 'premium',
      cell: (insurance: Policies) => formatCurrency(insurance.premium),
    },
    {
      header: 'Coverage Limit',
      accessorKey: 'coverageLimit',
      cell: (insurance: Policies) => formatCurrency(insurance.coverageLimit),
    },
    {
      header: 'Start Date',
      accessorKey: 'startDate',
      cell: (insurance: Policies) => new Date(insurance.startDate).toLocaleDateString(),
    },
    {
      header: 'End Date',
      accessorKey: 'endDate',
      cell: (insurance: Policies) => new Date(insurance.endDate).toLocaleDateString(),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (insurance: Policies) => {
        const statusStyles = {
          active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
          pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
          cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
        };

        const statusString = insurance.status.toString().toLowerCase();
        
        return (
          <Badge variant="outline" 
          className={statusStyles[statusString as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}>
            {statusString.charAt(0).toUpperCase() + statusString.slice(1)}
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
            title="My Insurance Policies" 
            description="View and manage all your insurance policies"
          >
            <Button onClick={() => navigate('/insurance/purchase')} className="gap-1">
              <Plus className="h-4 w-4" />
              New Insurance
            </Button>
          </PageTitle>
          
          <DataTable 
            data={insurance || []} 
            columns={columns} 
            searchable 
            searchKeys={['type', 'status']}
            onRowClick={(insurance) => navigate(`/insurance/${insurance.id}`)}
          />
          
          {(insurance?.length === 0 || !insurance) && (
            <div className="mt-8 text-center">
              <p className="mb-4 text-muted-foreground">
                You don't have any insurance policies yet.
              </p>
              <Button onClick={() => navigate('/insurance/purchase')}>
                Purchase Insurance
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default InsuranceList;
