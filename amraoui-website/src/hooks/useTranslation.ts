'use client';

import { useAppSelector } from '@/hooks/redux';
import { translations, Language } from '@/lib/translations';

export function useTranslation() {
  const language = useAppSelector((state) => state.settings.language);
  
  const t = translations[language as Language] || translations.en;
  
  return { t, language: language as string };
}
