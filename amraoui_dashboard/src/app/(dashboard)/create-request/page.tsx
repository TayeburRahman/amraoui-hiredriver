'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { 
  Car, 
  ClipboardCheck, 
  UserCog, 
  ChevronRight 
} from 'lucide-react';

export default function CreateRequestPage() {
  const router = useRouter();

  const requestTypes = [
    {
      id: "transport_request",
      title: "Transport Request",
      description: "Move vehicles securely from one location to another.",
      icon: Car,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      badge: "Most Popular",
      href: "/create-request/transport"
    },
    {
      id: "technical_inspection",
      title: "Technical Inspection",
      description: "Request a thorough vehicle inspection before purchase or delivery.",
      icon: ClipboardCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      href: "/create-request/inspection"
    },
    {
      id: "hire_driver",
      title: "Hire a Driver",
      description: "Get a professional driver for a set period or specific trips.",
      icon: UserCog,
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-500",
      href: "/create-request/hire-driver"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Create New Mission
          </h1>
          <p className="mt-6 text-xl text-slate-600">
            Select the type of mission you want to create on behalf of a customer.
          </p>
        </div>

        {/* Services Available Badge */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            3 services available
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 flex-row">
                  
                  {/* Icon */}
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${service.iconBg}`}
                  >
                    <Icon className={`h-8 w-8 ${service.iconColor}`} />
                  </div>

                  {/* Text */}
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {service.title}
                    </h2>

                    <p className="mt-4 text-lg text-slate-600">
                      {service.description}
                    </p>

                    <div className="mt-5 inline-flex items-center gap-2 text-base font-semibold text-blue-600">
                      Select this service
                      <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>

                {/* Badge */}
                {service.badge && (
                  <div className="absolute -top-3 sm:top-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg right-6 sm:right-8">
                    {service.badge}
                  </div>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
