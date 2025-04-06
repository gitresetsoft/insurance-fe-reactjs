
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageTitleProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ 
  title, 
  description, 
  children,
  className 
}) => {
  return (
    <div className={cn("mb-6 flex justify-between items-center", className)}>
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        {description && (
          <p className="mt-2 text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};

export default PageTitle;
