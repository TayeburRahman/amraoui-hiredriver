'use client';

import Image from 'next/image';
import Link from 'next/link';

export function FirstOrder() {
  return (
    <section className="relative py-16 md:py-32 overflow-hidden bg-white">
      {/* Background Vector Line */}
      <div className="absolute top-[15%] left-0 w-full pointer-events-none z-0">
        <div className="relative w-full h-[80px] ">
          <Image 
            src="/assets/landing/order-vector.svg" 
            alt="Decoration" 
            fill
            className="object-contain object-left"
          />
        </div>
      </div>

      <div className="section-container relative z-10">
        <div className="bg-gradient rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 shadow-2xl shadow-blue-900/20 overflow-hidden relative">
          
          {/* Content Column */}
          <div className="flex-1 text-center lg:text-left z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Place your first order
            </h2>
            <p className="text-blue-100/80 text-lg md:text-xl mb-12 max-w-xl leading-relaxed">
              Move one or multiple vehicles with trusted drivers, transparent tracking, and fast delivery coordination.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                href="#" 
                className="bg-white text-brand-blue px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-all text-center shadow-lg"
              >
                Discover the solutions
              </Link>
              <Link 
                href="#" 
                className="border-gradient px-8 py-4 rounded-full font-bold text-white transition-all text-center"
              >
                Contact Sales
              </Link>
            </div>
          </div>

          {/* Image Column */}
          <div className="flex-1 relative w-full h-[300px] md:h-[450px] z-10">
            <Image 
              src="/assets/landing/order.svg" 
              alt="Hiflow Order Illustration" 
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
