'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { 
  Car, 
  ClipboardCheck, 
  UserCog, 
  ChevronRight 
} from 'lucide-react';

const requestTypes = [
  {
    id: "transport_request",
    title: "Transport Request",
    description: "Move a vehicle from pickup to delivery location.",
    icon: Car,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    badge: "Most common",
    href: "/dashboard/create-request/transport"
  },
  {
    id: "technical_inspection",
    title: "Technical Inspection",
    description: "Take the car to the technical inspection station",
    icon: ClipboardCheck,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    href: "/dashboard/create-request/inspection"
  },
  {
    id: "hire_driver",
    title: "Hire a Driver",
    description: "Book one or more drivers for a specific time, location, and task.",
    icon: UserCog,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-500",
    href: "/dashboard/create-request/hire-driver"
  },
];

export default function CreateRequestPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Choose a request type
          </h1>

          <p className="mt-6 text-xl text-slate-600">
            Select the service you need today.
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
                className="group relative flex w-full items-center justify-between rounded-3xl border border-slate-200 bg-white px-8 py-8 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex items-center gap-7">
                  
                  {/* Icon */}
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${service.iconBg}`}
                  >
                    <Icon className={`h-8 w-8 ${service.iconColor}`} />
                  </div>

                  {/* Text */}
                  <div>
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
                  <div className="absolute right-8 top-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white">
                    {service.badge}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Support Link */}
        <div className="mt-10 text-center text-sm text-slate-400">
          Not sure which one to choose?{" "}
          <button
            type="button"
            className="font-semibold text-blue-600 underline underline-offset-2 hover:text-blue-700"
          >
            Contact support
          </button>
        </div>
      </div>
    </div>
  );
}
