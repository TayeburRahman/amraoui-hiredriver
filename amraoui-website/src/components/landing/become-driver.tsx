'use client';

import { Key } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export function BecomeDriver({ id }: { id?: string }) {
  const { t } = useTranslation();

  return (
    <section id={id} className="py-12 md:py-16 bg-gradient relative overflow-hidden">
      <div className="section-container relative z-10 text-center text-white">
        {/* Icon */}
        <div className="inline-flex items-center justify-center size-10 md:size-12 rounded-full bg-white/10 backdrop-blur-md mb-6 border border-white/20">
          <Key className="size-5 md:size-6 text-white" />
        </div>

        {/* Content */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {t.landing.becomeDriver.title}
        </h2>
        <p className="text-blue-50/80 text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          {t.landing.becomeDriver.description}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-brand-blue px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20 w-full sm:w-auto text-sm md:text-base"
          >
            {t.landing.becomeDriver.howBtn}
          </Link>
          <Link 
            href="https://play.google.com/store"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-white/30 text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-all w-full sm:w-auto text-sm md:text-base"
          >
            {t.landing.becomeDriver.signUpBtn}
          </Link>
        </div>
      </div>

      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />
    </section>
  );
}
