import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Sidebar from '@/components/layout/Sidebar';
import { useAppStore } from '@/store/store';
import PageTitle from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { CreateInsuranceRequest, useInsurance } from '@/hooks/useInsurance';
import { Policies, PolicyStatus, PolicyType } from '@/store/interface';

const formSchema = z.object({
  type: z.nativeEnum(PolicyType),
  coverageLevel: z.enum(['basic', 'standard', 'premium']),
  paymentFrequency: z.enum(['monthly', 'annually']),
});

const PurchaseInsurance = () => {
  const { addInsurance } = useAppStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createInsurance } = useInsurance();
  
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedInsuranceProduct, setSelectedInsuranceProduct] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: PolicyType.CAR,
      coverageLevel: 'standard',
      paymentFrequency: 'annually',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (step === 1) {
      setSelectedType(values.type);
      setStep(2);
      return;
    }

    if (!selectedInsuranceProduct) {
      toast({
        title: "Error",
        description: "No insurance product selected",
      });
      return;
    }
    
    const today = new Date();
    const endDate = new Date();
    endDate.setFullYear(today.getFullYear() + 1);

    const allData = localStorage.getItem('insurance-app-storage');
    if (!allData) {
      throw new Error('No data not found in localStorage');
    }
    
    const parsedData = JSON.parse(allData);
    let user = parsedData.state.user;

    if (!user.id) {
      throw new Error('User ID not found in localStorage');
    }
    
    //TODO cleanup data generation
    const newInsurance: CreateInsuranceRequest = {
      policyNumber: `Zurince-${new Date().getFullYear}-` + new Date().getTime(),
      status: PolicyStatus.ACTIVE,
      startDate: today,
      endDate: endDate,
      premium: 1200,
      coverageLimit: 50000,
      userId: user.id,
      insuranceProductId: selectedInsuranceProduct,
    };
    
    try {
      const createdInsuranceId = await createInsurance.mutateAsync(newInsurance);
      if (!createdInsuranceId) {
        throw new Error('Insurance ID not found in the created insurance response.');
      }

      toast({
        title: "Insurance Purchased",
        description: `Your ${values.type} insurance has been successfully purchased.`,
      });
      navigate(`/insurance/${createdInsuranceId}`);
    } catch (error) {
      toast({
        title: "Error purchasing insurance",
        description: error.message,
      });
    }
  };

  const { insuranceProducts, productsLoading, productsError } = useInsurance();
  
  if (productsLoading) return <div>Loading insurance products...</div>;
  if (productsError) return <div>Error: {productsError.message}</div>;
  
  const type = form.watch('type');
  const coverageLevel = form.watch('coverageLevel');
  const paymentFrequency = form.watch('paymentFrequency');
  
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
            title={step === 1 ? "Purchase Insurance" : `Purchase ${selectedType?.charAt(0).toUpperCase() + selectedType?.slice(1)} Insurance`}
            description={step === 1 ? "Choose the insurance type you need" : "Customize your coverage options"}
          />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {insuranceProducts.map((insuranceProducts) => (
                    <Card
                    key={insuranceProducts.type}
                    className={`cursor-pointer transition-all ${
                      type === insuranceProducts.type ? 'border-primary ring-1 ring-primary' : ''
                    }`}
                  >
                    <CardHeader>
                      <CardTitle>{insuranceProducts.name}</CardTitle>
                      <CardDescription>{insuranceProducts.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem className="space-y-0 w-full">
                            <FormControl>
                              <RadioGroup
                                value={field.value}
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setSelectedInsuranceProduct(insuranceProducts.id);
                                }}
                                className="flex justify-end"
                              >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={insuranceProducts.type}
                                      checked={type === insuranceProducts.type}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">Select</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardFooter>
                  </Card>
                  
                  ))}
                </div>
              )}
              
              {step === 2 && (
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Coverage Options</CardTitle>
                      <CardDescription>
                        Choose the level of coverage you need
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="coverageLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Coverage Level</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue='basic'
                                className="space-y-3"
                              >
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="paymentFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue='type'>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="annually">Annually (save 10%)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Summary</CardTitle>
                      <CardDescription>
                        Review your insurance details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Insurance Type:</div>
                        <div>{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Coverage Level:</div>
                        <div>{coverageLevel.charAt(0).toUpperCase() + coverageLevel.slice(1)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Coverage Amount:</div>
                        <div>{new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'MYR',
                          maximumFractionDigits: 0,
                        }).format(600)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Premium:</div>
                        <div>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'MYR',
                          }).format(800)}
                          {paymentFrequency === 'monthly' ? '/month' : '/year'}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Coverage Period:</div>
                        <div>1 year</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="text-sm text-muted-foreground">
                        By purchasing this insurance, you agree to our terms and conditions.
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              )}
              
              <div className="flex justify-between">
                {step === 2 && (
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                )}
                <Button type="submit" className="ml-auto">
                  {step === 1 ? 'Continue' : 'Purchase Insurance'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default PurchaseInsurance;
