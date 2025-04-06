
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Sidebar from '@/components/layout/Sidebar';
import { useAppStore, Insurance } from '@/store/store';
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

const formSchema = z.object({
  type: z.enum(['home', 'auto', 'life', 'health']),
  coverageLevel: z.enum(['basic', 'standard', 'premium']),
  paymentFrequency: z.enum(['monthly', 'annually']),
});

const PurchaseInsurance = () => {
  const { addInsurance } = useAppStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'home',
      coverageLevel: 'standard',
      paymentFrequency: 'annually',
    },
  });

  const getCoverageAmount = (type: string, level: string) => {
    const coverageLevels: Record<string, Record<string, number>> = {
      home: { basic: 100000, standard: 250000, premium: 500000 },
      auto: { basic: 30000, standard: 50000, premium: 100000 },
      life: { basic: 100000, standard: 500000, premium: 1000000 },
      health: { basic: 50000, standard: 100000, premium: 250000 },
    };
    return coverageLevels[type]?.[level] || 0;
  };

  const getPremiumAmount = (type: string, level: string, frequency: string) => {
    const annualPremiums: Record<string, Record<string, number>> = {
      home: { basic: 800, standard: 1200, premium: 2000 },
      auto: { basic: 600, standard: 800, premium: 1500 },
      life: { basic: 200, standard: 350, premium: 800 },
      health: { basic: 300, standard: 450, premium: 900 },
    };
    
    const annualAmount = annualPremiums[type]?.[level] || 0;
    return frequency === 'monthly' ? Math.round(annualAmount / 12) : annualAmount;
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (step === 1) {
      setSelectedType(values.type);
      setStep(2);
      return;
    }
    
    const today = new Date();
    const endDate = new Date();
    endDate.setFullYear(today.getFullYear() + 1);
    
    const premium = getPremiumAmount(values.type, values.coverageLevel, values.paymentFrequency);
    const coverage = getCoverageAmount(values.type, values.coverageLevel);
    
    const newInsurance: Insurance = {
      id: Date.now().toString(),
      type: values.type as Insurance['type'],
      premium: premium,
      coverage: coverage,
      startDate: today.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: 'active',
    };
    
    addInsurance(newInsurance);
    
    toast({
      title: "Insurance Purchased",
      description: `Your ${values.type} insurance has been successfully purchased.`,
    });
    
    navigate(`/insurance/${newInsurance.id}`);
  };

  const insuranceTypes = [
    { value: 'home', label: 'Home Insurance', description: 'Protect your home and belongings' },
    { value: 'auto', label: 'Auto Insurance', description: 'Coverage for your vehicles' },
    { value: 'life', label: 'Life Insurance', description: 'Financial security for your loved ones' },
    { value: 'health', label: 'Health Insurance', description: 'Medical coverage for you and your family' },
  ];
  
  const coverageLevels = [
    { value: 'basic', label: 'Basic', description: 'Essential coverage at an affordable price' },
    { value: 'standard', label: 'Standard', description: 'Comprehensive coverage for most needs' },
    { value: 'premium', label: 'Premium', description: 'Maximum protection with additional benefits' },
  ];
  
  const type = form.watch('type');
  const coverageLevel = form.watch('coverageLevel');
  const paymentFrequency = form.watch('paymentFrequency');
  
  const premium = getPremiumAmount(type, coverageLevel, paymentFrequency);
  const coverage = getCoverageAmount(type, coverageLevel);

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
                  {insuranceTypes.map((insuranceType) => (
                    <Card 
                      key={insuranceType.value} 
                      className={`cursor-pointer transition-all ${
                        type === insuranceType.value ? 'border-primary ring-1 ring-primary' : ''
                      }`}
                      onClick={() => form.setValue('type', insuranceType.value as any)}
                    >
                      <CardHeader>
                        <CardTitle>{insuranceType.label}</CardTitle>
                        <CardDescription>{insuranceType.description}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem className="space-y-0 w-full">
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex justify-end"
                                >
                                  <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value={insuranceType.value} checked={type === insuranceType.value} />
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
                                defaultValue={field.value}
                                className="space-y-3"
                              >
                                {coverageLevels.map((level) => (
                                  <FormItem key={level.value} className="flex items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value={level.value} />
                                    </FormControl>
                                    <div className="flex flex-col">
                                      <FormLabel className="font-semibold">{level.label}</FormLabel>
                                      <div className="text-sm text-muted-foreground">
                                        {level.description}
                                      </div>
                                      <div className="text-sm font-medium mt-1">
                                        Coverage: {new Intl.NumberFormat('en-US', {
                                          style: 'currency',
                                          currency: 'USD',
                                          maximumFractionDigits: 0,
                                        }).format(getCoverageAmount(type, level.value))}
                                      </div>
                                    </div>
                                  </FormItem>
                                ))}
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          currency: 'USD',
                          maximumFractionDigits: 0,
                        }).format(coverage)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm font-medium">Premium:</div>
                        <div>
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }).format(premium)}
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
