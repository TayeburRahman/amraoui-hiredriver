'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, Car, Mail, ArrowLeft, ShieldCheck, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { forgotPassword, verifyResetOtp, resetPassword, resendForgotOtp } from '@/lib/auth.api';

type Step = 'email' | 'otp' | 'reset' | 'success';

// ─── OTP Input ─────────────────────────────────────────────────────
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const digits = value.padEnd(6, ' ').split('');
  
  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const d = e.target.value.replace(/\D/g, '').slice(-1);
    const next = digits.map((c, idx) => {
      if (idx === i) return d || ' ';
      return c;
    }).join('').trimEnd();
    onChange(next);
    if (d && i < 5) {
      document.getElementById(`fp-otp-${i + 1}`)?.focus();
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && (digits[i] === ' ' || digits[i] === '') && i > 0) {
      document.getElementById(`fp-otp-${i - 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      onChange(pastedData.padEnd(6, ' '));
      const nextFocus = Math.min(pastedData.length, 5);
      document.getElementById(`fp-otp-${nextFocus}`)?.focus();
    }
  };

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          id={`fp-otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d === ' ' ? '' : d}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black rounded-2xl border-2 border-slate-200 bg-slate-50 focus:border-brand-blue focus:bg-white focus:ring-4 focus:ring-brand-blue/20 outline-none transition-all duration-200 text-brand-text shadow-sm"
        />
      ))}
    </div>
  );
}

// ─── Schemas ───────────────────────────────────────────────────────
const emailSchema = z.object({ email: z.string().email('Enter a valid email address') });
const resetSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type EmailForm = z.infer<typeof emailSchema>;
type ResetForm = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const resetForm = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  // Step 1 — Send OTP
  const onSendEmail = async (data: EmailForm) => {
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      setEmail(data.email);
      setStep('otp');
      toast.success('Reset code sent! Check your email.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to send reset code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 — Verify OTP
  const onVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      setOtpError('Please enter the full 6-digit code.');
      return;
    }
    setOtpError('');
    setIsLoading(true);
    try {
      await verifyResetOtp({ email, code: otpValue });
      setStep('reset');
      toast.success('Code verified! Now set your new password.');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Invalid or expired code.';
      setOtpError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3 — Reset Password
  const onReset = async (data: ResetForm) => {
    setIsLoading(true);
    try {
      await resetPassword(email, data);
      setStep('success');
      toast.success('Password reset successfully!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendForgotOtp(email);
      toast.success('A new reset code has been sent.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to resend code.');
    } finally {
      setIsResending(false);
    }
  };

  const Logo = () => (
    <Link href="/" className="flex items-center gap-3 mb-6">
      <div className="h-12 w-12 rounded-2xl bg-brand-blue flex items-center justify-center shadow-lg shadow-blue-200">
        <Car className="h-6 w-6 text-white" />
      </div>
      <span className="text-2xl font-bold text-brand-text">Amraoui HireDriver</span>
    </Link>
  );

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4 py-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/5 blur-[120px]" />
      <div className="w-full max-w-md z-10">{children}</div>
    </div>
  );

  // ─── Step: Email ──────────────────────────────────────────────────
  if (step === 'email') {
    return (
      <Wrapper>
        <div className="flex flex-col items-center mb-8">
          <Logo />
          <div className="h-16 w-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
            <KeyRound className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-3xl font-black text-brand-text">Forgot password?</h1>
          <p className="text-slate-400 font-medium mt-2 text-center max-w-xs">
            Enter your email and we&apos;ll send you a reset code.
          </p>
        </div>
        <Card className="shadow-2xl shadow-blue-100/50 border-none rounded-[2.5rem] overflow-hidden bg-white">
          <CardContent className="pt-10 px-8 pb-8">
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onSendEmail)} className="space-y-5">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-brand-text font-bold ml-1">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          type="email"
                          {...field}
                          className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-14 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-2xl text-md font-bold shadow-lg shadow-blue-100 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending code...</>
                  ) : (
                    <><Mail className="mr-2 h-5 w-5" /> Send Reset Code</>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="pb-10 px-8 justify-center">
            <Link
              href="/login"
              className="flex items-center gap-1 text-sm text-slate-400 hover:text-brand-text font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to login
            </Link>
          </CardFooter>
        </Card>
      </Wrapper>
    );
  }

  // ─── Step: OTP ────────────────────────────────────────────────────
  if (step === 'otp') {
    return (
      <Wrapper>
        <div className="flex flex-col items-center mb-8">
          <Logo />
          <div className="h-20 w-20 rounded-full bg-brand-blue/10 flex items-center justify-center mb-6 shadow-inner">
            <Mail className="h-10 w-10 text-brand-blue" />
          </div>
          <h1 className="text-3xl font-black text-brand-text mb-2">Check your email</h1>
          <p className="text-slate-500 font-medium text-center max-w-sm leading-relaxed">
            Enter the 6-digit secure code sent to <br />
            <span className="font-bold text-brand-text bg-slate-100 px-2 py-0.5 rounded-md">{email}</span>
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
                <><ShieldCheck className="mr-2 h-5 w-5" /> Verify Code</>
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
              onClick={() => setStep('email')}
              className="flex items-center justify-center gap-1 text-sm text-slate-400 hover:text-brand-text font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Change email
            </button>
          </CardFooter>
        </Card>
      </Wrapper>
    );
  }

  // ─── Step: Reset Password ─────────────────────────────────────────
  if (step === 'reset') {
    return (
      <Wrapper>
        <div className="flex flex-col items-center mb-8">
          <Logo />
          <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-black text-brand-text">Set new password</h1>
          <p className="text-slate-400 font-medium mt-2 text-center max-w-xs">
            Choose a strong password for your account.
          </p>
        </div>
        <Card className="shadow-2xl shadow-blue-100/50 border-none rounded-[2.5rem] overflow-hidden bg-white">
          <CardContent className="pt-10 px-8 pb-8">
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-5">
                <FormField
                  control={resetForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-brand-text font-bold ml-1">New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showNew ? 'text' : 'password'}
                            placeholder="••••••••"
                            {...field}
                            className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resetForm.control}
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
                  className="w-full h-14 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-2xl text-md font-bold shadow-lg shadow-blue-100 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Resetting...</>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </Wrapper>
    );
  }

  // ─── Step: Success ────────────────────────────────────────────────
  return (
    <Wrapper>
      <div className="flex flex-col items-center mb-8">
        <Logo />
        <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
          <ShieldCheck className="h-10 w-10 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-black text-brand-text">Password reset!</h1>
        <p className="text-slate-400 font-medium mt-2 text-center max-w-xs">
          Your password has been updated. You can now sign in with your new password.
        </p>
      </div>
      <Card className="shadow-2xl shadow-blue-100/50 border-none rounded-[2.5rem] overflow-hidden bg-white">
        <CardContent className="pt-10 px-8 pb-10">
          <Button
            onClick={() => router.push('/login')}
            className="w-full h-14 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-2xl text-md font-bold shadow-lg shadow-blue-100 transition-all duration-200"
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </Wrapper>
  );
}
