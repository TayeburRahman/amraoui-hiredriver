'use client';

import { useAppSelector } from '@/hooks/redux';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    trending: 'up',
    icon: DollarSign,
  },
  {
    title: 'Subscriptions',
    value: '+2350',
    change: '+180.1%',
    trending: 'up',
    icon: Users,
  },
  {
    title: 'Active Now',
    value: '+573',
    change: '-19%',
    trending: 'down',
    icon: BarChart3,
  },
];

export default function DashboardHome() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Here is what&apos;s happening with your projects today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs mt-1">
                <span className={stat.trending === 'up' ? 'text-green-500 flex items-center' : 'text-red-500 flex items-center'}>
                  {stat.trending === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Your activity over the last 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md m-4">
            <span className="text-muted-foreground">Chart Visualization Placeholder</span>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              You have 3 unread notifications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      New project created
                    </p>
                    <p className="text-xs text-muted-foreground">
                      2 hours ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
