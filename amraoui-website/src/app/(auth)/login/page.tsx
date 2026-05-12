'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch } from '@/hooks/redux';
import { setCredentials, setLoading, setError } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['USER', 'ADMIN']),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'USER',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    dispatch(setLoading(true));

    // Simulate API call
    setTimeout(() => {
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.email.split('@')[0],
        email: data.email,
        role: data.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
      };

      dispatch(setCredentials({ user: mockUser, token: 'mock-jwt-token' }));
      dispatch(setLoading(false));
      setIsLoading(false);

      toast.success('Login successful!');
      
      if (data.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/5 blur-[120px]" />

      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-brand-blue flex items-center justify-center shadow-lg shadow-blue-100">
              <div className="w-5 h-5 bg-white rounded-sm" />
            </div>
            <span className="text-2xl font-bold text-brand-text">Hiflow</span>
          </Link>
          <h1 className="text-3xl font-black text-brand-text">Welcome back</h1>
          <p className="text-slate-400 font-medium mt-2">Enter your credentials to access Hiflow</p>
        </div>

        <Card className="shadow-2xl shadow-blue-100/50 border-none rounded-[2.5rem] overflow-hidden bg-white">
          <CardContent className="pt-10 px-8 pb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-brand-text font-bold ml-1">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="admin@example.com" 
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
                        <Link href="#" className="text-xs font-bold text-brand-blue hover:underline">Forgot password?</Link>
                      </div>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
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
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-brand-text font-bold ml-1">Select Role (Demo)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all duration-200">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                          <SelectItem value="USER" className="rounded-xl my-1">User</SelectItem>
                          <SelectItem value="ADMIN" className="rounded-xl my-1">Admin</SelectItem>
                        </SelectContent>
                      </Select>
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
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-6 pb-10 px-8">
            <div className="text-sm text-center font-medium text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-brand-blue hover:underline font-bold">
                Create Account
              </Link>
            </div>
            <div className="text-[10px] text-center text-slate-400 bg-slate-50 p-4 rounded-3xl border border-slate-100/50">
              <p className="font-bold uppercase tracking-widest mb-1 text-slate-300">Demo Access</p>
              Any credentials will work. Select <strong>Admin</strong> for the management view.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
