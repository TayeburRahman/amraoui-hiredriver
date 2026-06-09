'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { initializeAuth } from '@/store/slices/authSlice';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { Navbar } from '@/components/dashboard/navbar';
import { Car } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  // Rehydrate auth from localStorage on mount
  useEffect(() => {
    dispatch(initializeAuth());
    setIsHydrated(true);
  }, [dispatch]);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Ensure only CUSTOMERS can access the website dashboard
    const role = user?.authId?.role || user?.role;
    if (role && role !== 'CUSTOMERS') {
      router.push('/login');
    }
  }, [isAuthenticated, user, isHydrated, router]);

  // Show loading spinner while hydrating
  if (!isHydrated || isLoading || !isAuthenticated) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-brand-bg">
        <div className="h-16 w-16 rounded-2xl bg-brand-blue flex items-center justify-center shadow-xl shadow-blue-200 mb-6 animate-pulse">
          <Car className="h-8 w-8 text-white" />
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-blue" />
        <p className="mt-4 text-sm font-medium text-slate-400">Loading your dashboard...</p>
      </div>
    );
  }

  // Access denied for non-customers
  const role = user?.authId?.role || user?.role;
  if (role && role !== 'CUSTOMERS') {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={user?.role} />
      <SidebarInset className="bg-brand-bg overflow-hidden flex flex-col">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 w-full">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
