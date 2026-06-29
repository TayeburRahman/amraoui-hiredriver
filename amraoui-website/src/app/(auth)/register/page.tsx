'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch } from '@/hooks/redux';
import { setCredentials } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, Car, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { registerCustomer, activateAccount, resendActivationCode } from '@/lib/auth.api';

// ─── Step 1: Register form ──────────────────────────────────────────
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type RegisterFormValues = z.infer<typeof registerSchema>;

// ─── Step 2: OTP form ───────────────────────────────────────────────
const otpSchema = z.object({
  code: z.string().length(6, 'Activation code must be 6 digits'),
});
type OtpFormValues = z.infer<typeof otpSchema>;

// ─── OTP input component ────────────────────────────────────────────
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const digits = value.padEnd(6, ' ').split('');

  const handleKey = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const d = e.target.value.replace(/\D/g, '').slice(-1);
    const next = digits.map((c, idx) => {
      if (idx === i) return d || ' ';
      return c;
    }).join('').trimEnd();
    onChange(next);
    if (d && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && (digits[i] === ' ' || digits[i] === '') && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      onChange(pastedData.padEnd(6, ' '));
      const nextFocus = Math.min(pastedData.length, 5);
      document.getElementById(`otp-${nextFocus}`)?.focus();
    }
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d === ' ' ? '' : d}
          onChange={(e) => handleKey(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black rounded-2xl border-2 border-slate-200 bg-slate-50 focus:border-brand-blue focus:bg-white focus:ring-4 focus:ring-brand-blue/20 outline-none transition-all duration-200 text-brand-text shadow-sm"
        />
      ))}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  // ─── Step 1: Register ───────────────────────────────────────────────
  const onRegister = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await registerCustomer(data);
      setRegisteredEmail(data.email);
      setStep('otp');
      toast.success('Account created! Check your email for the activation code.');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Step 2: OTP Verification ──────────────────────────────────────
  const onVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      setOtpError('Please enter the full 6-digit code.');
      return;
    }
    setOtpError('');
    setIsLoading(true);
    try {
      const res = await activateAccount({ userEmail: registeredEmail, activation_code: otpValue });
      const { accessToken, user } = res.data;
      dispatch(setCredentials({ user, token: accessToken }));
      toast.success('Account activated! Welcome to Vehiqqo.');
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Invalid or expired code. Please try again.';
      setOtpError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendActivationCode(registeredEmail);
      toast.success('A new activation code has been sent to your email.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to resend code.');
    } finally {
      setIsResending(false);
    }
  };

  // ─── OTP Step UI ───────────────────────────────────────────────────
  if (step === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4 py-12 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/5 blur-[120px]" />

        <div className="w-full max-w-md z-10">
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-brand-blue flex items-center justify-center shadow-lg shadow-blue-200">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-brand-text">Vehiqqo</span>
            </Link>
            <div className="h-20 w-20 rounded-full bg-brand-blue/10 flex items-center justify-center mb-6 shadow-inner">
              <Mail className="h-10 w-10 text-brand-blue" />
            </div>
            <h1 className="text-3xl font-black text-brand-text mb-2">Verify your email</h1>
            <p className="text-slate-500 font-medium text-center max-w-sm leading-relaxed">
              We&apos;ve sent a 6-digit secure code to <br />
              <span className="font-bold text-brand-text bg-slate-100 px-2 py-0.5 rounded-md">{registeredEmail}</span>
            </p>
          </div>

          <Card className="shadow-2xl shadow-blue-100/50 border-none rounded-[2.5rem] overflow-hidden bg-white">
            <CardContent className="pt-10 px-8 pb-8 space-y-6">
              <OtpInput value={otpValue} onChange={setOtpValue} />
              {otpError && (
                <p className="text-center text-sm font-medium text-red-500">{otpError}</p>
              )}
              <Button
                onClick={onVerifyOtp}
                className="w-full h-14 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-2xl text-md font-bold shadow-lg shadow-blue-100 transition-all duration-200 hover:-translate-y-0.5"
                disabled={isLoading || otpValue.length !== 6}
              >
                {isLoading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</>
                ) : (
                  <><CheckCircle2 className="mr-2 h-5 w-5" /> Activate Account</>
                )}
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pb-10 px-8">
              <div className="text-sm text-center font-medium text-slate-400">
                Didn&apos;t receive the code?{' '}
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-brand-blue hover:underline font-bold disabled:opacity-50"
                >
                  {isResending ? 'Sending...' : 'Resend Code'}
                </button>
              </div>
              <button
                onClick={() => setStep('register')}
                className="flex items-center justify-center gap-1 text-sm text-slate-400 hover:text-brand-text font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to registration
              </button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // ─── Register Step UI ──────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/5 blur-[120px]" />

      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-brand-blue flex items-center justify-center shadow-lg shadow-blue-200">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-brand-text">Vehiqqo</span>
          </Link>
          <h1 className="text-3xl font-black text-brand-text">Create account</h1>
          <p className="text-slate-400 font-medium mt-2">Join Amraoui for smarter transport solutions</p>
        </div>

        <Card className="shadow-2xl shadow-blue-100/50 border-none rounded-[2.5rem] overflow-hidden bg-white">
          <CardContent className="pt-10 px-8 pb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onRegister)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-brand-text font-bold ml-1">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-brand-text font-bold ml-1">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@example.com"
                          type="email"
                          {...field}
                          className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-brand-text font-bold ml-1">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...field}
                            className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-brand-text font-bold ml-1">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirm ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...field}
                            className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-14 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-2xl text-md font-bold shadow-lg shadow-blue-100 transition-all duration-200 mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating account...</>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-10 px-8">
            <div className="text-sm text-center font-medium text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-blue hover:underline font-bold">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
