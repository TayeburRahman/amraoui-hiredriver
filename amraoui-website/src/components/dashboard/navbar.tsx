'use client';

import React, { useState, useEffect } from 'react';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setLanguage } from '@/store/slices/settingsSlice';
import { logout } from '@/store/slices/authSlice';
import { Language } from '@/lib/translations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { formatDistanceToNow } from 'date-fns';

const BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://amraoui-hiredriver-backends.vercel.app/api/v1').replace('/api/v1', '');

export function Navbar() {
  const { t, language } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data?.success) {
        const notifs = res.data.data || [];
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n: any) => !n.isRead).length);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead) {
      try {
        await api.patch(`/notifications/${notif._id}/read`);
        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
      }
    }
    if (notif.link) {
      router.push(notif.link);
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'nl', name: 'Nederlands' },
  ];

  const displayName = user?.authId?.name || user?.name || 'Customer';
  const displayEmail = user?.authId?.email || user?.email || '';
  const profileImage = user?.profile_image || user?.authId?.profile_image;
  const imageUrl = profileImage ? (profileImage.startsWith('http') ? profileImage : `${BASE}${profileImage}`) : null;
  const initials = displayName.substring(0, 2).toUpperCase();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully.');
    router.push('/login');
  };

  return (
    <header className="h-20 border-b bg-white sticky top-0 z-30 flex items-center px-4 sm:px-6 lg:px-8 justify-between">
      <div className="flex items-center gap-3 sm:gap-4">
        <SidebarTrigger className="md:hidden" />
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-bold text-brand-text">{t.dashboard.title}</h1>
          <p className="text-xs sm:text-sm text-brand-text-light font-medium hidden sm:block">{t.dashboard.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications bell */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all duration-200"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white" />
              )}
            </Button>
          } />
          <DropdownMenuContent align="end" className="w-80 rounded-2xl border-slate-100 shadow-xl p-0 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs font-semibold text-brand-blue hover:text-brand-blue-dark">
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="flex flex-col">
                  {notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-4 border-b border-slate-50 cursor-pointer transition-colors ${notif.isRead ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${notif.isRead ? 'text-slate-700 font-medium' : 'text-slate-900 font-bold'}`}>
                          {notif.title}
                        </p>
                        {!notif.isRead && <span className="h-2 w-2 rounded-full bg-brand-blue flex-shrink-0 mt-1.5" />}
                      </div>
                      <p className={`text-xs mt-1 ${notif.isRead ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        {notif.createdAt ? formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true }) : 'Just now'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm font-medium">
                  No notifications yet.
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="p-2 border-t border-slate-100 bg-slate-50">
                <button onClick={() => router.push('/dashboard/orders')} className="w-full py-2 text-xs font-bold text-slate-600 hover:text-brand-blue transition-colors">
                  View All Orders
                </button>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Language switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-xl border-slate-200 h-10 px-4 font-medium text-slate-600 hover:bg-slate-50 transition-all duration-200"
            >
              <span className="uppercase">{language}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </Button>
          } />
          <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl p-1 min-w-[120px]">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => dispatch(setLanguage(lang.code as Language))}
                className={`rounded-lg px-3 py-2 cursor-pointer font-medium ${language === lang.code ? 'bg-brand-blue-light text-brand-blue' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User avatar + menu */}
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <button className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-all duration-200 px-3 py-1.5">
              <div className="h-8 w-8 rounded-full bg-brand-blue text-white flex items-center justify-center text-sm font-black overflow-hidden flex-shrink-0">
                {imageUrl ? (
                  <img src={imageUrl} alt={displayName} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-xs font-bold text-brand-text leading-none">{displayName}</span>
                <span className="text-[10px] font-medium text-slate-400 leading-none mt-0.5 max-w-[100px] truncate">{displayEmail}</span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
            </button>
          } />
          <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 shadow-xl p-2 min-w-[180px]">
            <div className="px-3 py-2 mb-1">
              <p className="text-xs font-bold text-brand-text">{displayName}</p>
              <p className="text-[10px] font-medium text-slate-400 truncate">{displayEmail}</p>
            </div>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem 
              onClick={() => router.push('/dashboard/profile')}
              className="rounded-xl px-3 py-2 cursor-pointer font-medium text-slate-600 hover:bg-slate-50 mt-1 flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100 my-1" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-xl px-3 py-2 cursor-pointer font-medium text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
