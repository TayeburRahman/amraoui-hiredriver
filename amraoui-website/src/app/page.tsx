import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout, Shield, Zap, BarChart, Users, Settings } from 'lucide-react';

const features = [
  {
    title: 'Modern UI/UX',
    description: 'Beautifully designed components with dark mode and responsive layouts.',
    icon: Layout,
  },
  {
    title: 'Role-Based Access',
    description: 'Granular permissions for users and administrators out of the box.',
    icon: Shield,
  },
  {
    title: 'Blazing Fast',
    description: 'Built with Next.js 15 and optimized for maximum performance.',
    icon: Zap,
  },
  {
    title: 'Advanced Analytics',
    description: 'Real-time insights and data visualization for your business.',
    icon: BarChart,
  },
  {
    title: 'Team Management',
    description: 'Collaborate effectively with your team members in one place.',
    icon: Users,
  },
  {
    title: 'Easy Integration',
    description: 'Ready to be connected to any backend with Axios pre-configured.',
    icon: Settings,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build and scale your SaaS application with ease.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-1 w-10 bg-primary/30 rounded-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-sm">
            © 2026 Amraoui. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
