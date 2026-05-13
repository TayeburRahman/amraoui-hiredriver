'use client';

import { Key, Truck, Laptop, Headset, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const features = [
  {
    icon: <Key className="size-5 text-brand-blue" />,
    title: 'Choose your delivery options',
    description: 'Discover flexible delivery services tailored to your business.',
    linkText: 'Find out more',
    href: '#',
  },
  {
    icon: <Truck className="size-5 text-brand-blue" />,
    title: 'Track your vehicle in real time',
    description: 'Follow every step from pickup to delivery with live status updates.',
    linkText: 'Track delivery',
    href: '#',
  },
  {
    icon: <Laptop className="size-5 text-brand-blue" />,
    title: 'A tailor-made digital platform',
    description: 'Manage your operations with a platform customized to your workflow.',
    linkText: 'Explore platform',
    href: '#',
  },
  {
    icon: <Headset className="size-5 text-brand-blue" />,
    title: 'Available equipment',
    description: 'Our support team and operational tools are always ready for your needs.',
    linkText: 'Why choose Hiflow?',
    href: '#',
  },
];

export function WhyChoose() {
  return (
    <section className="relative pt-16 pb-24 md:pt-24 md:pb-50 overflow-hidden bg-white">
      {/* Background Blob Shape */}
      <div
        className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[1120px] h-[700px] bg-gradient z-0"
        style={{
         borderRadius: "50% 50% 30% 70% / 70% 70% 30% 30%"
        }}
      />

      {/* Dashed Vector Line */}
      <div className="absolute inset-x-0 top-[60%] -translate-y-1/2 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        <div className="relative w-full h-100 opacity-30">
          <Image
            src="/assets/landing/Vector.svg"
            alt="Dashed line decoration"
            fill
            className="object-cover w-full"
          />
        </div>
      </div>

      <div className="section-container relative z-10">
        <h2 className="text-3xl md:text-5xl font-extrabold text-brand-text text-center mb-12 md:mb-32 tracking-tight">
          Why choose Hiflow?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-3xl hover:shadow-2xl transition-all duration-500 group border"
            >
              <div className="size-12 rounded-xl bg-brand-blue/5 flex items-center justify-center mb-4 border border-brand-blue/10 group-hover:bg-brand-blue/10 transition-colors">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-brand-text mb-2">
                {feature.title}
              </h3>

              <p className="text-slate-500 text-base mb-6 leading-relaxed">
                {feature.description}
              </p>

              <Link
                href={feature.href}
                className="inline-flex items-center gap-1 text-brand-blue font-bold hover:gap-3 transition-all"
              >
                {feature.linkText} <ChevronRight className="size-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
