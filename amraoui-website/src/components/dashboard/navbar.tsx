'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/hooks/redux';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex items-center px-4 justify-between">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger />
        <div className="hidden md:flex relative max-w-md w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 bg-muted/50 border-none focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full border-2 border-background" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <div className="h-8 w-[1px] bg-border mx-2" />

        <div className="flex items-center gap-2 px-2">
          <span className="text-sm font-medium hidden sm:inline-block">
            {user?.role === 'ADMIN' ? 'Administrator' : 'User'}
          </span>
        </div>
      </div>
    </header>
  );
}
