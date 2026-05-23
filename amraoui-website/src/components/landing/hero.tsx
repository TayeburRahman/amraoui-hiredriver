'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative md:h-228 h-170 flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/landing/hero-bg.png')" }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-[#a4c8ea] via-[#a4c8ea]/60 to-transparent" />
      </div>

      <div className="section-container relative z-10 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm mb-8 md:mb-12 animate-in fade-in slide-in-from-left-4 duration-1000">
            <span className="h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-brand-blue animate-pulse" />
            <span className="text-xs md:text-sm font-bold text-slate-600">{t.landing.hero.badge}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-brand-text mb-6 md:mb-8 leading-tight animate-in fade-in slide-in-from-left-6 duration-1000">
            {t.landing.hero.title} <br />
            <span className="text-gradient">{t.landing.hero.titleGradient}</span>
          </h1>

          {/* Description */}
          <p className="text-sm md:text-lg text-slate-600 font-medium mb-8 md:mb-12 max-w-xl leading-relaxed animate-in fade-in slide-in-from-left-8 duration-1000">
            {t.landing.hero.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <Link href="/register">
              <Button size="lg" className="h-12 md:h-14 px-6 md:px-10 button-gradient text-white font-bold rounded-xl md:rounded-2xl shadow-xl shadow-blue-100 border-none text-sm md:text-base">
                {t.landing.hero.customerBtn}
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="ghost" className="h-12 md:h-14 px-6 md:px-10 rounded-xl md:rounded-2xl border-gradient bg-transparent text-brand-text font-bold hover:shadow-lg transition-all duration-300 text-sm md:text-base">
                {t.landing.hero.driverBtn}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
