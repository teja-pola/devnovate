
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/animations/FadeIn';

const events = [
  {
    id: 1,
    title: 'Global AI Hackathon 2023',
    date: 'Dec 15-17, 2023',
    location: 'Virtual',
    image: 'https://placehold.co/800x600/f8fafc/cbd5e1?text=AI+Hackathon',
    organizer: 'TechCorp',
    attendees: 1200,
    status: 'Upcoming'
  },
  {
    id: 2,
    title: 'Web3 Innovation Summit',
    date: 'Jan 10-12, 2024',
    location: 'New York, NY',
    image: 'https://placehold.co/800x600/f8fafc/cbd5e1?text=Web3+Summit',
    organizer: 'Blockchain Foundation',
    attendees: 850,
    status: 'Registration Open'
  },
  {
    id: 3,
    title: 'Mobile Dev Challenge',
    date: 'Feb 5-7, 2024',
    location: 'Hybrid',
    image: 'https://placehold.co/800x600/f8fafc/cbd5e1?text=Mobile+Challenge',
    organizer: 'App Alliance',
    attendees: 650,
    status: 'Coming Soon'
  }
];

export const EventsShowcase = () => {
  return (
    <section id="events" className="py-20">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <FadeIn className="max-w-2xl">
            <h2 className="heading-lg mb-4">Upcoming & Featured Events</h2>
            <p className="text-muted-foreground text-lg">
              Discover exciting hackathons, competitions, and tech events from around the world. 
              Register, form your team, and showcase your skills.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.2} className="mt-6 md:mt-0">
            <Button 
              variant="ghost" 
              icon={<ArrowRight className="h-4 w-4" />}
              iconPosition="right"
              asChild
            >
              <Link to="/events">View All Events</Link>
            </Button>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <FadeIn key={event.id} delay={0.1 * index} direction="up">
              <div className="glass-panel overflow-hidden group h-full flex flex-col">
                <div className="relative overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-primary text-white text-xs font-semibold py-1 px-2 rounded">
                    {event.status}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-1">
                      {event.date} • {event.location}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Organized by {event.organizer}
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-4">
                    <span className="font-medium">{event.attendees.toLocaleString()}</span> attendees registered
                  </div>
                  
                  <div className="mt-auto">
                    <Button 
                      variant="primary" 
                      className="w-full"
                      asChild
                    >
                      <Link to={`/events/${event.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
