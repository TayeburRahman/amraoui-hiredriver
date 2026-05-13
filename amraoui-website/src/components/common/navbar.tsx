'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Car, Globe, ChevronDown, Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { logout } from '@/store/slices/authSlice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navLinks = [
  { href: '/professionals', label: 'Professionals' },
  { href: '/become-driver', label: 'Become a driver' },
  { href: '/who-are-we', label: 'Who are we?' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient pt-4">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-center">
          <div className="flex w-full items-center justify-between rounded-full bg-background/80 backdrop-blur-md px-6 py-2 shadow-xl border border-white/20">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-full button-gradient">
                <Car className="size-5 text-white" />
              </div>
              <span className="text-xl font-bold text-brand-text">Hiflow</span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-brand-blue/10 text-brand-blue'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-brand-blue'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-slate-500 hover:text-brand-blue font-semibold"
              >
                <Globe className="size-4" />
                <span>EN</span>
                <ChevronDown className="size-3" />
              </Button>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-slate-50 overflow-hidden p-0">
                      <Avatar className="h-full w-full">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-brand-blue text-white">{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl border-slate-100 shadow-2xl p-2">
                    <DropdownMenuItem onClick={() => router.push(user?.role === 'ADMIN' ? '/admin' : '/dashboard')} className="rounded-xl p-3 cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/dashboard/profile')} className="rounded-xl p-3 cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive rounded-xl p-3 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/register">
                  <Button className="button-gradient font-bold text-white px-8 rounded-full h-11">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-6 text-brand-text" /> : <Menu className="size-6 text-brand-text" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mx-4 mt-2 rounded-3xl border bg-background/95 backdrop-blur-xl p-6 shadow-2xl md:hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-xl px-4 py-3 text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-blue/10 text-brand-blue'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
            <Button variant="ghost" size="lg" className="w-full justify-start gap-3 rounded-xl font-semibold text-slate-600">
              <Globe className="size-5" />
              <span>English</span>
              <ChevronDown className="size-4 ml-auto" />
            </Button>

            {!isAuthenticated && (
              <Link href="/register" className="block w-full">
                <Button className="w-full button-gradient text-white rounded-xl h-12 font-bold text-lg shadow-lg" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
