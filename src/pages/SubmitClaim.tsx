
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Sidebar from '@/components/layout/Sidebar';
import { useAppStore, Claim } from '@/store/store';
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

const formSchema = z.object({
  insuranceId: z.string().min(1, { message: "Please select an insurance policy" }),
  date: z.string().min(1, { message: "Date is required" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, { message: "Amount must be a positive number" }),
});

const SubmitClaim = () => {
  const { insuranceId } = useParams<{ insuranceId: string }>();
  const { insurances, addClaim } = useAppStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      insuranceId: insuranceId || '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      amount: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newClaim: Claim = {
      id: Date.now().toString(),
      insuranceId: values.insuranceId,
      date: values.date,
      description: values.description,
      amount: parseFloat(values.amount),
      status: 'pending',
    };
    
    addClaim(newClaim);
    
    toast({
      title: "Claim Submitted",
      description: "Your claim has been submitted successfully and is pending review.",
    });
    
    navigate('/claims');
  };
  
  // Filter out only active insurances
  const activeInsurances = insurances.filter(
    insurance => insurance.status === 'active'
  );
  
  const getInsuranceLabel = (id: string) => {
    const insurance = insurances.find(ins => ins.id === id);
    if (!insurance) return '';
    
    const insuranceTypes = {
      home: 'Home',
      auto: 'Auto',
      life: 'Life',
      health: 'Health',
    };
    
    return `${insuranceTypes[insurance.type]} Insurance - $${insurance.coverage.toLocaleString()}`;
  };

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
          
          {activeInsurances.length === 0 ? (
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
                      name="insuranceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurance Policy</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={!!insuranceId}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an insurance policy" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {activeInsurances.map((insurance) => (
                                <SelectItem key={insurance.id} value={insurance.id}>
                                  {getInsuranceLabel(insurance.id)}
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
                    
                    <Button type="submit" className="w-full">
                      Submit Claim
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
