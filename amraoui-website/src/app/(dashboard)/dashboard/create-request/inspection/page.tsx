'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import api from '@/lib/axios';
import { ArrowLeft, Check, Calendar, Clock, MapPin, User, Phone, Mail, CarFront, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TechnicalInspectionPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const isRTL = language === 'ar';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    vehicleBrand: '',
    vehicleModel: '',
    licensePlate: '',
    vinNumber: '',
    inspectionType: '',
    inspectionLocation: '',
    inspectionDate: '',
    inspectionTime: '',
    inspectionNotes: '',
    status: 'draft'
  });

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const inspectionTypes = [
    { id: "yearly_inspection", label: t.createRequest.inspection.yearly },
    { id: "re_inspection", label: t.createRequest.inspection.reinspection },
    { id: "towbar_inspection", label: t.createRequest.inspection.towbar },
    { id: "inspection_after_accident", label: t.createRequest.inspection.accident },
  ];

  const selectedInspectionType = formData.inspectionType || "";

  const inputClass =
    `h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 ${isRTL ? 'text-right' : 'text-left'}`;

  const cardClass =
    "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7";

  const labelClass = `mb-3 block text-base font-extrabold text-slate-900 ${isRTL ? 'text-right' : 'text-left'}`;

  const canSubmit = 
    formData.customerName && 
    formData.customerPhone && 
    formData.vehicleBrand && 
    formData.licensePlate && 
    formData.inspectionType && 
    formData.inspectionLocation && 
    formData.inspectionDate;

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        type: 'INSPECTION',
        details: formData,
      };
      
      const res = await api.post('/requests', payload);
      if (res.data?.success) {
        router.push('/dashboard/orders');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mx-auto w-full max-w-5xl">
        
        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.push('/dashboard/create-request')}
          className={`mb-8 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>

        {/* Header */}
        <div className={`mb-10 animate-in fade-in slide-in-from-top-4 duration-700 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {t.createRequest.technicalInspection.title}
          </h1>

          <p className="mt-6 text-lg font-medium text-slate-500 sm:text-xl max-w-3xl">
            {t.createRequest.technicalInspection.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          
          {/* Customer Information */}
          <section>
            <div className={cardClass}>
              <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <User className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-extrabold text-slate-900">{t.createRequest.form.customerInfo}</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="relative">
                  <User className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                  <input
                    type="text"
                    value={formData.customerName || ""}
                    onChange={(e) => updateForm("customerName", e.target.value)}
                    placeholder={t.createRequest.form.firstName + " & " + t.createRequest.form.lastName}
                    className={`h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 ${isRTL ? 'pr-12 text-right' : 'pl-12 text-left'}`}
                  />
                </div>

                <div className="relative">
                  <Phone className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                  <input
                    type="tel"
                    value={formData.customerPhone || ""}
                    onChange={(e) => updateForm("customerPhone", e.target.value)}
                    placeholder={t.createRequest.form.phone}
                    className={`h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 ${isRTL ? 'pr-12 text-right' : 'pl-12 text-left'}`}
                  />
                </div>

                <div className="relative md:col-span-2">
                  <Mail className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                  <input
                    type="email"
                    value={formData.customerEmail || ""}
                    onChange={(e) => updateForm("customerEmail", e.target.value)}
                    placeholder={t.createRequest.form.email}
                    className={`h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 ${isRTL ? 'pr-12 text-right' : 'pl-12 text-left'}`}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Vehicle Details */}
          <section>
            <div className={cardClass}>
              <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CarFront className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-extrabold text-slate-900">{t.createRequest.form.vehicleInfo}</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  type="text"
                  value={formData.vehicleBrand || ""}
                  onChange={(e) => updateForm("vehicleBrand", e.target.value)}
                  placeholder={t.createRequest.form.make}
                  className={inputClass}
                />

                <input
                  type="text"
                  value={formData.vehicleModel || ""}
                  onChange={(e) => updateForm("vehicleModel", e.target.value)}
                  placeholder={t.createRequest.form.model}
                  className={inputClass}
                />

                <input
                  type="text"
                  value={formData.licensePlate || ""}
                  onChange={(e) => updateForm("licensePlate", e.target.value)}
                  placeholder={t.createRequest.form.plate}
                  className={`md:col-span-2 ${inputClass}`}
                />

                <input
                  type="text"
                  value={formData.vinNumber || ""}
                  onChange={(e) => updateForm("vinNumber", e.target.value)}
                  placeholder={t.createRequest.form.vin}
                  className={`md:col-span-2 ${inputClass}`}
                />
              </div>
            </div>
          </section>

          {/* Inspection Type */}
          <section>
            <h2 className={labelClass}>
              {t.createRequest.inspection.type}
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
              {inspectionTypes.map((type) => {
                const isSelected = selectedInspectionType === type.id;

                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => updateForm("inspectionType", type.id)}
                    className={`flex flex-col items-center justify-center gap-4 rounded-[1.5rem] border p-6 transition-all duration-300 min-h-[140px] ${
                      isSelected
                        ? "border-brand-blue bg-brand-blue-light/30 text-brand-blue ring-4 ring-brand-blue-light/50 shadow-lg -translate-y-1"
                        : "border-slate-100 bg-white text-slate-600 hover:border-brand-blue-light hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <Check className={`h-6 w-6 transition-all duration-300 ${isSelected ? 'scale-100' : 'scale-0'}`} />
                      {!isSelected && <span className="text-xs font-bold">{inspectionTypes.indexOf(type) + 1}</span>}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-center leading-tight">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Inspection Location & Date */}
          <section>
            <div className={cardClass}>
              <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-extrabold text-slate-900">{t.createRequest.inspection.location}</h2>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <MapPin className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                  <input
                    type="text"
                    value={formData.inspectionLocation || ""}
                    onChange={(e) =>
                      updateForm("inspectionLocation", e.target.value)
                    }
                    placeholder={t.createRequest.form.address}
                    className={`h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 ${isRTL ? 'pr-12 text-right' : 'pl-12 text-left'}`}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="relative">
                    <Calendar className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                    <input
                      type="date"
                      value={formData.inspectionDate || ""}
                      onChange={(e) =>
                        updateForm("inspectionDate", e.target.value)
                      }
                      className={`h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 ${isRTL ? 'pr-12 text-right' : 'pl-12 text-left'}`}
                    />
                  </div>

                  <div className="relative">
                    <Clock className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                    <input
                      type="time"
                      value={formData.inspectionTime || ""}
                      onChange={(e) =>
                        updateForm("inspectionTime", e.target.value)
                      }
                      className={`h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 ${isRTL ? 'pr-12 text-right' : 'pl-12 text-left'}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="mb-8">
            <div className={cardClass}>
              <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Info className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-extrabold text-slate-900">{t.createRequest.steps.instructions}</h2>
              </div>

              <textarea
                rows={5}
                value={formData.inspectionNotes || ""}
                onChange={(e) => updateForm("inspectionNotes", e.target.value)}
                placeholder={t.createRequest.inspection.notes}
                className={`w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 ${isRTL ? 'text-right' : 'text-left'}`}
              />
            </div>
          </section>

          {/* Actions */}
          <div className={`flex flex-col sm:flex-row gap-4 mb-16 justify-end ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <button
              type="button"
              onClick={() => updateForm("status", "draft")}
              className="h-14 w-full sm:w-auto sm:px-10 rounded-2xl border border-slate-200 bg-white text-sm font-bold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              {t.common.saveDraft}
            </button>

            <button
              type="button"
              disabled={!canSubmit || isSubmitting}
              onClick={handleSubmit}
              className={`h-14 w-full sm:w-auto sm:px-14 rounded-2xl text-sm font-bold transition ${
                canSubmit && !isSubmitting
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 hover:opacity-90"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? 'Submitting...' : t.common.submit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
