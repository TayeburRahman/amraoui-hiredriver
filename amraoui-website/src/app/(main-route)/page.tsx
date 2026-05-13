import { Hero } from '@/components/landing/hero';
import { Solutions } from '@/components/landing/solutions';


export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Solutions />
    </main>
  );
}
