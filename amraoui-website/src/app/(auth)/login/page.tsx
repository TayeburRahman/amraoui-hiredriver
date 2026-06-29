'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Eye, EyeOff, Loader2, Car } from 'lucide-react';
import { loginCustomer } from '@/lib/auth.api';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const res = await loginCustomer(data);
      const { accessToken, user } = res.data;

      // Only CUSTOMERS can access the website dashboard
      if (user?.authId?.role !== 'CUSTOMERS' && user?.role !== 'CUSTOMERS') {
        toast.error('Access denied. Only customers can log in here.');
        setIsLoading(false);
        return;
      }

      dispatch(setCredentials({ user, token: accessToken }));
      toast.success('Login successful! Welcome back.');
      router.push('/dashboard');
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/5 blur-[120px]" />

      <div className="w-full max-w-md z-10">
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-brand-blue flex items-center justify-center shadow-lg shadow-blue-200">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-brand-text">Vehiqqo</span>
          </Link>
          <h1 className="text-3xl font-black text-brand-text">Welcome back</h1>
          <p className="text-slate-400 font-medium mt-2">Sign in to your customer account</p>
        </div>

        <Card className="shadow-2xl shadow-blue-100/50 border-none rounded-[2.5rem] overflow-hidden bg-white">
          <CardContent className="pt-10 px-8 pb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between ml-1">
                        <FormLabel className="text-brand-text font-bold">Password</FormLabel>
                        <Link
                          href="/forgot-password"
                          className="text-xs font-bold text-brand-blue hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
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
                <Button
                  type="submit"
                  className="w-full h-14 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-2xl text-md font-bold shadow-lg shadow-blue-100 transition-all duration-200 mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-10 px-8">
            <div className="text-sm text-center font-medium text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-brand-blue hover:underline font-bold">
                Create Account
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
