
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FeatureDetails } from '@/components/features/FeatureDetails';
import { CallToAction } from '@/components/home/CallToAction';
import { FadeIn } from '@/components/animations/FadeIn';

const Features = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-secondary/20">
          <div className="section-container">
            <FadeIn className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Platform Features</h1>
              <p className="text-lg text-muted-foreground">
                Explore the powerful tools that make Devnovate the ultimate platform for hackathons, 
                team formation, project submissions, and recruitment.
              </p>
            </FadeIn>
          </div>
        </section>
        
        <FeatureDetails />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Features;
