'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/card';
import { 
  Car, 
  ClipboardCheck, 
  UserCog, 
  ChevronRight 
} from 'lucide-react';

export default function CreateRequestPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const isRTL = language === 'ar';

  const requestTypes = [
    {
      id: "transport_request",
      title: t.createRequest.transportRequest.title,
      description: t.createRequest.transportRequest.description,
      icon: Car,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      badge: t.createRequest.transportRequest.badge,
      href: "/dashboard/create-request/transport"
    },
    {
      id: "technical_inspection",
      title: t.createRequest.technicalInspection.title,
      description: t.createRequest.technicalInspection.description,
      icon: ClipboardCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      href: "/dashboard/create-request/inspection"
    },
    {
      id: "hire_driver",
      title: t.createRequest.hireDriver.title,
      description: t.createRequest.hireDriver.description,
      icon: UserCog,
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-500",
      href: "/dashboard/create-request/hire-driver"
    },
  ];

  return (
    <div className={`min-h-screen bg-slate-50 px-6 py-10 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            {t.createRequest.title}
          </h1>

          <p className="mt-6 text-xl text-slate-600">
            {t.createRequest.subtitle}
          </p>
        </div>

        {/* Services Available Badge */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            {language === 'en' ? '3 services available' : 
             language === 'fr' ? '3 services disponibles' :
             language === 'nl' ? '3 diensten beschikbaar' :
             '٣ خدمات متاحة'}
          </div>
        </div>

        {/* Service Cards */}
        <div className="space-y-6">
          {requestTypes.map((service) => {
            const Icon = service.icon;

            return (
              <button
                key={service.id}
                type="button"
                onClick={() => router.push(service.href)}
                className="group relative flex w-full flex-col sm:flex-row items-start sm:items-center justify-between rounded-[2rem] border border-slate-200 bg-white px-6 py-8 sm:px-8 sm:py-10 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl active:scale-[0.98]"
              >
                <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 ${isRTL ? 'sm:flex-row-reverse text-right' : 'flex-row'}`}>
                  
                  {/* Icon */}
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${service.iconBg}`}
                  >
                    <Icon className={`h-8 w-8 ${service.iconColor}`} />
                  </div>

                  {/* Text */}
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {service.title}
                    </h2>

                    <p className="mt-4 text-lg text-slate-600">
                      {service.description}
                    </p>

                    <div className={`mt-5 inline-flex items-center gap-2 text-base font-semibold text-blue-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {language === 'en' ? 'Select this service' : 
                       language === 'fr' ? 'Choisir ce service' :
                       language === 'nl' ? 'Selecteer deze dienst' :
                       'اختر هذه الخدمة'}
                      <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                    </div>
                  </div>
                </div>

                {/* Badge */}
                {service.badge && (
                  <div className={`absolute -top-3 sm:top-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg ${isRTL ? 'left-6 sm:left-8' : 'right-6 sm:right-8'}`}>
                    {service.badge}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Support Link */}
        <div className="mt-10 text-center text-sm text-slate-400">
          {language === 'en' ? 'Not sure which one to choose?' : 
           language === 'fr' ? 'Pas sûr de quoi choisir ?' :
           language === 'nl' ? 'Niet zeker wat te kiezen?' :
           'لست متأكداً ماذا تختار؟'}{" "}
          <button
            type="button"
            className="font-semibold text-blue-600 underline underline-offset-2 hover:text-blue-700"
          >
            {language === 'en' ? 'Contact support' : 
             language === 'fr' ? 'Contactez le support' :
             language === 'nl' ? 'Contacteer support' :
             'اتصل بالدعم'}
          </button>
        </div>
      </div>
    </div>
  );
}
