"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  FileText,
  MapPin,
  Car,
  Building2,
  FolderOpen,
  ClipboardCheck,
  DollarSign,
  Settings,

} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import logo from "../../app/asstes/logo.png"
import { apiFetch } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { connectSocket } from "@/lib/socket";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "overview" },
  { icon: Users, label: "Create Request", href: "/create-request" },
  { icon: FileText, label: "Quote Desk", href: "/quote-desk" },
  { icon: MapPin, label: "Mission Monitoring", href: "/mission-monitoring" },
  { icon: Car, label: "Drivers", href: "/drivers" },
  { icon: Building2, label: "Customers", href: "/customers" },
  { icon: FolderOpen, label: "Order Documents", href: "/order-documents" },
  {
    icon: ClipboardCheck,
    label: "Inspection & Reports",
    href: "/inspections-reports",
  },
  { icon: DollarSign, label: "Finance", href: "/finance" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [pendingAdminQuotes, setPendingAdminQuotes] = useState(0);

  const fetchStats = async () => {
    try {
      const res = await apiFetch<any>('/admin/dashboard/stats', { auth: true });
      if (res.data?.success) {
        setPendingAdminQuotes(res.data.data.pendingAdminQuotes || 0);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();

    const session = getSession();
    if (session) {
      const socket = connectSocket(session.id, session.role || 'ADMIN');
      socket.on('notification', () => {
        // Refetch stats on new notification
        fetchStats();
      });

      return () => {
        socket.off('notification');
      };
    }
  }, []);

  const toggleSubmenu = (title: string) => {
    setExpandedMenu(expandedMenu === title ? null : title);
  };

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-background border-r transition-transform duration-300 ease-in-out lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-6 py-4  border-b">
            <Link href="/" className="flex items-center justify-center w-full py-2">
              <Image src={logo} alt="Vehiqqo Logo" width={160} height={45} className="object-contain" style={{ height: 'auto' }} priority />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const hasSubmenu = "submenu" in item && item.submenu;
              const isExpanded = expandedMenu === item.label;

              return (
                <div key={item.label}>
                  {hasSubmenu ? (
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className={cn(
                        "w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isExpanded && "rotate-180",
                        )}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="flex-1">{item.label}</span>
                      {item.label === "Quote Desk" && pendingAdminQuotes > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {pendingAdminQuotes}
                        </span>
                      )}
                    </Link>
                  )}


                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
