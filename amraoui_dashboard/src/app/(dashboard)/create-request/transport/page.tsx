'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AddressAutocomplete } from '@/components/ui/address-autocomplete';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeInput } from "@/components/ui/time-input";
import { useTranslation } from '@/hooks/useTranslation';
import {
  CarFront, Zap, Fuel, Car, Truck, Bike, Activity,
  Check, MapPin, Calendar, FileCheck, Map, Settings, Search, Info, User, Phone, Mail,
  FileText, Upload, ShieldCheck, Shield, Image as ImageIcon, CreditCard, Clock,
  ArrowRight, ClipboardCheck, UserCog, ChevronRight, ShieldCheck as ShieldCheckIcon,
  Shield as ShieldIcon, Upload as UploadIcon,
  ArrowLeft
} from 'lucide-react';

const timeOptions = Array.from({ length: 48 }).map((_, i) => {
  const hours = Math.floor(i / 2).toString().padStart(2, '0');
  const minutes = (i % 2 === 0) ? '00' : '30';
  return `${hours}:${minutes}`;
});

const initialFormData = {
  make: '',
  model: '',
  plate: '',
  color: '',
  year: '',
  vin: '',
  deliveryType: 'drive',
  engineType: '',
  vehicleType: '',
  vehicleWeight: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  pickupHouseNumber: '',
  pickupAddress: '',
  pickupCity: '',
  pickupZip: '',
  pickupDate: '',
  pickupContactName: '',
  pickupContactPhone: '',
  pickupContactEmail: '',
  pickupLocationType: '',
  dropoffHouseNumber: '',
  dropoffAddress: '',
  dropoffCity: '',
  dropoffZip: '',
  dropoffDate: '',
  dropoffContactName: '',
  dropoffContactPhone: '',
  dropoffContactEmail: '',
  dropoffLocationType: '',
  dropoffInstructions: '',
  serviceType: '',
  condition: '',
  additionalOptions: [] as string[],
  specialInstructions: '',
  adminNotes: '',
  deliveryConditions: [] as string[],
  idCheckRequired: false,
  vehiclePhotos: '',
  registrationDocumentName: '',
  referenceDocumentName: '',
  scheduledDate: '',
  scheduledTime: '',
  pickupTime: '',
  dropoffTime: '',
  confirmSchedulePayment: false,
  paymentMethod: 'invoice',
};

export default function TransportRequestPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const isRTL = language === 'ar';

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState(initialFormData);

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const savedStep = localStorage.getItem('transport_currentStep');
    const savedForm = localStorage.getItem('transport_formData');

    if (savedStep) {
      setCurrentStep(parseInt(savedStep, 10));
    }
    if (savedForm) {
      try {
        setFormData(JSON.parse(savedForm));
      } catch (e) {
        console.error('Failed to parse saved form data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const [isSuccess, setIsSuccess] = useState(false);

  // Save state when it changes
  useEffect(() => {
    if (isLoaded && !isSuccess) {
      localStorage.setItem('transport_currentStep', currentStep.toString());
      localStorage.setItem('transport_formData', JSON.stringify(formData));
    }
  }, [currentStep, formData, isLoaded, isSuccess]);

  const toggleDeliveryCondition = (condition: string) => {
    setFormData(prev => {
      const conditions = prev.deliveryConditions.includes(condition)
        ? prev.deliveryConditions.filter(c => c !== condition)
        : [...prev.deliveryConditions, condition];
      return { ...prev, deliveryConditions: conditions };
    });
  };

  const engineTypes = [
    { id: 'electric', label: t.createRequest?.engines?.electric || 'Electric', icon: Zap },
    { id: 'gasoline', label: t.createRequest?.engines?.gasoline || 'Gasoline', icon: Fuel },
    { id: 'diesel', label: t.createRequest?.engines?.diesel || 'Diesel', icon: Activity },
    { id: 'hybrid', label: t.createRequest?.engines?.hybrid || 'Hybrid', icon: Zap },
  ];

  const vehicleTypes = [
    { id: 'sedan', label: t.createRequest?.vehicles?.sedan || 'Sedan', icon: CarFront },
    { id: 'suv', label: t.createRequest?.vehicles?.suv || 'SUV', icon: Car },
    { id: 'van', label: t.createRequest?.vehicles?.van || 'Van', icon: Truck },
    { id: 'truck', label: t.createRequest?.vehicles?.truck || 'Truck', icon: Truck },
    { id: 'motorcycle', label: t.createRequest?.vehicles?.motorcycle || 'Motorcycle', icon: Bike },
  ];

  const steps = [
    { num: 1, label: t.createRequest.steps.customer, icon: User },
    { num: 2, label: t.createRequest.steps.pickup, icon: MapPin },
    { num: 3, label: t.createRequest.steps.dropoff, icon: Map },
    { num: 4, label: t.createRequest.steps.vehicle, icon: CarFront },
    { num: 5, label: t.createRequest.steps.instructions, icon: Info },
    { num: 6, label: t.createRequest.steps.documents, icon: FileText },
    { num: 7, label: t.createRequest.steps.schedule, icon: CreditCard },
    { num: 8, label: t.createRequest.steps.review, icon: FileCheck },
  ];

  const handleNext = () => {
    const newErrors: Record<string, string> = {};
    const reqMsg = language === 'ar' ? 'هذا الحقل مطلوب' : 'This field is required';

    if (currentStep === 1) {
      if (!formData.firstName) newErrors.firstName = reqMsg;
      if (!formData.lastName) newErrors.lastName = reqMsg;
      if (!formData.email) newErrors.email = reqMsg;
      if (!formData.phone) newErrors.phone = reqMsg;
      if (!formData.company) newErrors.company = reqMsg;
    }

    if (currentStep === 2) {
      if (!formData.pickupAddress) newErrors.pickupAddress = reqMsg;
      if (!formData.pickupZip) newErrors.pickupZip = reqMsg;
      if (!formData.pickupDate) newErrors.pickupDate = reqMsg;
    }

    if (currentStep === 3) {
      if (!formData.dropoffAddress) newErrors.dropoffAddress = reqMsg;
      if (!formData.dropoffZip) newErrors.dropoffZip = reqMsg;
      if (!formData.dropoffDate) newErrors.dropoffDate = reqMsg;
    }

    if (currentStep === 4) {
      if (!formData.vehicleType) newErrors.vehicleType = reqMsg;
      if (!formData.make) newErrors.make = reqMsg;
      if (!formData.model) newErrors.model = reqMsg;
      if (!formData.plate) newErrors.plate = reqMsg;
      if (!formData.deliveryType) newErrors.deliveryType = reqMsg;
      if (formData.deliveryType === 'tow' && !formData.vehicleWeight) {
        newErrors.vehicleWeight = language === 'ar' ? 'الرجاء إدخال وزن المركبة للنقل' : 'Please enter vehicle weight for tow delivery.';
      }
    }

    if (currentStep === 7) {
      if (!formData.pickupTime) newErrors.pickupTime = reqMsg;
      if (!formData.dropoffTime) newErrors.dropoffTime = reqMsg;
      if (!formData.confirmSchedulePayment) newErrors.confirmSchedulePayment = language === 'ar' ? 'الرجاء تأكيد الجدول الزمني وتفاصيل الدفع' : 'Please confirm the schedule and payment details.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (currentStep < 8) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        type: 'TRANSPORT',
        details: formData,
      };

      const res = await api.post('/requests', payload);
      if (res.data?.success) {
        setIsSuccess(true);
        // Clear saved state on successful submission
        localStorage.removeItem('transport_currentStep');
        localStorage.removeItem('transport_formData');

        setCurrentStep(1);
        setFormData(initialFormData);

        toast.success(t.createRequest?.successMessage || 'Transport request created successfully!');
        // Handle success - maybe redirect to orders
        router.push('/mission-monitoring');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div></div>;
  }

  return (
    <div className={`max-w-[1400px] mx-auto p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-x-hidden ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.push('/create-request')}
        className={`inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition hover:text-brand-blue ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
        {t.common.backToSelection}
      </button>

      <div className={`space-y-2 px-1 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-text tracking-tight">{t.createRequest.transportRequest.title}</h1>
        <p className="text-slate-500 font-medium text-sm sm:text-base">{t.createRequest.subtitle}</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 sm:gap-8 lg:gap-10 items-start">
        {/* Main Form Area */}
        <div className="flex-1 w-full space-y-6">

          {/* Stepper Card */}
          <Card className="p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-none shadow-sm bg-white overflow-hidden">
            <div className="relative overflow-x-auto pb-4 scrollbar-hide">
              <div className="min-w-[800px] relative">
                <div className="absolute top-[24px] left-8 right-8 h-1 bg-slate-100 rounded-full" />
                <div
                  className="absolute top-[24px] left-8 h-1 bg-brand-blue transition-all duration-700 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                  style={{ width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 16px)` }}
                />

                <div className="relative flex justify-between items-start px-4">
                  {steps.map((step) => {
                    const isActive = currentStep === step.num;
                    const isCompleted = currentStep > step.num;
                    return (
                      <div key={step.num} className={`flex flex-col items-center gap-3 z-10 transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
                        <div
                          className={`h-12 w-12 rounded-full flex items-center justify-center font-bold border-4 transition-all duration-500 ${isActive
                            ? 'border-white bg-brand-blue text-white shadow-xl shadow-brand-blue/30 ring-4 ring-brand-blue-light'
                            : isCompleted
                              ? 'border-white bg-emerald-500 text-white shadow-md ring-4 ring-emerald-50'
                              : 'border-slate-50 bg-slate-100 text-slate-400'
                            }`}
                        >
                          {isCompleted ? <Check className="h-6 w-6" /> : <step.icon className={`h-5 w-5 ${isActive ? 'animate-pulse' : ''}`} />}
                        </div>
                        <span className={`text-xs font-black tracking-tight transition-all duration-300 uppercase ${isActive ? 'text-brand-blue' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Step Indicator */}
            <div className="mt-4 md:hidden flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-brand-blue">{currentStep}</span>
                <span className="text-slate-300 font-bold">/</span>
                <span className="text-slate-400 font-bold">{steps.length}</span>
              </div>
              <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-blue transition-all duration-500"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Form Content Card */}
          <Card className="p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-none shadow-sm bg-white min-h-[500px] flex flex-col justify-between">
            <div className="space-y-8">
              {/* Step 1: Customer Details */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6">
                    <h2 className={`text-xl font-bold text-brand-text flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <User className="h-5 w-5 text-brand-blue" />
                      {t.createRequest.steps.customer}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">{t.createRequest.form.firstName}</Label>
                        <Input value={formData.firstName} onChange={(e) => updateForm('firstName', e.target.value)} placeholder={t.createRequest.placeholders.firstName} className={`h-12 rounded-2xl ${errors.firstName ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50 focus:bg-white'} transition-all duration-200`} />
                        {errors.firstName && <p className="text-sm text-red-500 mt-1 ml-1">{errors.firstName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">{t.createRequest.form.lastName}</Label>
                        <Input value={formData.lastName} onChange={(e) => updateForm('lastName', e.target.value)} placeholder={t.createRequest.placeholders.lastName} className={`h-12 rounded-2xl ${errors.lastName ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50 focus:bg-white'} transition-all duration-200`} />
                        {errors.lastName && <p className="text-sm text-red-500 mt-1 ml-1">{errors.lastName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">{t.createRequest.form.email}</Label>
                        <Input value={formData.email} type="email" onChange={(e) => updateForm('email', e.target.value)} placeholder={t.createRequest.placeholders.email} className={`h-12 rounded-2xl ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50 focus:bg-white'} transition-all duration-200`} />
                        {errors.email && <p className="text-sm text-red-500 mt-1 ml-1">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">{t.createRequest.form.phone}</Label>
                        <Input value={formData.phone} type="tel" onChange={(e) => updateForm('phone', e.target.value)} placeholder={t.createRequest.placeholders.phone} className={`h-12 rounded-2xl ${errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50 focus:bg-white'} transition-all duration-200`} />
                        {errors.phone && <p className="text-sm text-red-500 mt-1 ml-1">{errors.phone}</p>}
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-brand-text font-bold ml-1">{t.createRequest.form.company}</Label>
                        <Input value={formData.company} onChange={(e) => updateForm('company', e.target.value)} placeholder={t.createRequest.placeholders.company} className={`h-12 rounded-2xl ${errors.company ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50 focus:bg-white'} transition-all duration-200`} />
                        {errors.company && <p className="text-sm text-red-500 mt-1 ml-1">{errors.company}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Pickup Details */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6">
                    <h2 className={`text-xl font-bold text-brand-text flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <MapPin className="h-5 w-5 text-brand-blue" />
                      {t.createRequest.steps.pickup}
                    </h2>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">{t.createRequest.form.address}</Label>
                        <AddressAutocomplete
                          value={formData.pickupAddress}
                          onChange={(val) => updateForm('pickupAddress', val)}
                          onSelect={(address, zip, city) => {
                            if (zip) updateForm('pickupZip', zip);
                            if (city) updateForm('pickupCity', city);
                            if (errors.pickupAddress) setErrors(prev => ({ ...prev, pickupAddress: '' }));
                          }}
                          placeholder={t.createRequest.placeholders.address}
                          className={`h-12 rounded-2xl ${errors.pickupAddress ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50 focus:bg-white'} transition-all duration-200 ${isRTL ? 'pr-10' : 'pl-10'}`}
                          iconClassName={isRTL ? 'right-3 left-auto' : 'left-3'}
                        />
                        {errors.pickupAddress && <p className="text-sm text-red-500 mt-1 ml-1">{errors.pickupAddress}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label className="text-brand-text font-bold ml-1">{language === 'ar' ? 'رقم المبنى' : 'House/Bldg No.'}</Label>
                          <Input value={formData.pickupHouseNumber} onChange={(e) => updateForm('pickupHouseNumber', e.target.value)} placeholder="e.g. 10A" className={`h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200`} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-brand-text font-bold ml-1">Zip Code</Label>
                          <Input value={formData.pickupZip} onChange={(e) => updateForm('pickupZip', e.target.value)} placeholder="10115" className={`h-12 rounded-2xl ${errors.pickupZip ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50 focus:bg-white'} transition-all duration-200`} />
                          {errors.pickupZip && <p className="text-sm text-red-500 mt-1 ml-1">{errors.pickupZip}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-brand-text font-bold ml-1">Pickup Date</Label>
                          <div className="relative">
                            <Input type="date" value={formData.pickupDate} onChange={(e) => updateForm('pickupDate', e.target.value)} className={`h-12 pl-10 rounded-2xl ${errors.pickupDate ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50 focus:bg-white'} transition-all duration-200`} />
                            <Calendar className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          </div>
                          {errors.pickupDate && <p className="text-sm text-red-500 mt-1 ml-1">{errors.pickupDate}</p>}
                        </div>
                      </div>

                      <div className="h-[1px] w-full bg-slate-100 my-6" />

                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Pickup Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-brand-text font-bold ml-1">Contact Name</Label>
                            <Input value={formData.pickupContactName} onChange={(e) => updateForm('pickupContactName', e.target.value)} placeholder="Name of person at pickup" className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-brand-text font-bold ml-1">Contact Phone</Label>
                            <Input value={formData.pickupContactPhone} type="tel" onChange={(e) => updateForm('pickupContactPhone', e.target.value)} placeholder="+1 234 567 890" className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-brand-text font-bold ml-1">Contact Email</Label>
                            <Input value={formData.pickupContactEmail} type="email" onChange={(e) => updateForm('pickupContactEmail', e.target.value)} placeholder="email@example.com" className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Dropoff Details */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                        <MapPin className="h-6 w-6 text-brand-blue" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-brand-text">
                          Dropoff information
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                          Add the final delivery address and receiver details.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">

                      {/* Address */}
                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">Dropoff Address</Label>
                        <AddressAutocomplete
                          value={formData.dropoffAddress}
                          onChange={(val) => updateForm("dropoffAddress", val)}
                          onSelect={(address, zip, city) => {
                            if (zip) updateForm('dropoffZip', zip);
                            if (city) updateForm('dropoffCity', city);
                            if (errors.dropoffAddress) setErrors(prev => ({ ...prev, dropoffAddress: '' }));
                          }}
                          placeholder="Delivery address"
                          className={`h-12 pl-10 rounded-2xl ${errors.dropoffAddress ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50 focus:bg-white'} transition-all duration-200`}
                        />
                        {errors.dropoffAddress && <p className="text-sm text-red-500 mt-1 ml-1">{errors.dropoffAddress}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label className="text-brand-text font-bold ml-1">{language === 'ar' ? 'رقم المبنى' : 'House/Bldg No.'}</Label>
                          <Input value={formData.dropoffHouseNumber} onChange={(e) => updateForm('dropoffHouseNumber', e.target.value)} placeholder="e.g. 10A" className={`h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200`} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-brand-text font-bold ml-1">Zip Code</Label>
                          <Input value={formData.dropoffZip} onChange={(e) => updateForm('dropoffZip', e.target.value)} placeholder="10115" className={`h-12 rounded-2xl ${errors.dropoffZip ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50 focus:bg-white'} transition-all duration-200`} />
                          {errors.dropoffZip && <p className="text-sm text-red-500 mt-1 ml-1">{errors.dropoffZip}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label className="text-brand-text font-bold ml-1">Delivery Date</Label>
                          <div className="relative">
                            <Input type="date" value={formData.dropoffDate} onChange={(e) => updateForm('dropoffDate', e.target.value)} className={`h-12 pl-10 rounded-2xl ${errors.dropoffDate ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50 focus:bg-white'} transition-all duration-200`} />
                            <Calendar className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          </div>
                          {errors.dropoffDate && <p className="text-sm text-red-500 mt-1 ml-1">{errors.dropoffDate}</p>}
                        </div>
                      </div>

                      {/* Contact Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="space-y-2">
                          <Label className="text-brand-text font-bold ml-1">Contact Name</Label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                              value={formData.dropoffContactName}
                              onChange={(e) =>
                                updateForm("dropoffContactName", e.target.value)
                              }
                              placeholder="Delivery contact person name"
                              className="h-12 pl-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-brand-text font-bold ml-1">Contact Phone</Label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                              value={formData.dropoffContactPhone}
                              type="tel"
                              onChange={(e) =>
                                updateForm("dropoffContactPhone", e.target.value)
                              }
                              placeholder="Delivery contact phone"
                              className="h-12 pl-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-brand-text font-bold ml-1">Contact Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                              value={formData.dropoffContactEmail}
                              type="email"
                              onChange={(e) =>
                                updateForm("dropoffContactEmail", e.target.value)
                              }
                              placeholder="Receiver contact email"
                              className="h-12 pl-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">{t.createRequest.form.deliveryNote}</Label>
                        <textarea
                          value={formData.dropoffInstructions}
                          onChange={(e) =>
                            updateForm("dropoffInstructions", e.target.value)
                          }
                          placeholder={t.createRequest.placeholders.vin}
                          className={`w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 min-h-[130px] resize-none text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/20 transition-all duration-200 ${isRTL ? 'text-right' : ''}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Vehicle Info */}
              {currentStep === 4 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6">
                    <h2 className={`text-xl font-bold text-brand-text flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <CarFront className="h-5 w-5 text-brand-blue" />
                      {t.createRequest.steps.vehicle}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">{t.createRequest.form.vehicleType}</Label>
                        <Select
                          value={formData.vehicleType}
                          onValueChange={(value) => updateForm("vehicleType", value)}
                        >
                          <SelectTrigger className={`!h-12 !w-full rounded-2xl ${errors.vehicleType ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50'} px-4 text-slate-600 focus:bg-white focus:ring-2 focus:ring-brand-blue/20 transition-all duration-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            {formData.vehicleType ? (
                              <div className={`flex flex-1 items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                                {(() => {
                                  const Icon = vehicleTypes.find(v => v.id === formData.vehicleType)?.icon || CarFront;
                                  return <Icon className="h-4 w-4 text-brand-blue shrink-0" />;
                                })()}
                                <span className="font-medium text-brand-text truncate">
                                  {vehicleTypes.find(v => v.id === formData.vehicleType)?.label}
                                </span>
                              </div>
                            ) : (
                              <SelectValue placeholder={t.createRequest.form.vehicleType} />
                            )}
                          </SelectTrigger>
                          <SelectContent className="w-[var(--radix-select-trigger-width)] min-w-[200px] rounded-2xl border-slate-100 shadow-xl">
                            {vehicleTypes.map((vehicle) => (
                              <SelectItem key={vehicle.id} value={vehicle.id} className="rounded-xl cursor-pointer py-2.5">
                                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <vehicle.icon className="h-4 w-4 text-brand-blue shrink-0" />
                                  <span className="font-medium text-slate-700 truncate">{vehicle.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.vehicleType && <p className="text-sm text-red-500 mt-1 ml-1">{errors.vehicleType}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">{t.createRequest.form.make}</Label>
                        <Input
                          value={formData.make}
                          onChange={(e) => updateForm("make", e.target.value)}
                          placeholder={t.createRequest.placeholders.make}
                          className={`h-12 rounded-2xl ${errors.make ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50 focus:bg-white'} transition-all duration-200 ${isRTL ? 'text-right' : ''}`}
                        />
                        {errors.make && <p className="text-sm text-red-500 mt-1 ml-1">{errors.make}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">{t.createRequest.form.model}</Label>
                        <Input
                          value={formData.model}
                          onChange={(e) => updateForm("model", e.target.value)}
                          placeholder={t.createRequest.placeholders.model}
                          className={`h-12 rounded-2xl ${errors.model ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50 focus:bg-white'} transition-all duration-200 ${isRTL ? 'text-right' : ''}`}
                        />
                        {errors.model && <p className="text-sm text-red-500 mt-1 ml-1">{errors.model}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">{t.createRequest.form.plate}</Label>
                        <Input
                          value={formData.plate}
                          onChange={(e) => updateForm("plate", e.target.value)}
                          placeholder={t.createRequest.placeholders.make}
                          className={`h-12 rounded-2xl ${errors.plate ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50 focus:bg-white'} transition-all duration-200 ${isRTL ? 'text-right' : ''}`}
                        />
                        {errors.plate && <p className="text-sm text-red-500 mt-1 ml-1">{errors.plate}</p>}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-brand-text font-bold ml-1">VIN Number</Label>
                        <Input
                          value={formData.vin}
                          onChange={(e) => updateForm("vin", e.target.value)}
                          placeholder="Enter VIN number"
                          className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">Engine Type</Label>
                        <Select
                          value={formData.engineType}
                          onValueChange={(value) => updateForm("engineType", value)}
                        >
                          <SelectTrigger className="!h-12 !w-full rounded-2xl border-slate-100 bg-slate-50 px-4 text-slate-600 focus:bg-white focus:ring-2 focus:ring-brand-blue/20 transition-all duration-200">
                            {formData.engineType ? (
                              <div className="flex flex-1 items-center gap-2 text-left">
                                {(() => {
                                  const Icon = engineTypes.find(e => e.id === formData.engineType)?.icon || Activity;
                                  return <Icon className="h-4 w-4 text-brand-blue shrink-0" />;
                                })()}
                                <span className="font-medium text-brand-text truncate">
                                  {engineTypes.find(e => e.id === formData.engineType)?.label}
                                </span>
                              </div>
                            ) : (
                              <SelectValue placeholder="Select engine type" />
                            )}
                          </SelectTrigger>
                          <SelectContent className="w-[var(--radix-select-trigger-width)] min-w-[200px] rounded-2xl border-slate-100 shadow-xl">
                            {engineTypes.map((engine) => (
                              <SelectItem key={engine.id} value={engine.id} className="rounded-xl cursor-pointer py-2.5">
                                <div className="flex items-center gap-2">
                                  <engine.icon className="h-4 w-4 text-brand-blue shrink-0" />
                                  <span className="font-medium text-slate-700 truncate">{engine.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="h-[1px] w-full bg-slate-100" />

                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-brand-text">Delivery Type</h2>
                    <div className="space-y-3">
                      {[
                        { id: "drive", label: "Drive with car" },
                        { id: "license", label: "Use of dealer plates (Z or V green plates )" },
                        { id: "tow", label: "Transport with vehicle carrier (tow truck)" },

                      ].map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => updateForm("deliveryType", option.id)}
                          className={`w-full min-h-[56px] h-auto py-3 rounded-2xl border-2 px-6 text-left font-bold transition-all duration-200 ${formData.deliveryType === option.id
                            ? "border-brand-blue bg-brand-blue-light/30 text-brand-blue shadow-sm shadow-brand-blue/10"
                            : "border-slate-100 bg-slate-50 hover:border-brand-blue/40 text-slate-600"
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>

                    {/* Weight option when Tow Truck is selected */}
                    {formData.deliveryType === 'tow' && (
                      <div className="space-y-2 mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Label className="text-brand-text font-bold ml-1">Vehicle Weight (kg)</Label>
                        <Input
                          type="number"
                          value={formData.vehicleWeight}
                          onChange={(e) => updateForm("vehicleWeight", e.target.value)}
                          placeholder="e.g. 1500"
                          className={`h-12 rounded-2xl ${errors.vehicleWeight ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50 focus:bg-white'} transition-all duration-200`}
                        />
                        {errors.vehicleWeight && <p className="text-sm text-red-500 mt-1 ml-1">{errors.vehicleWeight}</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Special Instructions */}
              {currentStep === 5 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  {/* Special Instructions */}
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                        <Info className="h-6 w-6 text-brand-blue" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-brand-text">
                          Special instructions
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                          Share anything the driver or admin should know.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <textarea
                        rows={3}
                        value={formData.specialInstructions}
                        onChange={(e) => updateForm("specialInstructions", e.target.value)}
                        placeholder="Example: Please call before pickup, documents are inside the vehicle, handle with care..."
                        className="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                      />

                      <textarea
                        rows={3}
                        value={formData.adminNotes}
                        onChange={(e) => updateForm("adminNotes", e.target.value)}
                        placeholder="Add notes if needed"
                        className="w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-brand-blue/20"
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold text-brand-text text-sm ml-1">
                        Delivery conditions
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {[
                          "Call before pickup",
                          "Documents inside vehicle",
                          "Handle with care",
                          "Do not refuel",
                          "Contact receiver first",
                          "Vehicle has low fuel",
                        ].map((condition) => {
                          const isActive = formData.deliveryConditions.includes(condition);
                          return (
                            <button
                              key={condition}
                              type="button"
                              onClick={() => toggleDeliveryCondition(condition)}
                              className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${isActive ? 'border-brand-blue bg-brand-blue text-white shadow-md shadow-brand-blue/20' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-brand-blue/30'}`}
                            >
                              {condition}
                            </button>
                          );
                        })}
                      </div>
                    </div>

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

                  </div>
                </div>
              )}

              {/* Step 6: Documents & Photos */}
              {currentStep === 6 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                  {/* Documents & Photos */}
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                        <FileText className="h-6 w-6 text-brand-blue" />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-brand-text">
                          Documents & Photos
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                          Upload useful files for a smoother vehicle handover.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 rounded-2xl border border-brand-blue/20 bg-brand-blue-light/20 p-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                        <ShieldIcon className="h-5 w-5 text-brand-blue" />
                      </div>
                      <div>
                        <h3 className="font-bold text-brand-text text-sm">
                          Secure file attachment
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                          Your documents and photos will be attached securely to this transport request.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Vehicle Photos */}
                      <label className={`cursor-pointer rounded-3xl border-2 border-dashed p-6 text-center flex flex-col items-center transition-all duration-200 ${formData.vehiclePhotos ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-brand-blue/50 hover:bg-slate-100'}`}>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm mb-4">
                          {formData.vehiclePhotos ? <ShieldCheckIcon className="h-7 w-7 text-emerald-500" /> : <UploadIcon className="h-7 w-7 text-brand-blue" />}
                        </div>
                        <h3 className="text-base font-bold text-brand-text mb-2">
                          Vehicle photos
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1">
                          {formData.vehiclePhotos ? formData.vehiclePhotos : "Add clear photos of the vehicle if available."}
                        </p>
                        <div className={`rounded-full px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 ${formData.vehiclePhotos ? 'bg-emerald-500' : 'bg-brand-blue hover:bg-brand-blue-hover'}`}>
                          {formData.vehiclePhotos ? 'Change Photo' : 'Add Photo'}
                        </div>
                        <input type="file" className="hidden" onChange={(e) => updateForm('vehiclePhotos', e.target.files?.[0]?.name || '')} />
                      </label>

                      {/* Registration */}
                      <label className={`cursor-pointer rounded-3xl border-2 border-dashed p-6 text-center flex flex-col items-center transition-all duration-200 ${formData.registrationDocumentName ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-brand-blue/50 hover:bg-slate-100'}`}>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm mb-4">
                          {formData.registrationDocumentName ? <ShieldCheckIcon className="h-7 w-7 text-emerald-500" /> : <UploadIcon className="h-7 w-7 text-brand-blue" />}
                        </div>
                        <h3 className="text-base font-bold text-brand-text mb-2">
                          Registration document
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1">
                          {formData.registrationDocumentName ? formData.registrationDocumentName : "Upload vehicle registration or ownership document."}
                        </p>
                        <div className={`rounded-full px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 ${formData.registrationDocumentName ? 'bg-emerald-500' : 'bg-brand-blue hover:bg-brand-blue-hover'}`}>
                          {formData.registrationDocumentName ? 'Change Document' : 'Add Document'}
                        </div>
                        <input type="file" className="hidden" onChange={(e) => updateForm('registrationDocumentName', e.target.files?.[0]?.name || '')} />
                      </label>

                      {/* Reference */}
                      <label className={`cursor-pointer rounded-3xl border-2 border-dashed p-6 text-center flex flex-col items-center transition-all duration-200 ${formData.referenceDocumentName ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-brand-blue/50 hover:bg-slate-100'}`}>
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm mb-4">
                          {formData.referenceDocumentName ? <ShieldCheckIcon className="h-7 w-7 text-emerald-500" /> : <UploadIcon className="h-7 w-7 text-brand-blue" />}
                        </div>
                        <h3 className="text-base font-bold text-brand-text mb-2">
                          Reference document
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1">
                          {formData.referenceDocumentName ? formData.referenceDocumentName : "Add any extra file for the driver or admin."}
                        </p>
                        <div className={`rounded-full px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 ${formData.referenceDocumentName ? 'bg-emerald-500' : 'bg-brand-blue hover:bg-brand-blue-hover'}`}>
                          {formData.referenceDocumentName ? 'Change File' : 'Add File'}
                        </div>
                        <input type="file" className="hidden" onChange={(e) => updateForm('referenceDocumentName', e.target.files?.[0]?.name || '')} />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Schedule & Payment */}
              {currentStep === 7 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="max-w-4xl rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm p-5 sm:p-8 mx-auto">

                    {/* Header */}
                    <div className="flex items-start gap-4 mb-8">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>

                      <div>
                        <h2 className="text-3xl font-bold text-slate-800">
                          Schedule & Payment
                        </h2>
                        <p className="text-slate-500 mt-1">
                          Choose pickup and delivery slots, then confirm payment.
                        </p>
                      </div>
                    </div>

                    {/* Route Summary */}
                    <div className="mb-8 flex items-center justify-between rounded-2xl bg-blue-50 px-6 py-5">
                      <div className="flex items-center gap-8">
                        <div>
                          <h3 className="font-bold text-slate-800">
                            {formData.pickupCity || "Paris"}
                          </h3>
                          <p className="text-sm text-slate-500">
                            Pickup
                          </p>
                        </div>

                        <ArrowRight className="h-6 w-6 text-blue-600" />

                        <div>
                          <h3 className="font-bold text-slate-800">
                            {formData.dropoffCity || "Lyon"}
                          </h3>
                          <p className="text-sm text-slate-500">
                            Delivery
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <h3 className="font-bold text-slate-800">
                          {formData.make || formData.model ? `${formData.make} ${formData.model}` : "Vehicle"}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Vehicle
                        </p>
                      </div>
                    </div>

                    {/* Pickup Schedule */}
                    <div className="mb-7">
                      <h3 className="mb-4 text-lg font-bold text-slate-800">
                        Pickup schedule
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <Calendar className="h-5 w-5 text-slate-500 absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <Input
                            type="date"
                            value={formData.pickupDate || ""}
                            onChange={(e) => updateForm("pickupDate", e.target.value)}
                            onClick={(e) => {
                              try {
                                (e.target as HTMLInputElement).showPicker();
                              } catch (err) { }
                            }}
                            className="h-14 rounded-2xl border-slate-200 bg-white pl-14 pr-5 text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                          />
                          {!formData.pickupDate && (
                            <span className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 text-slate-400 bg-white px-1">
                              Select pickup date
                            </span>
                          )}
                        </div>

                        <div className="relative">
                          <Clock className={`h-5 w-5 text-slate-500 absolute top-1/2 -translate-y-1/2 pointer-events-none z-10 ${isRTL ? 'right-5' : 'left-5'}`} />
                          <TimeInput
                            value={formData.pickupTime || ""}
                            onChange={(val) => updateForm("pickupTime", val)}
                            className={`h-14 w-full rounded-2xl ${errors.pickupTime ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white'} ${isRTL ? 'pr-14 pl-5 text-right' : 'pl-14 pr-5 text-left'} text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 font-medium outline-none transition-all`}
                          />
                          {errors.pickupTime && <p className="text-sm text-red-500 mt-1 ml-1">{errors.pickupTime}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Delivery Schedule */}
                    <div className="mb-7">
                      <h3 className="mb-4 text-lg font-bold text-slate-800">
                        Delivery schedule
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <Calendar className="h-5 w-5 text-slate-500 absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <Input
                            type="date"
                            value={formData.dropoffDate || ""}
                            onChange={(e) => updateForm("dropoffDate", e.target.value)}
                            onClick={(e) => {
                              try {
                                (e.target as HTMLInputElement).showPicker();
                              } catch (err) { }
                            }}
                            className="h-14 rounded-2xl border-slate-200 bg-white pl-14 pr-5 text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                          />
                          {!formData.dropoffDate && (
                            <span className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 text-slate-400 bg-white px-1">
                              Select delivery date
                            </span>
                          )}
                        </div>

                        <div className="relative">
                          <Clock className={`h-5 w-5 text-slate-500 absolute top-1/2 -translate-y-1/2 pointer-events-none z-10 ${isRTL ? 'right-5' : 'left-5'}`} />
                          <TimeInput
                            value={formData.dropoffTime || ""}
                            onChange={(val) => updateForm("dropoffTime", val)}
                            className={`h-14 w-full rounded-2xl ${errors.dropoffTime ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white'} ${isRTL ? 'pr-14 pl-5 text-right' : 'pl-14 pr-5 text-left'} text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 font-medium outline-none transition-all`}
                          />
                          {errors.dropoffTime && <p className="text-sm text-red-500 mt-1 ml-1">{errors.dropoffTime}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Estimated Delivery Time */}
                    <div className="mb-8 flex flex-col sm:flex-row items-start gap-4 rounded-2xl border border-blue-200 bg-blue-100/70 px-5 sm:px-6 py-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                          <Info className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-800">
                          Estimated delivery time
                        </h3>
                        <p className="mt-2 text-2xl font-extrabold text-blue-600">
                          24–48 hours
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          Final timing depends on driver assignment and route availability.
                        </p>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
                      <h3 className="mb-5 text-xl font-bold text-slate-800">
                        Payment method
                      </h3>

                      <button
                        type="button"
                        onClick={() => updateForm("paymentMethod", "invoice")}
                        className={`w-full rounded-2xl px-5 py-4 transition-all duration-200 ${formData.paymentMethod === "invoice"
                          ? "bg-slate-100 ring-2 ring-blue-200"
                          : "bg-slate-50 hover:bg-slate-100"
                          }`}
                      >
                        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500">
                            <CreditCard className="h-6 w-6 text-white" />
                          </div>

                          <span className="font-bold text-slate-800">
                            Pay through invoice
                          </span>
                        </div>
                      </button>
                    </div>

                    {/* Confirmation */}
                    <label className="flex items-start gap-3 pl-8 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.confirmSchedulePayment || false}
                        onChange={(e) =>
                          updateForm("confirmSchedulePayment", e.target.checked)
                        }
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />

                      <div>
                        <p className={`font-medium ${errors.confirmSchedulePayment ? 'text-red-600' : 'text-slate-800'}`}>
                          I confirm the schedule and payment details
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          Payment is processed securely.
                        </p>
                        {errors.confirmSchedulePayment && <p className="text-sm text-red-500 mt-1">{errors.confirmSchedulePayment}</p>}
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 8: Review & Submit */}
              {currentStep === 8 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-brand-text flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-emerald-500" />
                      Final Review
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Customer Summary */}
                      <Card className="p-5 border-slate-100 bg-slate-50/50 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                          <User className="h-5 w-5 text-brand-blue" />
                          <h3 className="font-bold text-brand-text">Customer</h3>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-slate-600"><span className="font-bold">Name:</span> {formData.firstName} {formData.lastName}</p>
                          <p className="text-sm text-slate-600"><span className="font-bold">Email:</span> {formData.email}</p>
                          <p className="text-sm text-slate-600"><span className="font-bold">Phone:</span> {formData.phone}</p>
                        </div>
                      </Card>

                      {/* Vehicle Summary */}
                      <Card className="p-5 border-slate-100 bg-slate-50/50 rounded-2xl">
                        <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <CarFront className="h-5 w-5 text-brand-blue" />
                          <h3 className="font-bold text-brand-text">{t.createRequest.steps.vehicle}</h3>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-slate-600"><span className="font-bold">Vehicle:</span> {formData.make} {formData.model}</p>
                          <p className="text-sm text-slate-600"><span className="font-bold">Plate:</span> {formData.plate}</p>
                          <p className="text-sm text-slate-600"><span className="font-bold">VIN:</span> {formData.vin || '-'}</p>
                          <p className="text-sm text-slate-600"><span className="font-bold">Delivery:</span> <span className="capitalize">{formData.deliveryType === 'tow' ? 'Vehicle Carrier' : formData.deliveryType.replace('_', ' ')}</span></p>
                          {formData.deliveryType === 'tow' && (
                            <p className="text-sm text-slate-600"><span className="font-bold">Weight:</span> {formData.vehicleWeight || '-'} kg</p>
                          )}
                        </div>
                      </Card>

                      {/* Route Summary */}
                      <Card className="p-5 border-slate-100 bg-slate-50/50 rounded-2xl md:col-span-2">
                        <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <MapPin className="h-5 w-5 text-brand-blue" />
                          <h3 className="font-bold text-brand-text">{language === 'ar' ? 'الخدمات اللوجستية' : 'Logistics'}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Pickup</p>
                            <p className="text-sm text-slate-600">{formData.pickupAddress}, {formData.pickupCity}</p>
                            <p className="text-xs text-slate-400 mt-1">{formData.pickupDate}</p>
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Dropoff</p>
                            <p className="text-sm text-slate-600">{formData.dropoffAddress}, {formData.dropoffCity}</p>
                            <p className="text-xs text-slate-400 mt-1">{formData.dropoffDate}</p>
                          </div>
                        </div>
                      </Card>

                      {/* Documents Summary */}
                      <Card className="p-5 border-slate-100 bg-slate-50/50 rounded-2xl">
                        <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <FileText className="h-5 w-5 text-brand-blue" />
                          <h3 className="font-bold text-brand-text">{t.createRequest.steps.documents}</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Check className={`h-4 w-4 ${formData.vehiclePhotos ? 'text-emerald-500' : 'text-slate-300'}`} />
                            <span className="text-sm text-slate-600">Vehicle Photos</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className={`h-4 w-4 ${formData.registrationDocumentName ? 'text-emerald-500' : 'text-slate-300'}`} />
                            <span className="text-sm text-slate-600">Registration Document</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className={`h-4 w-4 ${formData.referenceDocumentName ? 'text-emerald-500' : 'text-slate-300'}`} />
                            <span className="text-sm text-slate-600">Reference Document</span>
                          </div>
                        </div>
                      </Card>

                      {/* Payment Summary */}
                      <Card className="p-5 border-slate-100 bg-slate-50/50 rounded-2xl">
                        <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <CreditCard className="h-5 w-5 text-brand-blue" />
                          <h3 className="font-bold text-brand-text">{t.createRequest.steps.schedule}</h3>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-slate-600"><span className="font-bold">Pickup:</span> {formData.pickupDate} {formData.pickupTime}</p>
                          <p className="text-sm text-slate-600"><span className="font-bold">Delivery:</span> {formData.dropoffDate} {formData.dropoffTime}</p>
                          <p className="text-sm text-slate-600"><span className="font-bold">Method:</span> <span className="capitalize">{formData.paymentMethod.replace('_', ' ')}</span></p>
                        </div>
                      </Card>

                      {/* Instructions Summary */}
                      <Card className="p-5 border-slate-100 bg-slate-50/50 rounded-2xl md:col-span-2">
                        <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <Info className="h-5 w-5 text-brand-blue" />
                          <h3 className="font-bold text-brand-text">{t.createRequest.steps.instructions}</h3>
                        </div>
                        <div className="space-y-4">
                          {formData.specialInstructions && (
                            <div>
                              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">General Instructions</p>
                              <p className="text-sm text-slate-600 italic">"{formData.specialInstructions}"</p>
                            </div>
                          )}
                          {formData.deliveryConditions.length > 0 && (
                            <div>
                              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Conditions</p>
                              <div className="flex flex-wrap gap-2">
                                {formData.deliveryConditions.map((c) => (
                                  <span key={c} className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {!formData.specialInstructions && formData.deliveryConditions.length === 0 && (
                            <p className="text-sm text-slate-400 italic">No special instructions provided.</p>
                          )}
                        </div>
                      </Card>
                    </div>

                    <div className={`p-6 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-4 mt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                        <ShieldCheck className="h-6 w-6 text-white" />
                      </div>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h4 className="font-bold text-emerald-900">{language === 'ar' ? 'جاهز للإرسال!' : 'Ready to submit!'}</h4>
                        <p className="text-sm text-emerald-700">{language === 'ar' ? 'بإرسال هذا الطلب، فإنك توافق على شروط الخدمة الخاصة بنا. سيقوم فريقنا بمراجعة تفاصيلك والاتصال بك قريباً.' : 'By submitting this request, you agree to our terms of service. Our team will review your details and contact you shortly.'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={`pt-8 mt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 border-t border-slate-100 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={`w-full sm:w-auto h-14 px-10 rounded-2xl border-slate-200 text-sm font-bold transition-all duration-200 ${currentStep === 1 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {t.common.previous}
              </Button>

              <div className={`flex flex-col sm:flex-row gap-4 w-full sm:w-auto ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                <Button
                  onClick={handleNext}
                  disabled={currentStep === 8}
                  className={`w-full sm:w-auto h-14 px-12 rounded-2xl bg-brand-blue hover:bg-brand-blue-hover text-white text-sm font-bold shadow-lg shadow-brand-blue/20 transition-all duration-200 ${currentStep === 8 ? 'hidden' : 'flex items-center gap-2 justify-center'}`}
                >
                  {t.common.continue}
                  <ChevronRight className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
                </Button>

                {currentStep === 8 && (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto h-14 px-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-lg shadow-emerald-200 transition-all duration-200"
                  >
                    {isSubmitting ? 'Submitting...' : t.common.submit}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar: Request Summary */}
        <div className="w-full xl:w-[360px] 2xl:w-[400px] shrink-0 xl:sticky xl:top-28 max-h-screen xl:max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar pb-10 xl:pb-0">
          <Card className="p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-none shadow-sm bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-blue to-blue-400" />

            <div className="space-y-6">
              <div className={`flex items-center gap-3 border-b border-slate-100 pb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Info className="h-6 w-6 text-brand-blue" />
                <h3 className="text-xl font-bold text-brand-text">{language === 'ar' ? 'ملخص الطلب' : 'Request Summary'}</h3>
              </div>

              <div className="space-y-5">
                {/* Customer Section */}
                {currentStep > 1 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">1. Customer</h4>
                    <div className="p-4 rounded-2xl bg-slate-50 space-y-3 border border-slate-100/50">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Name</span>
                        <span className="text-sm font-bold text-brand-text truncate max-w-[150px] sm:max-w-[200px]">
                          {formData.firstName || formData.lastName ? `${formData.firstName} ${formData.lastName}` : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Contact</span>
                        <span className="text-sm font-bold text-brand-text">
                          {formData.phone || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Logistics Section */}
                {currentStep > 2 && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">2-3. Route</h4>
                    <div className="p-4 rounded-2xl bg-slate-50 space-y-3 border border-slate-100/50">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center mt-1">
                          <div className="h-3 w-3 rounded-full border-2 border-brand-blue bg-white" />
                          <div className="w-[2px] h-8 bg-slate-200" />
                          <div className="h-3 w-3 rounded-full bg-brand-blue" />
                        </div>
                        <div className="flex flex-col justify-between h-14">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-brand-text break-words line-clamp-2">{formData.pickupAddress ? `${formData.pickupAddress}` : 'Pickup location not set'}</span>
                            {formData.pickupDate && <span className="text-xs text-slate-500">{formData.pickupDate}</span>}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-brand-text break-words line-clamp-2">{formData.dropoffAddress ? `${formData.dropoffAddress}` : 'Dropoff location not set'}</span>
                            {formData.dropoffDate && <span className="text-xs text-slate-500">{formData.dropoffDate}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vehicle Section */}
                {currentStep > 4 && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">4. Vehicle Details</h4>
                    <div className="p-4 rounded-2xl bg-slate-50 space-y-3 border border-slate-100/50">
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-sm font-medium text-slate-500 shrink-0">Make & Model</span>
                        <span className="text-sm font-bold text-brand-text truncate text-right flex-1">
                          {formData.make || formData.model ? `${formData.make} ${formData.model}` : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-sm font-medium text-slate-500 shrink-0">Plate Number</span>
                        <span className="text-sm font-bold text-brand-text truncate text-right flex-1">
                          {formData.plate || '-'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-sm font-medium text-slate-500 shrink-0">VIN</span>
                        <span className="text-sm font-bold text-brand-text truncate text-right flex-1">
                          {formData.vin || '-'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-sm font-medium text-slate-500 shrink-0">Type</span>
                        <span className="text-sm font-bold text-brand-text capitalize truncate text-right flex-1">
                          {formData.vehicleType || '-'}
                        </span>
                      </div>
                      <div className="flex justify-between items-start border-t border-slate-100/50 pt-2 gap-4">
                        <span className="text-xs font-bold text-brand-blue capitalize break-words flex-1">{formData.deliveryType === 'tow' ? 'Vehicle Carrier' : formData.deliveryType.replace('_', ' ')}</span>
                        <span className="text-xs font-bold text-slate-500 capitalize text-right shrink-0">{formData.engineType || '-'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Instructions Section */}
                {currentStep > 5 && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">5. Instructions</h4>
                    <div className="p-4 rounded-2xl bg-slate-50 space-y-2 border border-slate-100/50">
                      <div className="flex items-center gap-2">
                        {formData.specialInstructions || formData.adminNotes || formData.deliveryConditions.length > 0 ? <Check className="h-4 w-4 text-emerald-500" /> : <div className="h-2 w-2 rounded-full bg-slate-300" />}
                        <span className="text-sm font-medium text-slate-600">Special Instructions</span>
                      </div>
                      {formData.idCheckRequired && (
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm font-medium text-slate-600">ID Check Required</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Documents Section */}
                {currentStep > 6 && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">6. Documents</h4>
                    <div className="p-4 rounded-2xl bg-slate-50 space-y-2 border border-slate-100/50">
                      <div className="flex items-center gap-2">
                        {formData.vehiclePhotos ? <Check className="h-4 w-4 text-emerald-500" /> : <div className="h-2 w-2 rounded-full bg-slate-300" />}
                        <span className="text-sm font-medium text-slate-600">Vehicle Photos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {formData.registrationDocumentName ? <Check className="h-4 w-4 text-emerald-500" /> : <div className="h-2 w-2 rounded-full bg-slate-300" />}
                        <span className="text-sm font-medium text-slate-600">Registration Document</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {formData.referenceDocumentName ? <Check className="h-4 w-4 text-emerald-500" /> : <div className="h-2 w-2 rounded-full bg-slate-300" />}
                        <span className="text-sm font-medium text-slate-600">Reference Document</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Schedule & Payment Section */}
                {currentStep > 7 && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">7. Schedule & Payment</h4>
                    <div className="p-4 rounded-2xl bg-slate-50 space-y-3 border border-slate-100/50">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Pickup</span>
                        <span className="text-sm font-bold text-brand-text">
                          {formData.pickupDate ? `${formData.pickupDate} ${formData.pickupTime}` : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Delivery</span>
                        <span className="text-sm font-bold text-brand-text">
                          {formData.dropoffDate ? `${formData.dropoffDate} ${formData.dropoffTime}` : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Payment</span>
                        <span className="text-sm font-bold text-brand-blue capitalize">
                          {formData.paymentMethod.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Price Estimate */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-brand-blue">
                    <Info className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-extrabold leading-tight">
                      Quote will be sent after submitting request
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
