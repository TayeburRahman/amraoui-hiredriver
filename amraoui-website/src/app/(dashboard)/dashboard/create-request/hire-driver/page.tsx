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
import {
  ArrowLeft,
  Users,
  Minus,
  Plus,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
} from "lucide-react";

const driverQuickOptions = [1, 2, 3, 4];

const timeOptions = Array.from({ length: 48 }).map((_, i) => {
  const hours = Math.floor(i / 2).toString().padStart(2, '0');
  const minutes = (i % 2 === 0) ? '00' : '30';
  return `${hours}:${minutes}`;
});

const driverTasks = [
  { id: "vehicle_pickup", label: "Vehicle pickup", icon: "🚗" },
  { id: "vehicle_delivery", label: "Vehicle delivery", icon: "📦" },
  { id: "move_inside_lot", label: "Move vehicles inside lot", icon: "🔄" },
  { id: "test_drive", label: "Test drive", icon: "🏁" },
  { id: "wait_handover", label: "Wait during handover", icon: "⏱️" },
  { id: "refuel_vehicle", label: "Refuel vehicle", icon: "⛽" },
  { id: "charge_ev", label: "Charge EV vehicle", icon: "🔌" },
  { id: "complete_paperwork", label: "Complete paperwork", icon: "📄" },
  { id: "photos_inspection", label: "Take photos / inspection", icon: "📸" },
  { id: "customer_handover", label: "Customer handover", icon: "🤝" },
  { id: "other", label: "Other", icon: "✏️" },
];

const specialRequirements = [
  { id: "experienced_driver", label: "Experienced driver only" },
  { id: "ev_handling", label: "EV handling required" },
  { id: "premium_vehicle", label: "Premium vehicle handling" },
  { id: "long_distance", label: "Long-distance driving" },
  { id: "formal_dress", label: "Formal dress required" },
  { id: "customer_facing", label: "Customer-facing driver" },
  { id: "manual_transmission", label: "Manual transmission" },
  { id: "automatic_transmission", label: "Automatic transmission" },
];

export default function HireDriverPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const isRTL = language === 'ar';

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    driverCount: 1,
    driverTasks: [] as string[],
    driverRequirements: [] as string[],
    driverStartDate: '',
    driverStartTime: '',
    driverEndDate: '',
    driverEndTime: '',
    driverLocation: '',
    driverCity: '',
    driverPostalCode: '',
    driverLocationNote: '',
    driverTaskNotes: '',
    idCheckRequired: false,
    status: 'draft'
  });

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const driverCount = formData.driverCount || 1;
  const selectedTasks = formData.driverTasks || [];
  const selectedRequirements = formData.driverRequirements || [];

  const toggleArrayValue = (field: string, value: string) => {
    const currentValues = (formData as any)[field] || [];

    if (currentValues.includes(value)) {
      updateForm(
        field,
        currentValues.filter((item: string) => item !== value)
      );
    } else {
      updateForm(field, [...currentValues, value]);
    }
  };

  const increaseDrivers = () => {
    updateForm("driverCount", Math.min(driverCount + 1, 20));
  };

  const decreaseDrivers = () => {
    updateForm("driverCount", Math.max(driverCount - 1, 1));
  };

  const canContinue =
    formData.customerName &&
    formData.customerPhone &&
    driverCount >= 1 &&
    formData.driverStartDate &&
    formData.driverStartTime &&
    formData.driverEndDate &&
    formData.driverEndTime &&
    formData.driverLocation &&
    selectedTasks.length > 0;

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    const reqMsg = language === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required';

    if (!formData.customerName) newErrors.customerName = reqMsg;
    if (!formData.customerPhone) newErrors.customerPhone = reqMsg;
    if (!formData.driverStartDate) newErrors.driverStartDate = reqMsg;
    if (!formData.driverStartTime) newErrors.driverStartTime = reqMsg;
    if (!formData.driverEndDate) newErrors.driverEndDate = reqMsg;
    if (!formData.driverEndTime) newErrors.driverEndTime = reqMsg;
    if (!formData.driverLocation) newErrors.driverLocation = reqMsg;
    if (selectedTasks.length === 0) newErrors.driverTasks = language === 'ar' ? 'الرجاء تحديد مهمة واحدة على الأقل' : 'Please select at least one task';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Optional: scroll to first error or just let user see them
      return;
    }

    setErrors({});
    try {
      setIsSubmitting(true);
      const payload = {
        type: 'HIRE_DRIVER',
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

        {/* Back */}
        <button
          type="button"
          onClick={() => router.push('/dashboard/create-request')}
          className={`mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition hover:text-blue-600 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
          {t.common.backToSelection}
        </button>

        {/* Header */}
        <div className={`mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {t.createRequest.hireDriver.title}
            </h1>

            <p className="mt-3 max-w-2xl text-base font-medium text-slate-500 sm:text-lg">
              {t.createRequest.hireDriver.description}
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-bold text-white shadow-sm">
            <Users className="h-4 w-4" />
            {language === 'ar' ? 'نوع الخدمة: استئجار سائق' : `Service Type: ${t.createRequest.hireDriver.title}`}
          </div>
        </div>

        {/* Customer Information */}
        <section className="mb-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className={`flex items-center gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <User className="h-5 w-5 text-blue-600" />
              <h2 className={`text-xl font-extrabold text-slate-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t.createRequest.form.customerInfo}
              </h2>
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

        {/* Driver Count */}
        <section className="mb-8">
          <h2 className={`mb-4 text-xl font-extrabold text-slate-900 ${isRTL ? 'text-right' : 'text-left'}`}>
            {language === 'ar' ? 'كم عدد السائقين الذين تحتاجهم؟' : 'How many drivers do you need?'}
          </h2>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className={`mb-8 flex flex-col items-center gap-6 sm:flex-row sm:gap-10 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <button
                type="button"
                onClick={decreaseDrivers}
                disabled={driverCount <= 1}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 sm:h-20 sm:w-20"
              >
                <Minus className="h-6 w-6 sm:h-8 sm:w-8" />
              </button>

              <div className="flex flex-col items-center">
                <span className="text-[5rem] sm:text-[6rem] font-black leading-none text-brand-blue drop-shadow-sm">
                  {driverCount}
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 mt-1">
                  {language === 'ar' ? 'سائق' : `Driver${driverCount > 1 ? "s" : ""}`}
                </span>
              </div>

              <button
                type="button"
                onClick={increaseDrivers}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue text-white shadow-xl shadow-brand-blue/20 transition-all hover:scale-105 active:scale-95 sm:h-20 sm:w-20"
              >
                <Plus className="h-6 w-6 sm:h-8 sm:w-8" />
              </button>
            </div>

            <div className={`grid grid-cols-2 gap-3 sm:flex sm:flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
              {driverQuickOptions.map((count) => {
                const isActive =
                  count === 4 ? driverCount >= 4 : driverCount === count;

                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => updateForm("driverCount", count)}
                    className={`rounded-xl border px-5 py-3 text-sm font-extrabold transition sm:min-w-32 ${isActive
                        ? "border-transparent bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50"
                      }`}
                  >
                    {count === 4 ?
                      (language === 'ar' ? '٤+ سائقين' : '4+ Drivers') :
                      `${count} ${language === 'ar' ? 'سائق' : `Driver${count > 1 ? "s" : ""}`}`}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Schedule */}
        <section className="mb-8">
          <h2 className={`mb-4 text-xl font-extrabold text-slate-900 ${isRTL ? 'text-right' : 'text-left'}`}>
            {language === 'ar' ? 'متى تحتاج السائق؟' : 'When do you need the driver?'}
          </h2>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${isRTL ? 'md:grid-cols-reverse' : ''}`}>

              {/* Start */}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="mb-3 font-extrabold text-slate-500">
                  {language === 'ar' ? 'تاريخ ووقت البدء' : 'Start date & time'}
                </h3>

                <div className="space-y-4">
                  <div className="relative">
                    <Calendar className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                    <input
                      type="date"
                      value={formData.driverStartDate || ""}
                      onChange={(e) =>
                        updateForm("driverStartDate", e.target.value)
                      }
                      className={`h-14 w-full rounded-2xl border border-slate-200 bg-white pr-4 font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 ${isRTL ? 'pr-12' : 'pl-12'}`}
                    />
                  </div>

                  <div className="relative">
                    <Clock className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 z-10 ${isRTL ? 'right-4' : 'left-4'}`} />
                    <TimeInput
                      value={formData.driverStartTime || ""}
                      onChange={(val) => updateForm("driverStartTime", val)}
                      className={`h-14 w-full rounded-2xl border border-slate-200 bg-white pr-4 font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 ${isRTL ? 'pr-12' : 'pl-12'}`}
                    />
                  </div>
                </div>
              </div>

              {/* End */}
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="mb-3 font-extrabold text-slate-500">
                  {language === 'ar' ? 'تاريخ ووقت الانتهاء' : 'End date & time'}
                </h3>

                <div className="space-y-4">
                  <div className="relative">
                    <Calendar className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                    <input
                      type="date"
                      value={formData.driverEndDate || ""}
                      onChange={(e) =>
                        updateForm("driverEndDate", e.target.value)
                      }
                      className={`h-14 w-full rounded-2xl border border-slate-200 bg-white pr-4 font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 ${isRTL ? 'pr-12' : 'pl-12'}`}
                    />
                  </div>

                  <div className="relative">
                    <Clock className={`pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 z-10 ${isRTL ? 'right-4' : 'left-4'}`} />
                    <TimeInput
                      value={formData.driverEndTime || ""}
                      onChange={(val) => updateForm("driverEndTime", val)}
                      className={`h-14 w-full rounded-2xl border border-slate-200 bg-white pr-4 font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 ${isRTL ? 'pr-12' : 'pl-12'}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="mb-8">
          <h2 className={`mb-4 text-xl font-extrabold text-slate-900 ${isRTL ? 'text-right' : 'text-left'}`}>
            {language === 'ar' ? 'أين يجب أن يتواجد السائق؟' : 'Where should the driver report?'}
          </h2>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="space-y-5">

              <div className={isRTL ? 'text-right' : 'text-left'}>
                <label className="mb-3 block font-extrabold text-slate-500">
                  {t.createRequest.form.address}
                </label>

                <div className="relative">
                  <AddressAutocomplete
                    value={formData.driverLocation || ""}
                    onChange={(val) => updateForm("driverLocation", val)}
                    onSelect={(address, zip, city) => {
                      if (zip) updateForm('driverPostalCode', zip);
                      if (city) updateForm('driverCity', city);
                      if (errors.driverLocation) setErrors(prev => ({ ...prev, driverLocation: '' }));
                    }}
                    placeholder={t.createRequest.placeholders.address}
                    className={`h-14 w-full rounded-2xl border ${errors.driverLocation ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 bg-white focus:border-blue-400 focus:ring-blue-100'} pr-4 font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-4 ${isRTL ? 'pr-12' : 'pl-12'}`}
                    iconClassName={isRTL ? 'right-4 left-auto' : 'left-4'}
                  />
                  {errors.driverLocation && <p className={`mt-1 text-sm text-red-500 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.driverLocation}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <label className="mb-3 block font-extrabold text-slate-500">
                    {t.createRequest.form.city}
                  </label>
                  <input
                    type="text"
                    value={formData.driverCity || ""}
                    onChange={(e) => updateForm("driverCity", e.target.value)}
                    placeholder={t.createRequest.placeholders.city}
                    className={`h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 ${isRTL ? 'text-right' : ''}`}
                  />
                </div>

                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <label className="mb-3 block font-extrabold text-slate-500">
                    {t.createRequest.form.zip}
                  </label>
                  <input
                    type="text"
                    value={formData.driverPostalCode || ""}
                    onChange={(e) =>
                      updateForm("driverPostalCode", e.target.value)
                    }
                    placeholder={t.createRequest.placeholders.zip}
                    className={`h-14 w-full rounded-2xl border border-slate-200 bg-white px-4 font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 ${isRTL ? 'text-right' : ''}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tasks */}
        <section className="mb-8">
          <h2 className={`mb-4 text-xl font-extrabold text-slate-900 ${isRTL ? 'text-right' : 'text-left'}`}>
            {language === 'ar' ? 'ماذا يجب أن يفعل السائق؟' : 'What should the driver do?'}
          </h2>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
              {driverTasks.map((task) => {
                const isSelected = selectedTasks.includes(task.id);

                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => {
                      toggleArrayValue("driverTasks", task.id);
                      if (errors.driverTasks) setErrors(prev => ({ ...prev, driverTasks: '' }));
                    }}
                    className={`flex flex-col items-center justify-center gap-3 rounded-[1.5rem] border p-4 transition-all duration-300 ${isSelected
                        ? "border-brand-blue bg-brand-blue-light/30 text-brand-blue ring-4 ring-brand-blue-light/50 shadow-lg -translate-y-1"
                        : "border-slate-100 bg-slate-50/50 text-slate-600 hover:border-brand-blue-light hover:bg-white hover:shadow-md"
                      }`}
                  >
                    <span className="text-3xl sm:text-4xl filter drop-shadow-sm">{task.icon}</span>
                    <span className="text-xs sm:text-sm font-bold text-center leading-tight">{task.label}</span>
                  </button>
                );
              })}
            </div>
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
        <div className="sticky bottom-0 z-10 -mx-4 border-t border-slate-200 bg-slate-50/90 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:border-t-0 sm:bg-transparent sm:p-0">
          <div className={`flex flex-col sm:flex-row gap-4 justify-end ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
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
              className={`h-14 w-full sm:w-auto sm:px-14 rounded-2xl text-sm font-bold transition ${canContinue && !isSubmitting
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20 hover:opacity-90"
                  : "bg-slate-200 text-slate-400"
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
