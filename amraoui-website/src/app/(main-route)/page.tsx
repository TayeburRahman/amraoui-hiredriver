import { Hero } from '@/components/landing/hero';
import { Solutions } from '@/components/landing/solutions';
import { WhyChoose } from '@/components/landing/why-choose';


export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Solutions />
      <WhyChoose />
    </main>
  );
}
