'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Box,
  LogOut,
  PlusCircle,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { logout } from '@/store/slices/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from '@/hooks/useTranslation';

export function AppSidebar({ role }: { role?: string }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { t } = useTranslation();

  const userMenuItems = [
    { title: t.common.dashboard, icon: LayoutDashboard, href: '/dashboard' },
    { title: t.common.createRequest, icon: PlusCircle, href: '/dashboard/create-request' },
    { title: t.common.orders, icon: Box, href: '/dashboard/orders' },
  ];

  return (
    <Sidebar className="border-r border-slate-100 bg-white">
      <SidebarHeader className="p-6">
        <Link href="/" className="flex items-center justify-start py-2">
          <Image src="/assets/logo.png" alt="Logo" width={140} height={40} style={{ height: 'auto' }} priority />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {userMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={
                      <Link href={item.href} className="flex items-center gap-4 py-3 px-3 w-full relative">
                        {pathname === item.href && (
                          <div className="absolute left-[-1px] top-1/2 -translate-y-1/2 h-1/2 w-1 bg-brand-blue rounded-r-md" />
                        )}
                        <div className={`p-2.5 rounded-[14px] transition-all duration-300 ${
                          pathname === item.href 
                            ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30' 
                            : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-brand-blue group-hover:shadow-sm'
                        }`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span className={`text-sm font-bold tracking-wide transition-all duration-300 ${
                          pathname === item.href 
                            ? 'text-brand-text' 
                            : 'text-slate-500 group-hover:text-brand-text'
                        }`}>{item.title}</span>
                      </Link>
                    }
                    isActive={pathname === item.href}
                    className={`rounded-[20px] transition-all duration-300 group mb-3 h-auto ${
                      pathname === item.href 
                        ? 'bg-white border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-900/5' 
                        : 'hover:bg-slate-50/50 border border-transparent'
                    }`}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-slate-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard/profile" className="flex items-center gap-3 px-2 py-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer w-full group">
              <Avatar className="h-10 w-10 border-2 border-brand-blue/10 group-hover:border-brand-blue/30 transition-colors">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-brand-blue text-white font-semibold">
                  {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'AM'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-bold text-brand-text truncate group-hover:text-brand-blue transition-colors">{user?.name}</span>
                <span className="text-xs text-brand-text-light truncate font-medium">{user?.email}</span>
              </div>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => dispatch(logout())}
              className="text-slate-400 hover:text-destructive hover:bg-destructive/5 rounded-lg px-2 mt-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">{t.common.logout}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
