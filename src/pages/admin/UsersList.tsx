
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Sidebar from '@/components/layout/Sidebar';
import PageTitle from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/DataTable';
import { dummyUsers } from '@/data/dummyData';
import { User, useAppStore } from '@/store/store';
import { fetchAllUsers, maskEmail } from '@/utils/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash, UserPlus, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UsersList = () => {
  const [regeisUsers, setReqresUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFullEmail, setShowFullEmail] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadReqresUsers = async () => {
      setIsLoading(true);
      try {
        const users = await fetchAllUsers();
        setReqresUsers(users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch filtered users from reqres.in API.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadReqresUsers();
  }, [toast]);

  // Combine dummy users and reqres users
  const allUsers = [...dummyUsers, ...regeisUsers];
  
  const userColumns = [
    {
      header: 'User',
      accessorKey: 'name',
      cell: (user: User) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-muted-foreground">
              {user.role}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: (user: User) => (
        <div className="flex items-center gap-2">
          <span>
            {showFullEmail === user.id ? user.email : maskEmail(user.email)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setShowFullEmail(showFullEmail === user.id ? null : user.id);
            }}
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="sr-only">Toggle email visibility</span>
          </Button>
        </div>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (user: User) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/users/${user.id}`);
            }}
          >
            Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="text-destructive"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash className="h-3.5 w-3.5" />
                <span className="sr-only">Delete user</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the user
                  account and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <Layout requireAuth adminOnly>
      <div className="flex h-full">
        <Sidebar className="w-64 hidden md:block" />
        <div className="flex-1 p-6">
          <PageTitle 
            title="User Management" 
            description="View, add and manage users in the system"
          >
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </PageTitle>
          
          <div className="mt-6">
            <DataTable 
              data={allUsers} 
              columns={userColumns}
              searchable
              searchKeys={['firstName', 'lastName', 'email']}
              onRowClick={(user) => navigate(`/admin/users/${user.id}`)}
            />
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">
              ReqRes.in API Integration
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Displaying users from the ReqRes.in API with first name starting with "G" 
              or last name starting with "W".
            </p>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div>
                <div className="text-sm text-muted-foreground">
                  Found {regeisUsers.length} matching users from external API.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UsersList;
