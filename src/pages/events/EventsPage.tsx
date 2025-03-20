import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { CalendarDays, PlusCircle, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FadeIn } from '@/components/animations/FadeIn';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

type Event = {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  cover_image: string | null;
  creator_id: string;
  max_team_size: number;
  slug: string;
  creator_name?: string;
};

const EventsPage = () => {
  const [liveEvents, setLiveEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      
      const now = new Date().toISOString();
      
      // Fetch all events
      const { data: events, error } = await supabase
        .from('events')
        .select('*, profiles:creator_id(full_name)')
        .order('start_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
        return;
      }
      
      // Process events
      const formattedEvents = events.map(event => ({
        ...event,
        creator_name: event.profiles?.full_name || 'Unknown',
      }));
      
      // Filter events
      const live = formattedEvents.filter(event => 
        new Date(event.start_date) <= new Date() && 
        new Date(event.end_date) >= new Date() &&
        event.status === 'published'
      );
      
      const upcoming = formattedEvents.filter(event => 
        new Date(event.start_date) > new Date() &&
        event.status === 'published'
      );
      
      const past = formattedEvents.filter(event => 
        new Date(event.end_date) < new Date() &&
        event.status === 'published'
      );
      
      setLiveEvents(live);
      setUpcomingEvents(upcoming);
      setPastEvents(past);
      setLoading(false);
    };
    
    fetchEvents();
  }, []);

  const handleRegister = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />
      <main className="flex-grow w-full items-center">
        <section className="py-0 md:py-0 bg-secondary/20">
          <div className="section-container text-center">
            <FadeIn className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover Events</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Explore hackathons, coding competitions, and tech events. Find your next challenge or showcase your skills.
              </p>
              {user && userType === 'candidate' && (
                <div className="flex flex-wrap justify-center gap-4">
                  <Button onClick={() => navigate('/events/create')}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Host Event
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/teams')}>
                    <Users className="mr-2 h-4 w-4" /> Find Team
                  </Button>
                </div>
              )}
              {!user && (
                <Button onClick={() => navigate('/auth/signup')}>
                  Sign Up to Participate
                </Button>
              )}
            </FadeIn>
          </div>
        </section>
        
        <section className="py-0">
          <div className="section-container text-center">
            <Tabs defaultValue="live" className="w-full">
              <TabsList className="mb-8 justify-center">
                <TabsTrigger value="live" className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Live Events ({liveEvents.length})
                </TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming Events ({upcomingEvents.length})</TabsTrigger>
                <TabsTrigger value="past">Past Events ({pastEvents.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="live">
                {loading ? (
                  <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2"></div>
                  </div>
                ) : liveEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liveEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        onRegister={() => handleRegister(event.slug)}
                        buttonText="View Event"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">No Live Events</h3>
                    <p className="text-muted-foreground mb-4">There are currently no live events happening.</p>
                    {user && userType === 'candidate' && (
                      <Button onClick={() => navigate('/events/create')}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Host Your Own Event
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="upcoming">
                {loading ? (
                  <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2"></div>
                  </div>
                ) : upcomingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        onRegister={() => handleRegister(event.slug)}
                        buttonText="Register Now"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
                    <p className="text-muted-foreground mb-4">There are no upcoming events scheduled at the moment.</p>
                    {user && userType === 'candidate' && (
                      <Button onClick={() => navigate('/events/create')}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Host Your Own Event
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past">
                {loading ? (
                  <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2"></div>
                  </div>
                ) : pastEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        onRegister={() => handleRegister(event.slug)}
                        buttonText="View Results"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">No Past Events</h3>
                    <p className="text-muted-foreground mb-4">There are no past events to display.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const EventCard = ({ 
  event, 
  onRegister, 
  buttonText = "Register Now" 
}: { 
  event: Event; 
  onRegister: () => void; 
  buttonText?: string;
}) => {
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  
  const formattedDateRange = startDate.toLocaleDateString() === endDate.toLocaleDateString()
    ? `${format(startDate, 'MMM d, yyyy')}`
    : `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative">
        <img 
          src={event.cover_image || 'https://placehold.co/800x400/f8fafc/cbd5e1?text=Event+Image'} 
          alt={event.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-primary text-white text-xs font-semibold py-1 px-2 rounded">
          {new Date(event.start_date) > new Date() ? 'Upcoming' : 
           new Date(event.end_date) < new Date() ? 'Ended' : 'Live'}
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
        <CardDescription className="flex items-center text-sm">
          <CalendarDays className="h-4 w-4 mr-1" /> {formattedDateRange}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {event.description}
        </p>
        <div className="text-sm mb-3">
          <span className="font-medium">Team Size:</span> Up to {event.max_team_size} members
        </div>
        <div className="text-sm mb-4">
          <span className="font-medium">Organized by:</span> {event.creator_name}
        </div>
        <div className="mt-auto">
          <Button onClick={onRegister} className="w-full">
            {buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsPage;
