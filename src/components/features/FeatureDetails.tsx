
import { 
  Calendar, 
  Users, 
  Award, 
  FileText, 
  Briefcase, 
  BarChart3,
  MousePointer,
  Github,
  Search,
  Upload,
  CheckCircle,
  UserCheck,
  PanelRight,
  GraduationCap,
  Check
} from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/CustomButton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const featureDetails = [
  {
    icon: <Calendar className="h-16 w-16 text-primary" />,
    title: 'Easy Event Setup',
    description: 'Create hackathons and events in minutes with customizable landing pages, registration forms, and branding options.',
    details: [
      { icon: <PanelRight size={20} />, text: 'Drag-and-drop landing page builder' },
      { icon: <CheckCircle size={20} />, text: 'Customizable registration forms' },
      { icon: <Calendar size={20} />, text: 'Scheduling tools and automated reminders' },
      { icon: <Check size={20} />, text: 'Custom branding options and themes' }
    ],
    demoImage: '/placeholder.svg'
  },
  {
    icon: <MousePointer className="h-16 w-16 text-primary" />,
    title: 'One-Click Registrations',
    description: 'Streamline the registration process with social authentication, drastically reducing drop-off rates and improving user experience.',
    details: [
      { icon: <UserCheck size={20} />, text: 'Sign up with Google, GitHub, or LinkedIn' },
      { icon: <Check size={20} />, text: 'Simplified form completion' },
      { icon: <Check size={20} />, text: 'Automatic profile creation' },
      { icon: <Check size={20} />, text: 'GDPR-compliant data handling' }
    ],
    demoImage: '/placeholder.svg'
  },
  {
    icon: <Users className="h-16 w-16 text-primary" />,
    title: 'Smart Team Formation',
    description: 'Find the perfect teammates or join existing teams based on skills, interests, and project ideas.',
    details: [
      { icon: <Search size={20} />, text: 'Skill-based team matching algorithm' },
      { icon: <Users size={20} />, text: 'Team discovery and requests' },
      { icon: <Check size={20} />, text: 'Project idea collaboration boards' },
      { icon: <Check size={20} />, text: 'Team chat and coordination tools' }
    ],
    demoImage: '/placeholder.svg'
  },
  {
    icon: <Award className="h-16 w-16 text-primary" />,
    title: 'Project Submissions & Judging',
    description: 'Submit projects with GitHub repos and demo links. Multi-stage judging with customizable criteria.',
    details: [
      { icon: <Github size={20} />, text: 'GitHub repository integration' },
      { icon: <Upload size={20} />, text: 'Demo link and video submissions' },
      { icon: <Award size={20} />, text: 'Customizable judging criteria' },
      { icon: <Check size={20} />, text: 'Public and private evaluation options' }
    ],
    demoImage: '/placeholder.svg'
  },
  {
    icon: <FileText className="h-16 w-16 text-primary" />,
    title: 'Resume-Based Registrations',
    description: 'Upload resumes and portfolios. Organizers can filter participants based on skills and experience.',
    details: [
      { icon: <Upload size={20} />, text: 'Resume and portfolio uploads' },
      { icon: <Search size={20} />, text: 'AI-powered skill extraction' },
      { icon: <Check size={20} />, text: 'Advanced filtering for organizers' },
      { icon: <Check size={20} />, text: 'Privacy controls for participants' }
    ],
    demoImage: '/placeholder.svg'
  },
  {
    icon: <Briefcase className="h-16 w-16 text-primary" />,
    title: 'Recruitment & Hiring',
    description: 'Connect directly with companies offering internships and jobs. Showcase your skills to potential employers.',
    details: [
      { icon: <Briefcase size={20} />, text: 'Job and internship board' },
      { icon: <GraduationCap size={20} />, text: 'Talent showcase for participants' },
      { icon: <Check size={20} />, text: 'Direct messaging with recruiters' },
      { icon: <Check size={20} />, text: 'Automated application tracking' }
    ],
    demoImage: '/placeholder.svg'
  }
];

export const FeatureDetails = () => {
  return (
    <section className="py-16 bg-background">
      <div className="section-container">
        <div className="grid grid-cols-1 gap-12">
          {featureDetails.map((feature, index) => (
            <FadeIn key={index} delay={0.1 * index} direction="up">
              <div className={`flex flex-col lg:flex-row gap-8 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <div className="mb-6 inline-flex items-center justify-center rounded-lg bg-primary/10 p-4">
                    {feature.icon}
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{feature.title}</h2>
                  <p className="text-lg text-muted-foreground mb-6">{feature.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {feature.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="text-primary mt-1">{detail.icon}</div>
                        <p>{detail.text}</p>
                      </div>
                    ))}
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="primary">See How It Works</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>{feature.title}</DialogTitle>
                        <DialogDescription>
                          A closer look at how this feature transforms your event experience.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <img 
                          src={feature.demoImage} 
                          alt={`${feature.title} demonstration`} 
                          className="w-full h-auto rounded-md"
                        />
                        <p className="mt-4 text-muted-foreground">
                          This feature is available on all paid plans and can be customized to fit your specific needs.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                  <Card className="w-full max-w-md overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="bg-primary/5 border-b border-border/50 p-6">
                      <CardTitle className="flex items-center gap-3">
                        <span className="text-primary">{feature.icon}</span>
                        <span className="text-lg">{feature.title}</span>
                      </CardTitle>
                      <CardDescription>Preview</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <img 
                        src={feature.demoImage} 
                        alt={`${feature.title} preview`} 
                        className="w-full h-auto aspect-video object-cover"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {index < featureDetails.length - 1 && (
                <div className="border-t border-border/30 my-8"></div>
              )}
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
