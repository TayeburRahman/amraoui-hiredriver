/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from "react";
import { Star, Truck } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel";



import { useTranslation } from "@/hooks/useTranslation";

export function Testimonials() {
  const { t } = useTranslation();
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    api.on("reInit", () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="py-24 bg-slate-50/50">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-brand-text mb-4">
            {t.landing.testimonials.title}
          </h2>
          <p className="text-slate-500 text-lg">
            {t.landing.testimonials.subtitle}
          </p>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full mx-auto"
        >
          <CarouselContent>
            {(t.landing.testimonials.list || []).map((testimonial: any, index: number) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4 p-4">
                <div className="bg-white p-6 rounded-[1.5rem] shadow-sm h-full flex flex-col justify-between border border-slate-100">
                  <div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="size-4 fill-orange-400 text-orange-400" />
                      ))}
                    </div>
                    <p className="text-brand-text text-base font-medium leading-relaxed mb-6 italic">
                      &quot;{testimonial.quote}&quot;
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                      <Truck className="size-5 text-brand-blue" />
                    </div>
                    <span className="font-bold text-brand-text text-base">
                      {testimonial.author}
                    </span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="flex items-center justify-center gap-6 mt-8">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {[...Array(count)].map((_, i) => (
                <button
                  key={i}
                  className={`transition-all duration-300 ${
                    current === i 
                      ? "bg-brand-blue w-6 h-2 rounded-full" 
                      : "bg-slate-200 size-2 rounded-full"
                  }`}
                  onClick={() => api?.scrollTo(i)}
                />
              ))}
            </div>

            {/* Next Button */}
            <CarouselNext className="static translate-y-0 size-10 bg-brand-blue! text-white! hover:opacity-90 transition-all shadow-lg shadow-blue-200 border-none" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
