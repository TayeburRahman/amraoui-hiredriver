'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Lock, Shield, User } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account security and notification preferences.
        </p>
      </div>

      <Tabs defaultValue="security" className="space-y-4">
        <TabsList>
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <Shield className="h-4 w-4" />
            Plans
          </TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current">Current Password</Label>
                <input
                  id="current"
                  type="password"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new">New Password</Label>
                <input
                  id="new"
                  type="password"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Two-factor authentication is currently disabled.
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose which emails you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                'Product updates and news',
                'Account activity alerts',
                'Marketing and promotions',
                'Security notifications',
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm font-medium">{item}</span>
                  <div className="h-5 w-9 rounded-full bg-primary/20 relative cursor-pointer">
                    <div className="absolute top-1 right-1 h-3 w-3 rounded-full bg-primary" />
                  </div>
                </div>
              ))}
              <Button className="mt-4">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                You are currently on the Free plan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg">Pro Plan</p>
                  <p className="text-sm text-muted-foreground">$19/month billed annually</p>
                </div>
                <Button>Upgrade Now</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
