
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Sidebar from '@/components/layout/Sidebar';
import { useAppStore, Insurance } from '@/store/store';
import DataTable from '@/components/ui/DataTable';
import PageTitle from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

const InsuranceList = () => {
  const { insurances } = useAppStore();
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const columns = [
    {
      header: 'Type',
      accessorKey: 'type',
      cell: (insurance: Insurance) => {
        const insuranceTypes = {
          home: 'Home',
          auto: 'Auto',
          life: 'Life',
          health: 'Health',
        };
        return insuranceTypes[insurance.type];
      },
    },
    {
      header: 'Premium',
      accessorKey: 'premium',
      cell: (insurance: Insurance) => formatCurrency(insurance.premium),
    },
    {
      header: 'Coverage',
      accessorKey: 'coverage',
      cell: (insurance: Insurance) => formatCurrency(insurance.coverage),
    },
    {
      header: 'Start Date',
      accessorKey: 'startDate',
      cell: (insurance: Insurance) => new Date(insurance.startDate).toLocaleDateString(),
    },
    {
      header: 'End Date',
      accessorKey: 'endDate',
      cell: (insurance: Insurance) => new Date(insurance.endDate).toLocaleDateString(),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (insurance: Insurance) => {
        const statusStyles = {
          active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
          pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        };
        
        return (
          <Badge variant="outline" className={statusStyles[insurance.status]}>
            {insurance.status.charAt(0).toUpperCase() + insurance.status.slice(1)}
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
            data={insurances} 
            columns={columns} 
            searchable 
            searchKeys={['type', 'status']}
            onRowClick={(insurance) => navigate(`/insurance/${insurance.id}`)}
          />
          
          {insurances.length === 0 && (
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
