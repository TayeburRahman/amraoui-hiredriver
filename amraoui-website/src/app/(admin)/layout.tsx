'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { Navbar } from '@/components/dashboard/navbar';
import { toast } from 'sonner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role !== 'ADMIN') {
        toast.error('Unauthorized access. Admin only.');
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  if (isLoading || !isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar role="ADMIN" />
      <SidebarInset>
        <Navbar />
        <main className="p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
