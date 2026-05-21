/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Car, Globe, ChevronDown, Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { logout } from '@/store/slices/authSlice';
import { setLanguage } from '@/store/slices/settingsSlice';
import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from '@/hooks/useTranslation';

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
];

export function Navbar() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { language } = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { href: '#solutions', label: t.common.professionals },
    { href: '#become-driver', label: t.common.becomeDriver },
    { href: '#why-choose', label: t.common.whoAreWe },
  ];

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const handleLanguageChange = (code: string) => {
    dispatch(setLanguage(code as any));
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient py-2 mx-auto">
      <nav className="section-container">
        <div className="flex h-20 items-center justify-center">
          <div className="flex w-full items-center justify-between rounded-full bg-white px-6 py-2 shadow-xl border border-white/10">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-full button-gradient">
                <Car className="size-5 text-white" />
              </div>
              <span className="text-xl font-bold text-brand-text">Hiflow</span>
            </Link>

            <div className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-brand-blue/10 text-brand-blue'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-brand-blue'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "text-muted-foreground gap-2 rounded-full border-slate-100"
                  )}
                >
                  <Globe className="size-4" />
                  <span className="uppercase">{language}</span>
                  <ChevronDown className="size-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 rounded-2xl border-slate-100 shadow-2xl p-2">
                  {languages.map((lang) => (
                    <DropdownMenuItem 
                      key={lang.code} 
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`rounded-xl p-3 cursor-pointer flex items-center justify-between ${language === lang.code ? 'bg-brand-blue/10 text-brand-blue' : ''}`}
                    >
                      <span className="font-medium">{lang.label}</span>
                      <span>{lang.flag}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger 
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "relative h-10 w-10 rounded-full border-2 border-slate-50 overflow-hidden p-0"
                    )}
                  >
                    <Avatar className="h-full w-full">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-brand-blue text-white">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
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
                    {t.common.getStarted}
                  </Button>
                </Link>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full"
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
        <div className="mx-4 mt-3 rounded-[2.5rem] border border-white/20 bg-white/95 backdrop-blur-xl p-8 shadow-2xl lg:hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`block rounded-xl px-4 py-3 text-base font-semibold transition-all border ${
                    isActive
                      ? 'bg-brand-blue/10 text-brand-blue'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="space-y-4 border-t border-slate-100 mt-4 pt-4">
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={language === lang.code ? "default" : "outline"}
                  className={`justify-start gap-3 rounded-xl font-semibold ${language === lang.code ? 'button-gradient text-white border-none' : 'text-slate-600'}`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <span>{lang.flag}</span>
                  <span className="text-xs">{lang.label}</span>
                </Button>
              ))}
            </div>

            {!isAuthenticated && (
              <Link href="/register" className="block w-full">
                <Button size={"lg"} className="w-full button-gradient rounded-full font-bold shadow-lg shadow-blue-100" onClick={() => setMobileMenuOpen(false)}>
                  {t.common.getStarted}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
