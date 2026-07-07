'use client';

import { translations, Language } from '@/lib/translations';

export function useTranslation() {
  const language = 'en'; // Admin dashboard defaults to english
  const t = translations[language as Language] || translations.en;
  
  return { t, language: language as string };
}
