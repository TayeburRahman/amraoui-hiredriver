'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TechnicalInspectionPage() {
  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 lg:p-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4">
        <Link href="/dashboard/create-request" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-blue transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to selection
        </Link>
        <h1 className="text-3xl md:text-4xl font-black text-brand-text">Technical Inspection</h1>
        <p className="text-slate-500 font-medium">Book a technical inspection for your vehicle.</p>
      </div>

      <Card className="p-12 rounded-[2rem] border-none shadow-sm bg-white flex flex-col items-center justify-center text-center space-y-6">
        <div className="h-24 w-24 rounded-3xl bg-emerald-50 flex items-center justify-center">
          <ClipboardCheck className="h-12 w-12 text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Coming Soon</h2>
          <p className="text-slate-500 max-w-md">We are currently perfecting the Technical Inspection workflow. This service will be available shortly.</p>
        </div>
        <Link href="/dashboard/create-request">
          <Button className="h-12 px-8 rounded-2xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold">
            Choose another service
          </Button>
        </Link>
      </Card>
    </div>
  );
}
