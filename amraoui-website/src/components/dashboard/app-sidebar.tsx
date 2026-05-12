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
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  Settings,
  User,
  BarChart3,
  LogOut,
  ChevronRight,
  Bell,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { logout } from '@/store/slices/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const userMenuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { title: 'Profile', icon: User, href: '/dashboard/profile' },
  { title: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

const adminMenuItems = [
  { title: 'Admin Home', icon: LayoutDashboard, href: '/admin' },
  { title: 'User Management', icon: Users, href: '/admin/users' },
  { title: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
];

export function AppSidebar({ role }: { role?: string }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const menuItems = role === 'ADMIN' ? adminMenuItems : userMenuItems;

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl px-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground">A</div>
          <span>Amraoui</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    }
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link href="/help">
                      <HelpCircle className="h-4 w-4" />
                      <span>Help Center</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link href="/notifications">
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium truncate">{user?.name}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => dispatch(logout())}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
