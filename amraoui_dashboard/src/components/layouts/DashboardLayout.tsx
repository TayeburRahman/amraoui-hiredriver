"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./Header";
import { getToken } from "@/lib/api";

interface AppLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: AppLayoutProps) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [authChecked, setAuthChecked] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    setAuthChecked(true);
  }, [router]);

  if (!mounted) {
    return <div className="min-h-screen bg-muted/40" />;
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="print:hidden">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      <div className="lg:pl-64 print:pl-0">
        <div className="print:hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
        </div>

        <main className="min-h-[calc(100vh-4rem)] bg-muted/40 p-4 lg:p-6 print:min-h-0 print:p-0 print:bg-transparent">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
