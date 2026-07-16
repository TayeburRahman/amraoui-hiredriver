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
import { useState } from 'react';
import { toast } from 'sonner';

import { useTranslation } from '@/hooks/useTranslation';

export function Contact({ id }: { id?: string }) {
  const { t } = useTranslation();
  const [topic, setTopic] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !name || !email || !message) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Your message has been sent successfully! We will get back to you soon.');
      setTopic('');
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section id={id} className="py-24 bg-white overflow-hidden">
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
              {t.landing.contact.title}
            </h2>
            <p className="text-slate-500 text-sm md:text-base mb-6">
              {t.landing.contact.subtitle}
            </p>

            <form className="space-y-3" onSubmit={handleSubmit}>
              <Select value={topic} onValueChange={(val) => setTopic(val || '')}>
                <SelectTrigger className="w-full data-[size=default]:h-12 rounded-full capitalize">
                  <SelectValue placeholder={t.landing.contact.topic} />
                </SelectTrigger>
                <SelectContent className="data-[size=default]:h-14">
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                </SelectContent>
              </Select>

              <Input 
                type="text" 
                placeholder={t.landing.contact.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl h-12 px-4 text-slate-600 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-brand-blue/20"
              />

              <Input 
                type="email" 
                placeholder={t.landing.contact.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl h-12 px-4 text-slate-600 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-brand-blue/20"
              />

              <Textarea 
                placeholder={t.landing.contact.message}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-slate-600 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-brand-blue/20 min-h-[120px] resize-none"
              />

              <p className="text-center text-xs text-slate-400 py-2">
                {t.landing.contact.agree}
              </p>

              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full button-gradient text-white font-bold h-12 rounded-2xl shadow-lg shadow-blue-200 hover:opacity-90 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
              >
                {isSubmitting ? 'Sending...' : t.landing.contact.send}
              </Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
