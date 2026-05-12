import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronRight, Star } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-3 duration-1000">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span>New: Advanced Analytics Dashboard</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Scale Your Business <br />
          <span className="text-primary italic">Faster Than Ever</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          The all-in-one platform to manage your operations, team, and customers with beautiful UI and seamless experience.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <Link href="/register">
            <Button size="lg" className="h-12 px-8 text-base">
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#demo">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              View Demo
            </Button>
          </Link>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-7 duration-1000">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-sm font-medium text-muted-foreground">Trusted by 500+ businesses</span>
          </div>
        </div>
      </div>
    </section>
  );
}
