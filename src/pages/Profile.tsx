
import React from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRound, Mail, Phone, MapPin, CreditCard, Shield } from 'lucide-react';

const Profile = () => {
  const { user } = useAppStore();
  
  if (!user) return null;

  return (
    <Layout requireAuth>
      <div className="flex h-full">
        <Sidebar className="w-64 hidden md:block" />
        <div className="flex-1 p-6">
          <PageTitle 
            title="My Profile" 
            description="View and manage your account information"
          >
            <Button variant="outline">Edit Profile</Button>
          </PageTitle>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <div className="flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback className="text-2xl">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-center mt-4">
                  {user.firstName} {user.lastName}
                </CardTitle>
                <CardDescription className="text-center">
                  Member since {new Date().toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {user.role === 'admin' ? 'Administrator' : 'Standard User'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6 md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Your personal details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium">First Name</div>
                      <div>{user.firstName}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Last Name</div>
                      <div>{user.lastName}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div>{user.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Phone Number</div>
                    <div className="text-muted-foreground">Not provided</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Address</div>
                    <div className="text-muted-foreground">Not provided</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Settings & Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Shield className="h-4 w-4" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Methods
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Mail className="h-4 w-4" />
                      Notification Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
