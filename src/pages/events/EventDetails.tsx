import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Link2, Users, MapPin, Clock } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { format, fromUnixTime } from 'date-fns';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
// Import the extended client at the top of the file
import { supabase } from '@/integrations/supabase/client';
import { supabaseExtended } from '@/integrations/supabase/extendedClient';

const EventDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!slug) return;
      
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('slug', slug)
          .single();
        
        if (error) throw error;
        
        setEvent(data);
      } catch (error: any) {
        console.error('Error fetching event:', error);
        toast.error(error.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [slug]);

  useEffect(() => {
    if (!event) return;
    checkIfUserIsRegistered();
  }, [event, user]);

  const checkIfUserIsRegistered = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabaseExtended
        .from('event_registrations')
        .select('*')
        .eq('event_id', event?.id)
        .eq('user_id', user.id)
        .single();
      
      setIsRegistered(!!data);
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      toast.error('You must be logged in to register for an event');
      return;
    }

    if (!event) return;
    
    try {
      setRegistrationLoading(true);
      
      const { error } = await supabaseExtended
        .from('event_registrations')
        .insert({
          event_id: event.id,
          user_id: user.id
        });
      
      if (error) throw error;
      
      setIsRegistered(true);
      toast.success('Successfully registered for the event!');
    } catch (error: any) {
      console.error('Error registering for event:', error);
      toast.error(error.message || 'Failed to register for the event');
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!user || !event) return;
    
    try {
      setRegistrationLoading(true);
      
      const { error } = await supabaseExtended
        .from('event_registrations')
        .delete()
        .eq('event_id', event.id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setIsRegistered(false);
      toast.success('Registration cancelled');
    } catch (error: any) {
      console.error('Error cancelling registration:', error);
      toast.error(error.message || 'Failed to cancel registration');
    } finally {
      setRegistrationLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Event Not Found</h2>
          <p className="text-muted-foreground">Sorry, we couldn't find the event you were looking for.</p>
          <Button onClick={() => navigate('/events')}>Browse Events</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="relative py-16 md:py-24 bg-secondary/20 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-primary-foreground to-transparent z-0"></div>
          <div className="section-container relative z-10">
            <FadeIn className="max-w-4xl mx-auto">
              <Card className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={event.cover_image || 'https://placehold.co/1200x400/f8fafc/cbd5e1?text=Event+Image'} 
                    alt={event.title} 
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {new Date(event.start_date) > new Date() ? (
                      <Badge variant="secondary">Upcoming</Badge>
                    ) : new Date(event.end_date) < new Date() ? (
                      <Badge variant="destructive">Ended</Badge>
                    ) : (
                      <Badge variant="outline">Live</Badge>
                    )}
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-3xl font-bold">{event.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    {format(new Date(event.start_date), 'MMM d, yyyy')} - {format(new Date(event.end_date), 'MMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      Virtual Event
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      Max Team Size: {event.max_team_size}
                    </div>
                    {event.registration_deadline && (
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        Registration Deadline: {format(new Date(event.registration_deadline), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>
                  <p className="text-lg">{event.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      {isRegistered ? (
                        <Badge variant="outline">Registered</Badge>
                      ) : (
                        <Badge variant="secondary">Not Registered</Badge>
                      )}
                    </div>
                    <div>
                      {user ? (
                        isRegistered ? (
                          <Button 
                            variant="destructive"
                            disabled={registrationLoading}
                            onClick={handleCancelRegistration}
                          >
                            {registrationLoading ? 'Cancelling...' : 'Cancel Registration'}
                          </Button>
                        ) : (
                          <Button 
                            disabled={registrationLoading}
                            onClick={handleRegister}
                          >
                            {registrationLoading ? 'Registering...' : 'Register Now'}
                          </Button>
                        )
                      ) : (
                        <Button variant="outline" onClick={() => navigate('/auth/login')}>
                          Login to Register
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetails;
