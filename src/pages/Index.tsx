
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { EventsShowcase } from '@/components/home/EventsShowcase';
import { CallToAction } from '@/components/home/CallToAction';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <EventsShowcase />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
