import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useUser } from '@/hooks/useUser';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchUserByEmail } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // TODO: Implement Google OAuth2 authentication
      // For now, we're using email/password + backend validation
      const result = await fetchUserByEmail.mutateAsync({ email });
      
      if (result) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${result.firstName}!`,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "User not found",
          description: "The user with the provided email was not found.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Failed to login. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-[350px] md:w-[450px]">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button variant="link" size="sm" className="px-0 h-auto text-xs">
                Forgot password?
              </Button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(prevState => !prevState)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={fetchUserByEmail.isPending}
          >
            {fetchUserByEmail.isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Button variant="link" className="p-0" onClick={() => navigate('/register')}>
            Create an account
          </Button>
        </div>
        {/* TODO: Remove demo accounts section once Google OAuth is implemented */}
        <div className="mt-4 p-3 bg-muted rounded-md">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">Demo Accounts:</p>
            <p>User: john.doe@example.com / password</p>
            <p>Admin: admin@example.com / password</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
