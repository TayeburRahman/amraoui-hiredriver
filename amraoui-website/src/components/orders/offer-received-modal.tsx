import React, { useState, cloneElement, ReactElement } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Car, 
  MapPin, 
  Calendar, 
  FileText, 
  Info 
} from 'lucide-react';

interface OfferReceivedModalProps {
  children: React.ReactNode;
}

export function OfferReceivedModal({ children }: OfferReceivedModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
        {children}
      </div>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-[420px] md:max-w-[800px] p-0 gap-0 rounded-[24px] sm:rounded-[28px] overflow-hidden bg-white max-h-[90vh] overflow-y-auto hide-scrollbar" showCloseButton={false}>
        <div className="p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-slate-50 hover:bg-slate-100 flex-shrink-0"
                onClick={() => setOpen(false)}
              >
                <ArrowLeft className="h-5 w-5 text-slate-700" />
              </Button>
              <DialogTitle className="text-2xl font-black text-slate-900">
                Offer Received
              </DialogTitle>
            </div>
            
            <div className="pl-13">
              <DialogDescription className="text-[15px] font-medium text-slate-500 mb-3">
                Review the offer for your transport request.
              </DialogDescription>
              <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none px-3 py-1.5 rounded-full text-xs font-bold">
                Pending Customer Review
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="h-full">
              {/* Quote Summary */}
              <Card className="h-full rounded-[20px] border border-slate-100 shadow-sm p-4 sm:p-5 space-y-4 sm:space-y-5">
            <h3 className="font-bold text-slate-900 text-base">Quote Summary</h3>
            
            <div className="space-y-5">
              {/* Transport Type */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Car className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-0.5">Transport Type</p>
                  <p className="text-sm font-bold text-slate-900">Drive with car</p>
                </div>
              </div>

              <div className="w-full h-px bg-slate-100" />

              {/* Pickup Location */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-0.5">Pickup Location</p>
                  <p className="text-sm font-bold text-slate-900">Los Angeles, CA</p>
                </div>
              </div>

              <div className="w-full h-px bg-slate-100" />

              {/* Drop-off Location */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-0.5">Drop-off Location</p>
                  <p className="text-sm font-bold text-slate-900">San Francisco, CA</p>
                </div>
              </div>

              <div className="w-full h-px bg-slate-100" />

              {/* Preferred Date */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-0.5">Preferred Date</p>
                  <p className="text-sm font-bold text-slate-900">May 25, 2025</p>
                </div>
              </div>

              <div className="w-full h-px bg-slate-100" />

              {/* Vehicle */}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Car className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-0.5">Vehicle</p>
                  <p className="text-sm font-bold text-slate-900">Toyota Land Cruiser • 2022</p>
                </div>
              </div>
            </div>
          </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-5 sm:space-y-6 lg:space-y-8 flex flex-col justify-between">
            {/* Offer Details */}
            <Card className="rounded-[20px] border border-slate-100 shadow-sm p-4 sm:p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Offer Details</h3>
            
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-1">Offer Amount</p>
              <p className="text-3xl font-black text-blue-600">$ 100.00</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500 mb-1">Extra Expenses</p>
              <p className="text-sm font-bold text-slate-900 mb-2">$ 30.00</p>
              <p className="text-xs font-medium text-slate-400">Tolls, fuel, and parking fees</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-700">Total Estimated</p>
              <p className="text-xl font-black text-blue-600">$ 130.00</p>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="rounded-[20px] border border-slate-100 shadow-sm p-4 sm:p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Payment Method</h3>
            
            <div className="border border-blue-200 bg-blue-50/30 rounded-xl p-4 flex gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-bold text-slate-900">Invoice Payment</p>
                  <Badge className="bg-emerald-100/50 text-emerald-600 hover:bg-emerald-100/50 border-none px-2 py-0 text-[10px] font-bold">
                    Selected
                  </Badge>
                </div>
                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  You will receive an invoice after the offer is accepted.
                </p>
              </div>
            </div>
          </Card>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5 pt-2">
          {/* Terms Info */}
          <div className="bg-blue-50 rounded-xl p-4 flex gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              By accepting this offer, you agree to the <span className="font-bold text-blue-600">Terms & Conditions</span>.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 sm:gap-4 pt-2">
            <Button 
              variant="outline" 
              className="flex-1 h-12 rounded-2xl border-red-200 bg-red-50/50 text-red-500 font-bold hover:bg-red-50 hover:text-red-600 transition-colors"
              onClick={() => setOpen(false)}
            >
              Reject
            </Button>
            <Button 
              className="flex-1 h-12 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-emerald-600 font-bold hover:bg-emerald-50 transition-colors shadow-none"
              onClick={() => setOpen(false)}
            >
              Accept
            </Button>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
