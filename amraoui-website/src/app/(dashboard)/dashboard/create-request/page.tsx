'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import {
  CarFront, Zap, Fuel, Car, Truck, Bike, Activity,
  Check, MapPin, Calendar, FileCheck, Map, Settings, Search, Info, User,
  FileText, Upload, ShieldCheck, Image as ImageIcon, CreditCard, Clock
} from 'lucide-react';

export default function CreateRequestPage() {
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    plate: '',
    engineType: '',
    vehicleType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    pickupAddress: '',
    pickupCity: '',
    pickupZip: '',
    pickupDate: '',
    pickupContactName: '',
    pickupContactPhone: '',
    pickupLocationType: '',
    dropoffAddress: '',
    dropoffCity: '',
    dropoffZip: '',
    dropoffDate: '',
    dropoffContactName: '',
    dropoffContactPhone: '',
    dropoffLocationType: '',
    serviceType: '',
    condition: '',
    additionalOptions: [] as string[],
    // Step 5: Documents
    idDocumentName: '',
    registrationDocumentName: '',
    insuranceDocumentName: '',
    // Step 6: Schedule & Payment
    scheduledDate: '',
    scheduledTime: '',
    paymentMethod: 'card', // card, bank_transfer, cash
  });

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    { num: 1, label: 'Customer', icon: User },
    { num: 2, label: 'Pickup', icon: MapPin },
    { num: 3, label: 'Dropoff', icon: Map },
    { num: 4, label: 'Vehicle', icon: CarFront },
    { num: 5, label: 'Documents', icon: FileText },
    { num: 6, label: 'Schedule & Payment', icon: CreditCard },
    { num: 7, label: 'Review', icon: FileCheck },
  ];

  const handleNext = () => {
    if (currentStep < 7) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-black text-brand-text">{t.createRequest?.title || 'Create Request'}</h1>
        <p className="text-slate-500 font-medium">{t.createRequest?.subtitle || 'Fill in the details below.'}</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* Main Form Area */}
        <div className="flex-1 w-full space-y-6">

          {/* Stepper Card */}
          <Card className="p-6 rounded-[2rem] border-none shadow-sm bg-white overflow-hidden">
            <div className="relative overflow-x-auto pb-4 custom-scrollbar">
              <div className="min-w-[700px] relative">
                <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
                <div className="absolute top-1/2 left-4 h-1 bg-brand-blue transition-all duration-500 rounded-full" style={{ width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 32px)` }} />

                <div className="relative flex justify-between items-center px-4">
                  {steps.map((step) => {
                    const isActive = currentStep === step.num;
                    const isCompleted = currentStep > step.num;
                    return (
                      <div key={step.num} className="flex flex-col items-center gap-2 z-10 bg-white px-2">
                        <div
                          className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base border-4 transition-all duration-300 ${isActive
                            ? 'border-white bg-brand-blue text-white shadow-lg shadow-brand-blue/30 ring-4 ring-brand-blue-light'
                            : isCompleted
                              ? 'border-white bg-emerald-500 text-white shadow-sm ring-4 ring-emerald-50'
                              : 'border-slate-50 bg-slate-100 text-slate-400'
                            }`}
                        >
                          {isCompleted ? <Check className="h-5 w-5" /> : <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />}
                        </div>
                        <span className={`text-xs sm:text-sm font-bold transition-all duration-300 ${isActive ? 'text-brand-text' : isCompleted ? 'text-slate-600' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* Form Content Card */}
          <Card className="p-6 md:p-8 rounded-[2rem] border-none shadow-sm bg-white min-h-[500px] flex flex-col justify-between">
            <div className="space-y-8">
              {/* Step 1: Customer Details */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-brand-text flex items-center gap-2">
                      <User className="h-5 w-5 text-brand-blue" />
                      Customer Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">First Name</Label>
                        <Input value={formData.firstName} onChange={(e) => updateForm('firstName', e.target.value)} placeholder="John" className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">Last Name</Label>
                        <Input value={formData.lastName} onChange={(e) => updateForm('lastName', e.target.value)} placeholder="Doe" className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">Email Address</Label>
                        <Input value={formData.email} type="email" onChange={(e) => updateForm('email', e.target.value)} placeholder="john@example.com" className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">Phone Number</Label>
                        <Input value={formData.phone} type="tel" onChange={(e) => updateForm('phone', e.target.value)} placeholder="+1 234 567 890" className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-brand-text font-bold ml-1">Company (Optional)</Label>
                        <Input value={formData.company} onChange={(e) => updateForm('company', e.target.value)} placeholder="ACME Motors" className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Pickup Details */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-brand-text flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-brand-blue" />
                      Pickup Information
                    </h2>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">Pickup Address</Label>
                        <div className="relative">
                          <Input value={formData.pickupAddress} onChange={(e) => updateForm('pickupAddress', e.target.value)} placeholder="Enter street address..." className="h-12 pl-10 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                          <MapPin className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-brand-text font-bold ml-1">Zip Code</Label>
                          <Input value={formData.pickupZip} onChange={(e) => updateForm('pickupZip', e.target.value)} placeholder="10115" className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-brand-text font-bold ml-1">Pickup Date</Label>
                          <div className="relative">
                            <Input type="date" value={formData.pickupDate} onChange={(e) => updateForm('pickupDate', e.target.value)} className="h-12 pl-10 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                            <Calendar className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          </div>
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
                    <h2 className="text-xl font-bold text-brand-text flex items-center gap-2">
                      <Map className="h-5 w-5 text-brand-blue" />
                      Delivery Information
                    </h2>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">Dropoff Address</Label>
                        <div className="relative">
                          <Input value={formData.dropoffAddress} onChange={(e) => updateForm('dropoffAddress', e.target.value)} placeholder="Enter street address..." className="h-12 pl-10 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                          <Map className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-brand-text font-bold ml-1">Zip Code</Label>
                          <Input value={formData.dropoffZip} onChange={(e) => updateForm('dropoffZip', e.target.value)} placeholder="80331" className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-brand-text font-bold ml-1">Dropoff Date</Label>
                          <div className="relative">
                            <Input type="date" value={formData.dropoffDate} onChange={(e) => updateForm('dropoffDate', e.target.value)} className="h-12 pl-10 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                            <Calendar className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>
                      </div>

                      <div className="h-[1px] w-full bg-slate-100 my-6" />

                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Dropoff Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-brand-text font-bold ml-1">Contact Name</Label>
                            <Input value={formData.dropoffContactName} onChange={(e) => updateForm('dropoffContactName', e.target.value)} placeholder="Name of person at delivery" className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-brand-text font-bold ml-1">Contact Phone</Label>
                            <Input value={formData.dropoffContactPhone} type="tel" onChange={(e) => updateForm('dropoffContactPhone', e.target.value)} placeholder="+1 234 567 890" className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Vehicle Info */}
              {currentStep === 4 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-brand-text flex items-center gap-2">
                      <CarFront className="h-5 w-5 text-brand-blue" />
                      Vehicle Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">Vehicle Make</Label>
                        <Input value={formData.make} onChange={(e) => updateForm('make', e.target.value)} placeholder="e.g. Tesla" className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">Vehicle Model</Label>
                        <Input value={formData.model} onChange={(e) => updateForm('model', e.target.value)} placeholder="e.g. Model 3" className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-brand-text font-bold ml-1">License Plate</Label>
                        <Input value={formData.plate} onChange={(e) => updateForm('plate', e.target.value)} placeholder="1-ABC-234" className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                      </div>
                    </div>
                  </div>

                  <div className="h-[1px] w-full bg-slate-100" />

                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-brand-text">Choose engine type</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {engineTypes.map((engine) => (
                        <div
                          key={engine.id}
                          onClick={() => updateForm('engineType', engine.id)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center ${formData.engineType === engine.id
                            ? 'border-brand-blue bg-brand-blue-light/30 shadow-md shadow-brand-blue/10'
                            : 'border-slate-100 hover:border-brand-blue/40 hover:bg-slate-50'
                            }`}
                        >
                          <div className={`p-3 rounded-xl ${formData.engineType === engine.id ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500'}`}>
                            <engine.icon className="h-6 w-6" />
                          </div>
                          <span className={`font-bold ${formData.engineType === engine.id ? 'text-brand-blue' : 'text-slate-600'}`}>
                            {engine.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="h-[1px] w-full bg-slate-100" />

                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-brand-text">Choose vehicle type</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {vehicleTypes.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          onClick={() => updateForm('vehicleType', vehicle.id)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center ${formData.vehicleType === vehicle.id
                            ? 'border-brand-blue bg-brand-blue-light/30 shadow-md shadow-brand-blue/10'
                            : 'border-slate-100 hover:border-brand-blue/40 hover:bg-slate-50'
                            }`}
                        >
                          <div className={`p-3 rounded-xl ${formData.vehicleType === vehicle.id ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500'}`}>
                            <vehicle.icon className="h-6 w-6" />
                          </div>
                          <span className={`font-bold ${formData.vehicleType === vehicle.id ? 'text-brand-blue' : 'text-slate-600'}`}>
                            {vehicle.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Documents */}
              {currentStep === 5 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-brand-text flex items-center gap-2">
                      <FileText className="h-5 w-5 text-brand-blue" />
                      Required Documents
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* ID Document */}
                      <div className="space-y-3">
                        <Label className="text-brand-text font-bold ml-1">Identity Document (ID/Passport)</Label>
                        <div className="relative group">
                          <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${formData.idDocumentName ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-brand-blue'}`}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {formData.idDocumentName ? (
                                <>
                                  <ShieldCheck className="w-8 h-8 mb-2 text-emerald-500" />
                                  <p className="text-sm font-bold text-emerald-600">{formData.idDocumentName}</p>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-8 h-8 mb-2 text-slate-400 group-hover:text-brand-blue" />
                                  <p className="text-sm text-slate-500 font-medium">Click to upload ID</p>
                                </>
                              )}
                            </div>
                            <input type="file" className="hidden" onChange={(e) => updateForm('idDocumentName', e.target.files?.[0]?.name || '')} />
                          </label>
                        </div>
                      </div>

                      {/* Registration Document */}
                      <div className="space-y-3">
                        <Label className="text-brand-text font-bold ml-1">Vehicle Registration (V5C/Title)</Label>
                        <div className="relative group">
                          <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${formData.registrationDocumentName ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-brand-blue'}`}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {formData.registrationDocumentName ? (
                                <>
                                  <ShieldCheck className="w-8 h-8 mb-2 text-emerald-500" />
                                  <p className="text-sm font-bold text-emerald-600">{formData.registrationDocumentName}</p>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-8 h-8 mb-2 text-slate-400 group-hover:text-brand-blue" />
                                  <p className="text-sm text-slate-500 font-medium">Click to upload Registration</p>
                                </>
                              )}
                            </div>
                            <input type="file" className="hidden" onChange={(e) => updateForm('registrationDocumentName', e.target.files?.[0]?.name || '')} />
                          </label>
                        </div>
                      </div>

                      {/* Insurance Document */}
                      <div className="space-y-3 md:col-span-2">
                        <Label className="text-brand-text font-bold ml-1">Insurance Certificate (Optional)</Label>
                        <div className="relative group">
                          <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${formData.insuranceDocumentName ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-brand-blue'}`}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {formData.insuranceDocumentName ? (
                                <>
                                  <ShieldCheck className="w-8 h-8 mb-2 text-emerald-500" />
                                  <p className="text-sm font-bold text-emerald-600">{formData.insuranceDocumentName}</p>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-8 h-8 mb-2 text-slate-400 group-hover:text-brand-blue" />
                                  <p className="text-sm text-slate-500 font-medium">Click to upload Insurance</p>
                                </>
                              )}
                            </div>
                            <input type="file" className="hidden" onChange={(e) => updateForm('insuranceDocumentName', e.target.files?.[0]?.name || '')} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Schedule & Payment */}
              {currentStep === 6 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-8">
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-brand-text flex items-center gap-2">
                        <Clock className="h-5 w-5 text-brand-blue" />
                        Preferred Schedule
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-brand-text font-bold ml-1">Scheduled Date</Label>
                          <div className="relative">
                            <Input type="date" value={formData.scheduledDate} onChange={(e) => updateForm('scheduledDate', e.target.value)} className="h-12 pl-10 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                            <Calendar className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-brand-text font-bold ml-1">Preferred Time</Label>
                          <div className="relative">
                            <Input type="time" value={formData.scheduledTime} onChange={(e) => updateForm('scheduledTime', e.target.value)} className="h-12 pl-10 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200" />
                            <Clock className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-[1px] w-full bg-slate-100" />

                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-brand-text flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-brand-blue" />
                        Payment Method
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { id: 'card', label: 'Credit Card', icon: CreditCard },
                          { id: 'bank_transfer', label: 'Bank Transfer', icon: Activity },
                          { id: 'cash', label: 'Cash on Pickup', icon: Fuel },
                        ].map((method) => (
                          <div 
                            key={method.id}
                            onClick={() => updateForm('paymentMethod', method.id)}
                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center ${
                              formData.paymentMethod === method.id 
                                ? 'border-brand-blue bg-brand-blue-light/30 shadow-md shadow-brand-blue/10' 
                                : 'border-slate-100 hover:border-brand-blue/40 hover:bg-slate-50'
                            }`}
                          >
                            <div className={`p-4 rounded-xl ${formData.paymentMethod === method.id ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500'}`}>
                              <method.icon className="h-6 w-6" />
                            </div>
                            <span className={`font-bold ${formData.paymentMethod === method.id ? 'text-brand-blue' : 'text-slate-600'}`}>
                              {method.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Review & Submit */}
              {currentStep === 7 && (
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
                        <div className="flex items-center gap-3 mb-4">
                          <CarFront className="h-5 w-5 text-brand-blue" />
                          <h3 className="font-bold text-brand-text">Vehicle</h3>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-slate-600"><span className="font-bold">Vehicle:</span> {formData.make} {formData.model}</p>
                          <p className="text-sm text-slate-600"><span className="font-bold">Plate:</span> {formData.plate}</p>
                          <p className="text-sm text-slate-600"><span className="font-bold">Engine:</span> <span className="capitalize">{formData.engineType}</span></p>
                        </div>
                      </Card>

                      {/* Route Summary */}
                      <Card className="p-5 border-slate-100 bg-slate-50/50 rounded-2xl md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                          <MapPin className="h-5 w-5 text-brand-blue" />
                          <h3 className="font-bold text-brand-text">Logistics</h3>
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
                        <div className="flex items-center gap-3 mb-4">
                          <FileText className="h-5 w-5 text-brand-blue" />
                          <h3 className="font-bold text-brand-text">Documents</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Check className={`h-4 w-4 ${formData.idDocumentName ? 'text-emerald-500' : 'text-slate-300'}`} />
                            <span className="text-sm text-slate-600">Identity Document</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className={`h-4 w-4 ${formData.registrationDocumentName ? 'text-emerald-500' : 'text-slate-300'}`} />
                            <span className="text-sm text-slate-600">Registration Document</span>
                          </div>
                        </div>
                      </Card>

                      {/* Payment Summary */}
                      <Card className="p-5 border-slate-100 bg-slate-50/50 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                          <CreditCard className="h-5 w-5 text-brand-blue" />
                          <h3 className="font-bold text-brand-text">Schedule & Payment</h3>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-slate-600"><span className="font-bold">Scheduled:</span> {formData.scheduledDate} at {formData.scheduledTime}</p>
                          <p className="text-sm text-slate-600"><span className="font-bold">Payment:</span> <span className="capitalize">{formData.paymentMethod.replace('_', ' ')}</span></p>
                        </div>
                      </Card>
                    </div>

                    <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-4 mt-6">
                      <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                        <ShieldCheck className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-900">Ready to submit!</h4>
                        <p className="text-sm text-emerald-700">By submitting this request, you agree to our terms of service. Our team will review your details and contact you shortly.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-8 mt-8 flex items-center justify-between border-t border-slate-100">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={`h-14 px-8 rounded-2xl border-slate-200 font-bold transition-all duration-200 ${currentStep === 1 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                Previous Step
              </Button>

              <Button
                onClick={handleNext}
                disabled={currentStep === 7}
                className={`h-14 px-8 rounded-2xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold shadow-lg shadow-blue-100 transition-all duration-200 ${currentStep === 7 ? 'hidden' : 'flex'}`}
              >
                Continue to {steps[currentStep]?.label || 'Next'}
              </Button>

              {currentStep === 7 && (
                <Button
                  className="h-14 px-10 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200 transition-all duration-200"
                >
                  Submit Request
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Right Sidebar: Request Summary */}
        <div className="w-full xl:w-[400px] shrink-0 sticky top-28">
          <Card className="p-6 md:p-8 rounded-[2rem] border-none shadow-sm bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-blue to-blue-400" />

            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <Info className="h-6 w-6 text-brand-blue" />
                <h3 className="text-xl font-bold text-brand-text">Request Summary</h3>
              </div>

              <div className="space-y-5">
                {/* Customer Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">1. Customer</h4>
                  <div className="p-4 rounded-2xl bg-slate-50 space-y-3 border border-slate-100/50">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-500">Name</span>
                      <span className="text-sm font-bold text-brand-text">
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

                {/* Logistics Section */}
                {currentStep > 1 && (
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
                            <span className="text-sm font-bold text-brand-text">{formData.pickupAddress ? `${formData.pickupAddress}` : 'Pickup location not set'}</span>
                            {formData.pickupDate && <span className="text-xs text-slate-500">{formData.pickupDate}</span>}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-brand-text">{formData.dropoffAddress ? `${formData.dropoffAddress}` : 'Dropoff location not set'}</span>
                            {formData.dropoffDate && <span className="text-xs text-slate-500">{formData.dropoffDate}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vehicle Section */}
                {currentStep > 3 && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">4. Vehicle Details</h4>
                    <div className="p-4 rounded-2xl bg-slate-50 space-y-3 border border-slate-100/50">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Make & Model</span>
                        <span className="text-sm font-bold text-brand-text">
                          {formData.make || formData.model ? `${formData.make} ${formData.model}` : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Plate Number</span>
                        <span className="text-sm font-bold text-brand-text">
                          {formData.plate || '-'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Engine Type</span>
                        <span className="text-sm font-bold text-brand-blue capitalize">
                          {formData.engineType || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents Section */}
                {currentStep > 4 && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">5. Documents</h4>
                    <div className="p-4 rounded-2xl bg-slate-50 space-y-2 border border-slate-100/50">
                      <div className="flex items-center gap-2">
                        {formData.idDocumentName ? <Check className="h-4 w-4 text-emerald-500" /> : <div className="h-2 w-2 rounded-full bg-slate-300" />}
                        <span className="text-sm font-medium text-slate-600">Identity Document</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {formData.registrationDocumentName ? <Check className="h-4 w-4 text-emerald-500" /> : <div className="h-2 w-2 rounded-full bg-slate-300" />}
                        <span className="text-sm font-medium text-slate-600">Vehicle Registration</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Schedule & Payment Section */}
                {currentStep > 5 && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">6. Schedule & Payment</h4>
                    <div className="p-4 rounded-2xl bg-slate-50 space-y-3 border border-slate-100/50">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-500">Schedule</span>
                        <span className="text-sm font-bold text-brand-text">
                          {formData.scheduledDate ? `${formData.scheduledDate} ${formData.scheduledTime}` : '-'}
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
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-bold text-slate-400">Estimated Total</p>
                      <p className="text-xs text-slate-400 mt-1">Calculated after route selection</p>
                    </div>
                    <span className="text-3xl font-black text-brand-text">€ --</span>
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
