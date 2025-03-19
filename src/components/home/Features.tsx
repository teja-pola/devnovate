
import { 
  Calendar, 
  Users, 
  Award, 
  FileText, 
  Briefcase, 
  BarChart3 
} from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/CustomButton';
import { ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <Calendar className="h-10 w-10 text-primary" />,
    title: 'Easy Event Setup',
    description: 'Create hackathons and events in minutes with customizable landing pages, registration forms, and branding options.'
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: 'Smart Team Formation',
    description: 'Find the perfect teammates or join existing teams based on skills, interests, and project ideas.'
  },
  {
    icon: <Award className="h-10 w-10 text-primary" />,
    title: 'Project Submissions & Judging',
    description: 'Submit projects with GitHub repos and demo links. Multi-stage judging with customizable criteria.'
  },
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: 'Resume-Based Registrations',
    description: 'Upload resumes and portfolios. Organizers can filter participants based on skills and experience.'
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: 'Recruitment & Hiring',
    description: 'Connect directly with companies offering internships and jobs. Showcase your skills to potential employers.'
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-primary" />,
    title: 'Advanced Analytics',
    description: 'Track event performance, participant engagement, and recruitment metrics with detailed dashboards.'
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-secondary/30">
      <div className="section-container">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-lg mb-4">Powerful Features for Every Stage</h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to host successful events and connect talent with opportunities, all in one platform.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FadeIn key={index} delay={0.1 * index} direction="up">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 h-full border border-border/50">
                <div className="mb-5 inline-flex items-center justify-center rounded-lg bg-primary/10 p-3">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        
        <FadeIn className="mt-12 text-center">
          <Button 
            variant="outline" 
            size="lg" 
            icon={<ArrowRight className="h-4 w-4" />}
            iconPosition="right"
            asChild
          >
            <Link to="/features">Explore All Features</Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
};
