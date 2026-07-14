"use client";

import React, { useState, useEffect } from "react";
import { Menu, User, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearSession, getProfileImageUrl, apiFetch } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { connectSocket, disconnectSocket } from "@/lib/socket";

type TProps = {
  onMenuClick: () => void;
};

const Header = ({ onMenuClick }: TProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const [adminName, setAdminName] = useState("Admin User");
  const [adminEmail, setAdminEmail] = useState("admin@vehiqqo ");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setAdminName(session.name || "Admin User");
      setAdminEmail(session.email || "admin@vehiqqo ");
      setProfileImage(getProfileImageUrl(session.profile_image));

      const socket = connectSocket(session.id, session.role || 'ADMIN');
      socket.on('notification', () => {
        // Refetch notifications on new event
        fetchNotifications();
      });

      return () => {
        socket.off('notification');
      };
    }
  }, []);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await apiFetch<any>('/notifications', { auth: true });
      if (res.data?.success) {
        const notifs = res.data.data || [];
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n: any) => !n.isRead).length);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead) {
      try {
        await apiFetch(`/notifications/${notif._id}/read`, { method: 'PATCH', auth: true });
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
      await apiFetch('/notifications/mark-all-read', { method: 'PATCH', auth: true });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleLogout = () => {
    disconnectSocket();
    clearSession();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="relative rounded-full hover:bg-slate-100 transition-colors inline-flex items-center justify-center h-10 w-10 shrink-0"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-xl p-0 overflow-hidden shadow-lg border border-border">
            <div className="flex items-center justify-between p-4 border-b border-border bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
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
                        {!notif.isRead && <span className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />}
                      </div>
                      <p className={`text-xs mt-1 ${notif.isRead ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        {new Date(notif.createdAt).toLocaleString()}
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
          </DropdownMenuContent>
        </DropdownMenu>

        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger>
              <Avatar className="h-9 w-9 cursor-pointer border border-border hover:border-primary/50 transition-colors">
                {profileImage ? (
                  <AvatarImage src={profileImage} alt="User" />
                ) : null}
                <AvatarFallback className="bg-muted">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 z-50 shadow-lg border border-border"
              align="end"
              sideOffset={8}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <Link href="/settings" className="hover:underline">
                      <p className="text-sm font-medium leading-none">
                        {adminName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {adminEmail}
                      </p>
                    </Link>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
