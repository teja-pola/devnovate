
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/CustomButton';
import { FadeIn } from '@/components/animations/FadeIn';

export const CallToAction = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/30 -z-10" />
      
      <div className="section-container">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="heading-lg mb-6">Connecting Skills with Opportunities.</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join a network of job seekers, employers, and recruiters on Devnovate. Connect, grow, and find the right opportunities to build your future.</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Button 
                variant="primary" 
                size="lg" 
                icon={<ArrowRight className="h-4 w-4" />}
                iconPosition="right"
                asChild
              >
                <Link to="/register">Post Job</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild
              >
                <Link to="/contact">Explore Opportunities</Link>
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
            Your dream job awaits! 🚀💼 Take the leap and make it yours. 🌟</p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
