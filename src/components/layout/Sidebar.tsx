
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/store';
import { 
  Home, 
  ShieldCheck, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  CreditCard 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAppStore();
  const isAdmin = user?.role === 'admin';

  const userNavItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      title: 'My Insurance',
      href: '/insurance',
      icon: ShieldCheck,
    },
    {
      title: 'Claims',
      href: '/claims',
      icon: FileText,
    },
    {
      title: 'Payments',
      href: '/payments',
      icon: CreditCard,
    },
  ];

  const adminNavItems = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: Home,
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <div className={cn("py-4 h-full border-r bg-card", className)}>
      <div className="px-3 py-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
            >
              <Button
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  location.pathname === item.href ? "bg-secondary" : ""
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
