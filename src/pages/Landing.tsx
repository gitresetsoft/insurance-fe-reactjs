import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/store';
import zurinceLogo from '@/assets/_index';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppStore();
  
  const features = [
    {
      title: 'Multiple Coverage Options',
      description: 'Choose from home, auto, life, and health insurance plans.',
    },
    {
      title: 'Easy Claims Process',
      description: 'File and track claims with our simple digital process.',
    },
    {
      title: 'Policy Management',
      description: 'Manage all your policies in one convenient place.',
    },
    {
      title: 'Quick Quotes',
      description: 'Get instant quotes and customize your coverage.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="container px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src={zurinceLogo} alt="Zurince Logo" className="h-8 w-auto text-primary mr-2"/>
            <span className="text-xl font-bold">Zurince</span>
          </div>
          <div>
            {isAuthenticated ? (
              <Button onClick={() => navigate(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="container px-4 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Insurance Made <span className="text-primary">Simple</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Protect what matters most with our comprehensive insurance solutions.
              Easily manage your policies and claims online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={() => isAuthenticated ? navigate('/dashboard') : navigate('/register')} className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="w-full h-80 bg-muted rounded-lg shadow-lg p-8">
              <div className="h-full w-full flex items-center justify-center">
                <img src={zurinceLogo} alt="Zurince Logo" className="h-32 w-auto text-primary opacity-30"/>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Zurince</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We make managing your insurance easy and hassle-free with a suite of powerful features.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-card rounded-lg p-6 shadow-sm">
              <div className="p-2 bg-primary/10 rounded-full w-fit mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Button size="lg" onClick={() => navigate('/register')}>
            Get Protected Today
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-card border-t">
        <div className="container px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
              <img src={zurinceLogo} alt="Zurince Logo" className="h-8 w-auto text-primary mr-2"/>
                <span className="text-lg font-bold">Zurince</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Protecting what matters most with reliable insurance solutions.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-4">Products</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground">Home Insurance</li>
                <li className="text-muted-foreground">Auto Insurance</li>
                <li className="text-muted-foreground">Life Insurance</li>
                <li className="text-muted-foreground">Health Insurance</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground">About Us</li>
                <li className="text-muted-foreground">Contact</li>
                <li className="text-muted-foreground">Careers</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground">Privacy Policy</li>
                <li className="text-muted-foreground">Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Zurince. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
