
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/CustomButton';
import { FadeIn } from '@/components/animations/FadeIn';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-32">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="section-container">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn delay={0.1}>
            <span className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-primary/10 text-primary">
              Introducing Devnovate
            </span>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <h1 className="heading-xl mt-6 mb-6 text-balance">
              Where Innovation Meets <span className="text-primary">Opportunity</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <p className="text-xl text-muted-foreground mb-8 mx-auto max-w-2xl text-balance">
              The ultimate platform for hosting hackathons, managing events, and connecting talent with organizations. Build your team, showcase your skills, and land your dream job.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button 
                variant="primary" 
                size="lg" 
                icon={<ArrowRight className="h-4 w-4" />}
                iconPosition="right"
                asChild
              >
                <Link to="/register">Get Started Free</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild
              >
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.5}>
            <div className="relative mx-auto max-w-5xl rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-secondary/50 absolute inset-0 z-10 backdrop-blur-md flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Button variant="primary" size="lg">
                  Watch Demo
                </Button>
              </div>
              
              <img 
                src="https://placehold.co/1200x675/f8fafc/cbd5e1?text=Devnovate+Platform+Demo&font=playfair-display" 
                alt="Devnovate Platform Screenshot" 
                className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </FadeIn>
          
          <FadeIn delay={0.6} className="mt-10">
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by leading organizations worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 opacity-70">
              {['Microsoft', 'Google', 'Amazon', 'Meta', 'IBM'].map((company) => (
                <span key={company} className="text-foreground/70 text-lg font-semibold">
                  {company}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
