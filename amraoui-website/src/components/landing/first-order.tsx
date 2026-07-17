'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export function FirstOrder({ id }: { id?: string }) {
  const { t } = useTranslation();

  return (
    <section id={id} className="relative py-16 md:py-32 overflow-hidden bg-white">
      {/* Background Vector Line */}

      <div className="section-container relative z-10">
        <div className="bg-gradient rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 shadow-2xl shadow-blue-900/20 overflow-hidden relative">

          {/* Content Column */}
          <div className="flex-1 text-center lg:text-left z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              {t.landing.firstOrder.title}
            </h2>
            <p className="text-blue-100/80 text-lg md:text-xl mb-12 max-w-xl leading-relaxed">
              {t.landing.firstOrder.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="https://play.google.com/store/games"
                className="bg-white text-brand-blue px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-all text-center shadow-lg"
              >
                {t.landing.firstOrder.discoverBtn}
              </Link>
              <Link
                href="https://play.google.com/store/games"
                className="border-gradient px-8 py-4 rounded-full font-bold text-white transition-all text-center"
              >
                {t.landing.firstOrder.contactSalesBtn}
              </Link>
            </div>
          </div>

          {/* Image Column */}
          <div className="flex-1 relative w-full h-[300px] md:h-[450px] z-10">
            <Image
              src="/assets/landing/order.svg"
              alt="Vehiqqo Order Illustration"
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
