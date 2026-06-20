'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import api from '@/lib/axios';
import { AddressAutocomplete } from '@/components/ui/address-autocomplete';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeInput } from "@/components/ui/time-input";
import { ArrowLeft, Check, Calendar, Clock, MapPin, User, Phone, Mail, CarFront, Info, ClipboardCheck, RefreshCcw, Truck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TechnicalInspectionPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const isRTL = language === 'ar';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    destinationAddress: '',
    destinationCity: '',
    destinationZip: '',
    destinationDate: '',
    destinationContactName: '',
    destinationContactPhone: '',
    destinationInstructions: '',
    idCheckRequired: false,
    status: 'draft'
  });

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const inspectionTypes = [
    { id: "yearly_inspection", label: t.createRequest.inspection.yearly, icon: ClipboardCheck },
    { id: "re_inspection", label: t.createRequest.inspection.reinspection, icon: RefreshCcw },
    { id: "towbar_inspection", label: t.createRequest.inspection.towbar, icon: Truck },
    { id: "inspection_after_accident", label: t.createRequest.inspection.accident, icon: AlertTriangle },
  ];

  const selectedInspectionType = formData.inspectionType || "";

  const inputClass =
    `h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 ${isRTL ? 'text-right' : 'text-left'}`;

  const cardClass =
    "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7";

  const labelClass = `mb-3 block text-base font-extrabold text-slate-900 ${isRTL ? 'text-right' : 'text-left'}`;

  const canSubmit = true; // Button is always active to show validation errors

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    const reqMsg = language === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required';
    
    if (!formData.customerName) newErrors.customerName = reqMsg;
    if (!formData.customerPhone) newErrors.customerPhone = reqMsg;
    if (!formData.vehicleBrand) newErrors.vehicleBrand = reqMsg;
    if (!formData.licensePlate) newErrors.licensePlate = reqMsg;
    if (!formData.inspectionType) newErrors.inspectionType = language === 'ar' ? 'الرجاء تحديد نوع الفحص' : 'Please select inspection type';
    if (!formData.inspectionLocation) newErrors.inspectionLocation = reqMsg;
    if (!formData.inspectionDate) newErrors.inspectionDate = reqMsg;
    if (!formData.destinationAddress) newErrors.destinationAddress = reqMsg;
    if (!formData.destinationZip) newErrors.destinationZip = reqMsg;
    if (!formData.destinationDate) newErrors.destinationDate = reqMsg;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
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
                    className={`h-14 w-full rounded-2xl border ${errors.customerName ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-blue-100'} px-4 text-base font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${isRTL ? 'pr-12 text-right' : 'pl-12 text-left'}`}
                  />
                  {errors.customerName && <p className={`mt-1 text-sm text-red-500 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.customerName}</p>}
                </div>

                <div className="relative">
                  <Phone className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                  <input
                    type="tel"
                    value={formData.customerPhone || ""}
                    onChange={(e) => updateForm("customerPhone", e.target.value)}
                    placeholder={t.createRequest.form.phone}
                    className={`h-14 w-full rounded-2xl border ${errors.customerPhone ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-blue-100'} px-4 text-base font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${isRTL ? 'pr-12 text-right' : 'pl-12 text-left'}`}
                  />
                  {errors.customerPhone && <p className={`mt-1 text-sm text-red-500 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.customerPhone}</p>}
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
                <div>
                  <input
                    type="text"
                    value={formData.vehicleBrand || ""}
                    onChange={(e) => updateForm("vehicleBrand", e.target.value)}
                    placeholder={t.createRequest.form.make}
                    className={`h-14 w-full rounded-2xl border ${errors.vehicleBrand ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-blue-100'} px-4 text-base font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                  {errors.vehicleBrand && <p className={`mt-1 text-sm text-red-500 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.vehicleBrand}</p>}
                </div>

                <div>
                  <input
                    type="text"
                    value={formData.vehicleModel || ""}
                    onChange={(e) => updateForm("vehicleModel", e.target.value)}
                    placeholder={t.createRequest.form.model}
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={formData.licensePlate || ""}
                    onChange={(e) => updateForm("licensePlate", e.target.value)}
                    placeholder={t.createRequest.form.plate}
                    className={`h-14 w-full rounded-2xl border ${errors.licensePlate ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-blue-100'} px-4 text-base font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                  {errors.licensePlate && <p className={`mt-1 text-sm text-red-500 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.licensePlate}</p>}
                </div>

                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={formData.vinNumber || ""}
                    onChange={(e) => updateForm("vinNumber", e.target.value)}
                    placeholder={t.createRequest.form.vin}
                    className={inputClass}
                  />
                </div>
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
                        : "border-slate-100 bg-slate-50/50 text-slate-600 hover:border-brand-blue-light hover:bg-white hover:shadow-md"
                    }`}
                  >
                    <type.icon className={`h-10 w-10 transition-all duration-300 ${isSelected ? 'text-brand-blue scale-110 drop-shadow-md' : 'text-slate-400'}`} strokeWidth={isSelected ? 2.5 : 1.5} />
                    <span className="text-sm font-bold text-center leading-tight">{type.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.inspectionType && <p className={`mt-4 text-sm text-red-500 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.inspectionType}</p>}
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
                  <AddressAutocomplete
                    value={formData.inspectionLocation || ""}
                    onChange={(val) => updateForm("inspectionLocation", val)}
                    onSelect={(address) => {
                      if (errors.inspectionLocation) setErrors(prev => ({ ...prev, inspectionLocation: '' }));
                    }}
                    placeholder={t.createRequest.form.address}
                    className={`h-14 w-full rounded-2xl border ${errors.inspectionLocation ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-blue-100'} px-4 text-base font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${isRTL ? 'pr-12 text-right' : 'pl-12 text-left'}`}
                    iconClassName={isRTL ? 'right-4 left-auto' : 'left-4'}
                  />
                  {errors.inspectionLocation && <p className={`mt-1 text-sm text-red-500 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.inspectionLocation}</p>}
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
                      className={`h-14 w-full rounded-2xl border ${errors.inspectionDate ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-blue-100'} px-4 text-base font-medium text-slate-700 outline-none transition focus:bg-white focus:ring-4 ${isRTL ? 'pr-12 text-right' : 'pl-12 text-left'}`}
                    />
                    {errors.inspectionDate && <p className={`mt-1 text-sm text-red-500 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.inspectionDate}</p>}
                  </div>

                  <div className="relative">
                    <Clock className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 z-10 ${isRTL ? 'right-4' : 'left-4'}`} />
                    <TimeInput
                      value={formData.inspectionTime || ""}
                      onChange={(val) => updateForm("inspectionTime", val)}
                      className={`h-14 w-full rounded-2xl border ${errors.inspectionTime ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-blue-100'} px-4 text-base font-medium text-slate-700 outline-none transition focus:bg-white focus:ring-4 ${isRTL ? 'pr-12 text-right' : 'pl-12 text-left'}`}
                    />
                  </div>
                  {errors.inspectionTime && <p className={`mt-1 text-sm text-red-500 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.inspectionTime}</p>}
                </div>
              </div>
            </div>
          </section>

          {/* Destination Location */}
          <section>
            <div className={cardClass}>
              <div className={`flex items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-extrabold text-slate-900">{language === 'ar' ? 'معلومات الإنزال' : 'Dropoff information'}</h2>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <AddressAutocomplete
                    value={formData.destinationAddress || ""}
                    onChange={(val) => updateForm("destinationAddress", val)}
                    onSelect={(address, zip, city) => {
                      if (zip) updateForm('destinationZip', zip);
                      if (city) updateForm('destinationCity', city);
                      if (errors.destinationAddress) setErrors(prev => ({ ...prev, destinationAddress: '' }));
                    }}
                    placeholder={t.createRequest.form.address}
                    className={`h-14 w-full rounded-2xl border ${errors.destinationAddress ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-blue-100'} px-4 text-base font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${isRTL ? 'pr-12 text-right' : 'pl-12 text-left'}`}
                    iconClassName={isRTL ? 'right-4 left-auto' : 'left-4'}
                  />
                  {errors.destinationAddress && <p className={`mt-1 text-sm text-red-500 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.destinationAddress}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <input
                      type="text"
                      value={formData.destinationZip || ""}
                      onChange={(e) => updateForm("destinationZip", e.target.value)}
                      placeholder={t.createRequest.placeholders.zip}
                      className={`h-14 w-full rounded-2xl border ${errors.destinationZip ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-blue-100'} px-4 text-base font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${isRTL ? 'text-right' : 'text-left'}`}
                    />
                    {errors.destinationZip && <p className={`mt-1 text-sm text-red-500 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.destinationZip}</p>}
                  </div>

                  <div className="relative">
                    <Calendar className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                    <input
                      type="date"
                      value={formData.destinationDate || ""}
                      onChange={(e) => updateForm("destinationDate", e.target.value)}
                      className={`h-14 w-full rounded-2xl border ${errors.destinationDate ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 bg-slate-50 focus:border-blue-400 focus:ring-blue-100'} px-4 text-base font-medium text-slate-700 outline-none transition focus:bg-white focus:ring-4 ${isRTL ? 'pr-12 text-right' : 'pl-12 text-left'}`}
                    />
                    {errors.destinationDate && <p className={`mt-1 text-sm text-red-500 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.destinationDate}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="relative">
                    <User className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                    <input
                      type="text"
                      value={formData.destinationContactName || ""}
                      onChange={(e) => updateForm("destinationContactName", e.target.value)}
                      placeholder={language === 'ar' ? 'اسم جهة الاتصال' : 'Contact Name'}
                      className={`h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 ${isRTL ? 'pr-12 text-right' : 'pl-12 text-left'}`}
                    />
                  </div>

                  <div className="relative">
                    <Phone className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                    <input
                      type="tel"
                      value={formData.destinationContactPhone || ""}
                      onChange={(e) => updateForm("destinationContactPhone", e.target.value)}
                      placeholder={language === 'ar' ? 'رقم هاتف جهة الاتصال' : 'Contact Phone'}
                      className={`h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 ${isRTL ? 'pr-12 text-right' : 'pl-12 text-left'}`}
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    rows={4}
                    value={formData.destinationInstructions || ""}
                    onChange={(e) => updateForm("destinationInstructions", e.target.value)}
                    placeholder={language === 'ar' ? 'ملاحظات التسليم الخاصة (اختياري)' : 'Special delivery instructions (optional)'}
                    className={`w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 ${isRTL ? 'text-right' : 'text-left'}`}
                  />
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

          {/* Security Options */}
          <section className="mb-8">
            <div className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <h3 className="font-extrabold text-slate-900">
                  {language === 'ar' ? 'هل مطلوب التحقق من الهوية؟' : 'ID Check Required?'}
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {language === 'ar' ? 'يجب على السائق مسح هوية الشخص الذي يستلم السيارة.' : 'Driver must scan the ID of the person receiving the car.'}
                </p>
              </div>
              <div 
                onClick={() => updateForm('idCheckRequired', !formData.idCheckRequired)}
                className={`flex h-7 w-12 cursor-pointer items-center rounded-full p-1 transition-colors duration-300 ${formData.idCheckRequired ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <div className={`h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${formData.idCheckRequired ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
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
              disabled={isSubmitting}
              onClick={handleSubmit}
              className={`h-14 w-full sm:w-auto sm:px-14 rounded-2xl text-sm font-bold transition ${
                !isSubmitting
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
