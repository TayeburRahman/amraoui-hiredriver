'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  CarFront, Zap, Fuel, Car, Truck, Bike, Activity,
  Check, MapPin, Calendar, FileCheck, Map, Settings, Search, Info
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
    pickupAddress: '',
    dropoffAddress: '',
    pickupDate: '',
    serviceType: '',
    condition: '',
    additionalOptions: [] as string[]
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
    { num: 1, label: 'Vehicle', icon: CarFront },
    { num: 2, label: 'Pickup', icon: MapPin },
    { num: 3, label: 'Dropoff', icon: Map },
    { num: 4, label: 'Service', icon: Settings },
    { num: 5, label: 'Condition', icon: Search },
    { num: 6, label: 'Options', icon: Zap },
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
                          className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base border-4 transition-all duration-300 ${
                            isActive 
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
              {/* Step 1: Vehicle Info */}
              {currentStep === 1 && (
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
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center ${
                            formData.engineType === engine.id 
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
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 text-center ${
                            formData.vehicleType === vehicle.id 
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

              {/* Steps 2-7 Placeholders */}
              {currentStep > 1 && currentStep < 7 && (
                <div className="py-20 text-center animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col items-center justify-center">
                   <div className="h-20 w-20 bg-brand-blue-light rounded-full flex items-center justify-center mb-6">
                     <Settings className="h-10 w-10 text-brand-blue" />
                   </div>
                   <h2 className="text-2xl font-bold text-brand-text mb-2">Step {currentStep}: {steps[currentStep-1].label}</h2>
                   <p className="text-slate-500 max-w-md">This section is ready to be connected to the backend form configuration. Form fields for this step will appear here.</p>
                </div>
              )}

              {currentStep === 7 && (
                <div className="py-20 text-center animate-in fade-in slide-in-from-right-4 duration-500 flex flex-col items-center justify-center">
                   <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                     <FileCheck className="h-10 w-10 text-emerald-600" />
                   </div>
                   <h2 className="text-3xl font-black text-brand-text mb-2">Review & Submit</h2>
                   <p className="text-slate-500 max-w-md">Please review your request summary on the right before submitting.</p>
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
                {/* Vehicle Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">1. Vehicle Details</h4>
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
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-500">Vehicle Type</span>
                      <span className="text-sm font-bold text-brand-text capitalize">
                        {formData.vehicleType || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Logistics Section */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">2. Route</h4>
                  <div className="p-4 rounded-2xl bg-slate-50 space-y-3 border border-slate-100/50">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center mt-1">
                        <div className="h-3 w-3 rounded-full border-2 border-brand-blue bg-white" />
                        <div className="w-[2px] h-8 bg-slate-200" />
                        <div className="h-3 w-3 rounded-full bg-brand-blue" />
                      </div>
                      <div className="flex flex-col justify-between h-14">
                        <span className="text-sm font-bold text-brand-text">{formData.pickupAddress || 'Pickup location not set'}</span>
                        <span className="text-sm font-bold text-brand-text">{formData.dropoffAddress || 'Dropoff location not set'}</span>
                      </div>
                    </div>
                  </div>
                </div>

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
