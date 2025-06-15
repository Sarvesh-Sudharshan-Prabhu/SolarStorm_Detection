import type React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <main className={`container mx-auto flex-grow px-4 py-8 ${className || ''}`}>
      {children}
    </main>
  );
}
