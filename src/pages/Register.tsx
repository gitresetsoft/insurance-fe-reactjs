import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-background">
      <div className="w-full max-w-md mx-auto mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Zurince</h1>
        <p className="text-center text-muted-foreground">
          Create a new account to get started
        </p>
      </div>
      <RegisterForm />
    </div>
  );
};

export default Register;
