
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
            <h2 className="heading-lg mb-6">Ready to Innovate and Connect?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of innovators, creators, and recruiters on Devnovate. 
              Host events, build your team, showcase your skills, and find opportunities that match your passion.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
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
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              No credit card required. Free plan includes up to 100 participants per event.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
