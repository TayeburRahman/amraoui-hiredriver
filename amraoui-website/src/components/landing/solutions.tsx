'use client';

import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

export function Solutions({ id }: { id?: string }) {
  const { t } = useTranslation();

  const stats = [
    { label: t.landing.solutions.stats.drivers, value: '10k+' },
    { label: t.landing.solutions.stats.response, value: '48h' },
    { label: t.landing.solutions.stats.support, value: '24/7' },
  ];

  return (
    <section id={id} className="bg-gradient py-8 md:py-22">
      <div className="section-container">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-300/60 mb-4 block">
              {t.landing.solutions.badge}
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              {t.landing.solutions.title} <br />
              {t.landing.solutions.titleLine2}
            </h2>
          </div>
          <div className="lg:max-w-md">
            <p className="text-blue-100/70 text-lg leading-relaxed">
              {t.landing.solutions.description}
            </p>
          </div>
        </div>

        {/* Main Card Section */}
        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-2xl overflow-hidden border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Card Content */}
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl md:text-3xl font-bold text-brand-text mb-4">
                {t.landing.solutions.cardTitle}
              </h3>
              <p className="text-slate-500 text-base md:text-lg mb-8 max-w-md leading-relaxed">
                {t.landing.solutions.cardDesc}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 md:gap-8 border-t border-slate-100 pt-10">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl md:text-4xl font-black text-brand-blue mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-slate-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card Image */}
            <div className="order-1 lg:order-2 relative group">
              <div className="relative h-[250px] md:h-[320px] w-full rounded-[2rem] overflow-hidden shadow-xl">
                <Image
                  src="/assets/landing/solution.jpg" 
                  alt="Professional driver"
                  fill
                  className="object-cover"
                />
                
                {/* Badge on Image */}
                <div className="absolute top-6 right-6 bg-[#A5F3E4] text-[#065F46] px-5 py-2 rounded-md font-bold text-sm shadow-sm backdrop-blur-sm border border-white/20">
                  {t.landing.solutions.verifiedBadge}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
