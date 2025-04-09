
import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Sidebar from '@/components/layout/Sidebar';
import PageTitle from '@/components/ui/PageTitle';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/DataTable';
import { useGetAllUsers } from '@/hooks/useUser';
import { useAppStore } from '@/store/store';
import { User } from '@/store/interface';
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
  const { users, isLoading, error } = useGetAllUsers();
  const [showFullEmail, setShowFullEmail] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const userColumns = [
    {
      header: 'User',
      accessorKey: 'name',
      cell: (user: User) => (
        <div className="flex items-center gap-3">
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
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error fetching users: {error.message}</div>
            ) : (
              <DataTable 
                data={users} 
                columns={userColumns as { header: string; accessorKey: keyof User; cell?: (item: User) => ReactNode; }[]}
                searchable
                searchKeys={['firstName', 'lastName', 'email']}
                onRowClick={(user) => navigate(`/admin/users/${user.id}`)}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UsersList;