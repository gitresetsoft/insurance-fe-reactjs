import React from 'react';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-background">
      <div className="w-full max-w-md mx-auto mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Zurince</h1>
        <p className="text-center text-muted-foreground">
          Sign in to manage your insurance
        </p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
