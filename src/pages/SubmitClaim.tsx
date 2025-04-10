import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Sidebar from '@/components/layout/Sidebar';
import { useAppStore } from '@/store/store';
import PageTitle from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { useClaims } from '@/hooks/useClaims';
import { useInsurance } from '@/hooks/useInsurance';
import { PolicyStatus } from '@/store/interface';

const formSchema = z.object({
  policyId: z.string().min(1, { message: "Please select an insurance policy" }),
  date: z.string().min(1, { message: "Date is required" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, { message: "Amount must be a positive number" }),
});

const SubmitClaim = () => {
  const { policyId } = useParams<{ policyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createClaim } = useClaims();
  const { GetAllInsurance } = useInsurance();
  const { data: policies, isLoading: policiesLoading } = GetAllInsurance();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      policyId: policyId || '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const allData = localStorage.getItem('insurance-app-storage');
      const parsed = JSON.parse(allData || '{}');
      const userId = parsed?.state?.user?.id;
      
      if (!userId) {
        throw new Error('User ID not found');
      }

      await createClaim.mutateAsync({
        policyId: values.policyId,
        userId,
        date: values.date,
        description: values.description,
        amount: parseFloat(values.amount),
      });
      
      toast({
        title: "Claim Submitted",
        description: "Your claim has been submitted successfully and is pending review.",
      });
      
      navigate('/claims');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit claim",
        variant: "destructive",
      });
    }
  };
  
  // Filter out only active policies
  const activePolicies = policies?.filter(
    policy => policy.status === PolicyStatus.ACTIVE
  ) || [];

  if (policiesLoading) {
    return (
      <Layout requireAuth>
        <div className="flex h-full">
          <Sidebar className="w-64 hidden md:block" />
          <div className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <p>Loading policies...</p>
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
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <PageTitle 
            title="Submit a New Claim" 
            description="File a claim for your insurance policy"
          />
          
          {activePolicies.length === 0 ? (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>No Active Insurance Policies</CardTitle>
                <CardDescription>
                  You need an active insurance policy to file a claim.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/insurance/purchase')}>
                  Purchase Insurance
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Claim Details</CardTitle>
                <CardDescription>
                  Provide information about your claim
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="policyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurance Policy</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={!!policyId}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an insurance policy" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {activePolicies.map((policy) => (
                                <SelectItem key={policy.id} value={policy.id}>
                                  {policy.insuranceProduct.name} - Policy #{policy.id.slice(-8)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Incident</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what happened and the damages incurred"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Claim Amount ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={createClaim.isPending}
                    >
                      {createClaim.isPending ? 'Submitting...' : 'Submit Claim'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SubmitClaim;
