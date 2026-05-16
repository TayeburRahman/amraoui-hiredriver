'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppDispatch } from '@/hooks/redux';
import { setLanguage } from '@/store/slices/settingsSlice';
import { Language } from '@/lib/translations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { t, language } = useTranslation();
  const dispatch = useAppDispatch();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'nl', name: 'Nederlands' },
  ];

  return (
    <header className="h-20 border-b bg-white sticky top-0 z-30 flex items-center px-4 sm:px-6 lg:px-8 justify-between">
      <div className="flex items-center gap-3 sm:gap-4">
        <SidebarTrigger className="md:hidden" />
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-bold text-brand-text">{t.dashboard.title}</h1>
          <p className="text-xs sm:text-sm text-brand-text-light font-medium hidden sm:block">{t.dashboard.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all duration-200"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-destructive rounded-full border-2 border-white" />
        </Button>

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
      </div>
    </header>
  );
}
