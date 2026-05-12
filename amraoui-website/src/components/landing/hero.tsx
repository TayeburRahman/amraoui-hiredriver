import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight, Star } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue-light border-none text-sm font-bold text-brand-blue mb-8 animate-in fade-in slide-in-from-bottom-3 duration-1000 shadow-sm shadow-blue-50">
          <span className="flex h-2 w-2 rounded-full bg-brand-blue animate-pulse" />
          <span>New: Advanced Logistics Tracking</span>
          <ChevronRight className="h-4 w-4 opacity-50" />
        </div>

        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-brand-text mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Seamless Vehicle <br />
          <span className="text-brand-blue">Logistics Solutions</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium mb-12 animate-in fade-in slide-in-from-bottom-5 duration-1000 leading-relaxed">
          The ultimate platform for vehicle transport management. Track, manage, and optimize your fleet movements with precision.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <Link href="/register">
            <Button size="lg" className="h-14 px-10 text-md font-bold bg-brand-blue hover:bg-brand-blue-hover text-white rounded-2xl shadow-xl shadow-blue-100 transition-all duration-300">
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#demo">
            <Button size="lg" variant="outline" className="h-14 px-10 text-md font-bold border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all duration-300">
              View Case Study
            </Button>
          </Link>
        </div>

        <div className="mt-20 flex flex-col items-center gap-5 animate-in fade-in slide-in-from-bottom-7 duration-1000">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-400">Trusted by 1,200+ Logistics Partners</span>
          </div>
        </div>
      </div>
    </section>
  );
}
