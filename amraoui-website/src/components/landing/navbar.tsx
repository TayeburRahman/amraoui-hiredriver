'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 backdrop-blur-md border-slate-100">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-brand-blue flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm" />
            </div>
            <span className="text-xl font-bold text-brand-text">Hiflow</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <Link href="/#features" className="text-slate-500 hover:text-brand-blue transition-colors">Features</Link>
            <Link href="/#pricing" className="text-slate-500 hover:text-brand-blue transition-colors">Pricing</Link>
            <Link href="/#about" className="text-slate-500 hover:text-brand-blue transition-colors">About</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-slate-50 overflow-hidden">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-brand-blue text-white">{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-56 rounded-xl border-slate-100 shadow-xl p-1">
                <DropdownMenuItem onClick={() => router.push(user?.role === 'ADMIN' ? '/admin' : '/dashboard')} className="rounded-lg">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/profile')} className="rounded-lg">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive rounded-lg">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="font-semibold text-slate-600 hover:text-brand-blue">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-brand-blue hover:bg-brand-blue-hover text-white rounded-xl px-6 font-semibold shadow-lg shadow-blue-100">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
