'use client';

import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Contact() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          
          {/* Left Column: Illustration */}
          <div className="bg-slate-50/50 rounded-[2rem] p-6 md:p-8 flex items-center justify-center border border-slate-100">
            <div className="relative w-full h-[250px] md:h-[350px]">
              <Image 
                src="/assets/landing/contact.png" 
                alt="Contact Illustration" 
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-50">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-text mb-1">
              Contact Us
            </h2>
            <p className="text-slate-500 text-sm md:text-base mb-6">
              We will get back to you as soon as possible.
            </p>

            <form className="space-y-3">
              <Select>
                <SelectTrigger className="w-full data-[size=default]:h-12 rounded-full">
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent className="data-[size=default]:h-14">
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                </SelectContent>
              </Select>

              <Input 
                type="text" 
                placeholder="Name and surname"
                className="w-full bg-slate-50 border-none rounded-2xl h-12 px-4 text-slate-600 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-brand-blue/20"
              />

              <Input 
                type="email" 
                placeholder="Email"
                className="w-full bg-slate-50 border-none rounded-2xl h-12 px-4 text-slate-600 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-brand-blue/20"
              />

              <Textarea 
                placeholder="Write your message"
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-600 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-brand-blue/20 min-h-[120px] resize-none"
              />

              <p className="text-center text-xs text-slate-400 py-2">
                I agree to the privacy policy and terms of service
              </p>

              <Button 
                type="submit"
                className="w-full button-gradient text-white font-bold h-12 rounded-2xl shadow-lg shadow-blue-200 hover:opacity-90 transition-all transform active:scale-[0.98]"
              >
                Send
              </Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
