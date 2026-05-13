'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-[96px]">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/landing/hero-bg.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#a4c8ea]/95 via-transparent to-transparent" />
      </div>

      <div className="section-container relative z-10 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm mb-12 animate-in fade-in slide-in-from-left-4 duration-1000">
            <span className="h-2.5 w-2.5 rounded-full bg-brand-blue animate-pulse" />
            <span className="text-sm font-bold text-slate-600">Smart Logistics Solutions</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-brand-text mb-8 leading-tight animate-in fade-in slide-in-from-left-6 duration-1000">
            Delivering More <br />
            <span className="text-gradient">Than Promises</span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-slate-600 font-medium mb-12 max-w-xl leading-relaxed animate-in fade-in slide-in-from-left-8 duration-1000">
            Hiflow helps professionals move vehicles faster with trusted drivers, 
            real-time tracking, and 48-hour delivery coverage across Spain.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <Link href="/register">
              <Button size="lg" className="h-14 px-10 button-gradient text-white font-bold rounded-2xl shadow-xl shadow-blue-100 border-none">
                I'm a Customer
              </Button>
            </Link>
            <Link href="/become-driver">
              <Button size="lg" variant="ghost" className="h-14 px-10 rounded-2xl border-gradient bg-transparent text-brand-text font-bold hover:shadow-lg transition-all duration-300">
                I'm a driver
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
