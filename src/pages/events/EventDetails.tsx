
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FadeIn } from '@/components/animations/FadeIn';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { CalendarDays, ChevronLeft, Clock, MapPin, Award, Users, User } from 'lucide-react';
import { toast } from 'sonner';

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
  requirements: string[] | null;
  prize_pool: any;
  registration_deadline: string | null;
  creator_name?: string;
};

const EventDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userTeam, setUserTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!slug) return;
      
      setLoading(true);
      
      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*, profiles:creator_id(full_name)')
        .eq('slug', slug)
        .single();
      
      if (eventError) {
        console.error('Error fetching event:', eventError);
        toast.error('Failed to load event details');
        navigate('/events');
        return;
      }
      
      if (!eventData) {
        navigate('/events');
        return;
      }
      
      setEvent({
        ...eventData,
        creator_name: eventData.profiles?.full_name || 'Unknown'
      });
      
      // If user is logged in, check if they're registered
      if (user) {
        // Check if user is already registered
        const { data: regData } = await supabase
          .from('event_registrations')
          .select('*')
          .eq('event_id', eventData.id)
          .eq('user_id', user.id)
          .single();
        
        setIsRegistered(!!regData);
        
        // Check if user is in a team for this event
        const { data: teamData } = await supabase
          .from('team_members')
          .select('teams(*)')
          .eq('user_id', user.id)
          .eq('teams.event_id', eventData.id);
        
        if (teamData && teamData.length > 0) {
          setUserTeam(teamData[0].teams);
        }
      }
      
      // Fetch teams for this event
      const { data: teamData } = await supabase
        .from('teams')
        .select('*')
        .eq('event_id', eventData.id);
      
      if (teamData) {
        setTeams(teamData);
      }
      
      // Fetch registrations count
      const { data: regCountData } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('event_id', eventData.id);
      
      if (regCountData) {
        setRegistrations(regCountData);
      }
      
      setLoading(false);
    };
    
    fetchEventDetails();
  }, [slug, user, navigate]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    
    if (!event) return;
    
    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: event.id,
          user_id: user.id,
          registered_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setIsRegistered(true);
      toast.success('Successfully registered for this event!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to register');
      console.error('Registration error:', error);
    }
  };
  
  const handleCreateTeam = () => {
    if (event) {
      navigate(`/teams/create?event=${event.id}`);
    }
  };
  
  const handleJoinTeam = () => {
    if (event) {
      navigate(`/teams?event=${event.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2 mx-auto mb-4"></div>
            <p>Loading event details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p>Event not found</p>
            <Button className="mt-4" onClick={() => navigate('/events')}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Events
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isLiveEvent = new Date(event.start_date) <= new Date() && new Date(event.end_date) >= new Date();
  const isUpcomingEvent = new Date(event.start_date) > new Date();
  const isPastEvent = new Date(event.end_date) < new Date();
  const canRegister = isUpcomingEvent && (!event.registration_deadline || new Date(event.registration_deadline) > new Date());
  
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const formattedDateRange = `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section 
          className="py-16 md:py-24 bg-gradient-to-b from-secondary/30 to-background relative"
          style={{
            backgroundImage: event.cover_image ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(${event.cover_image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="section-container relative z-10">
            <Button 
              variant="ghost" 
              className="mb-6" 
              onClick={() => navigate('/events')}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Events
            </Button>
            
            <FadeIn>
              <div className="flex items-center gap-2 mb-3">
                {isLiveEvent && (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <div className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse"></div>
                    Live Now
                  </div>
                )}
                {isUpcomingEvent && (
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Upcoming
                  </div>
                )}
                {isPastEvent && (
                  <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Ended
                  </div>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{event.title}</h1>
              
              <div className="flex flex-wrap gap-4 mb-6 text-muted-foreground">
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {formattedDateRange}
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  {registrations.length} Registered
                </div>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Organized by {event.creator_name}
                </div>
              </div>
              
              {user && userType === 'candidate' && (
                <div className="flex flex-wrap gap-4 mt-6">
                  {!isRegistered && canRegister && (
                    <Button onClick={handleRegister}>
                      Register Now
                    </Button>
                  )}
                  {isRegistered && !userTeam && !isPastEvent && (
                    <>
                      <Button onClick={handleCreateTeam}>
                        Create Team
                      </Button>
                      <Button variant="outline" onClick={handleJoinTeam}>
                        Join Team
                      </Button>
                    </>
                  )}
                  {userTeam && (
                    <Button onClick={() => navigate(`/teams/${userTeam.id}`)}>
                      View My Team
                    </Button>
                  )}
                </div>
              )}
              
              {!user && canRegister && (
                <Button onClick={() => navigate('/auth/login')}>
                  Sign In to Register
                </Button>
              )}
              
              {isRegistered && (
                <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                  You're registered for this event!
                </div>
              )}
            </FadeIn>
          </div>
        </section>
        
        {/* Event Details */}
        <section className="py-16">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Tabs defaultValue="details">
                  <TabsList className="mb-6">
                    <TabsTrigger value="details">Event Details</TabsTrigger>
                    <TabsTrigger value="teams">Teams ({teams.length})</TabsTrigger>
                    {/* Additional tabs based on functionality */}
                  </TabsList>
                  
                  <TabsContent value="details">
                    <Card>
                      <CardHeader>
                        <CardTitle>About this Event</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose dark:prose-invert max-w-none">
                          <div className="mb-8 whitespace-pre-line">
                            {event.description}
                          </div>
                          
                          {event.requirements && event.requirements.length > 0 && (
                            <div className="mb-8">
                              <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                              <ul className="list-disc pl-5 space-y-1">
                                {event.requirements.map((req, i) => (
                                  <li key={i}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {event.prize_pool && (
                            <div className="mb-8">
                              <h3 className="text-lg font-semibold mb-2">Prizes</h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {event.prize_pool.first && (
                                  <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-center">1st Place</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center font-bold text-lg">
                                      {event.prize_pool.first}
                                    </CardContent>
                                  </Card>
                                )}
                                {event.prize_pool.second && (
                                  <Card className="bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-center">2nd Place</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center font-bold text-lg">
                                      {event.prize_pool.second}
                                    </CardContent>
                                  </Card>
                                )}
                                {event.prize_pool.third && (
                                  <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-center">3rd Place</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center font-bold text-lg">
                                      {event.prize_pool.third}
                                    </CardContent>
                                  </Card>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="teams">
                    <Card>
                      <CardHeader>
                        <CardTitle>Participating Teams</CardTitle>
                        <CardDescription>
                          {teams.length} {teams.length === 1 ? 'team has' : 'teams have'} registered for this event
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {teams.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {teams.map(team => (
                              <Card key={team.id} className="overflow-hidden">
                                <CardHeader className="pb-2">
                                  <CardTitle>{team.name}</CardTitle>
                                  <CardDescription>
                                    {team.looking_for_members ? 'Recruiting members' : 'Team complete'}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm line-clamp-2 mb-4">{team.description}</p>
                                  <Button 
                                    size="sm" 
                                    onClick={() => navigate(`/teams/${team.id}`)}
                                    className="w-full"
                                  >
                                    View Team
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground mb-4">No teams have registered yet</p>
                            {user && isRegistered && !userTeam && !isPastEvent && (
                              <Button onClick={handleCreateTeam}>
                                Create First Team
                              </Button>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Event Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Date & Time</p>
                      <div className="flex items-start">
                        <CalendarDays className="h-5 w-5 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p>{format(new Date(event.start_date), 'MMMM d, yyyy')}</p>
                          <p className="text-muted-foreground">
                            {format(new Date(event.start_date), 'h:mm a')} - {format(new Date(event.end_date), 'h:mm a')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Team Size</p>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                        <p>Up to {event.max_team_size} members per team</p>
                      </div>
                    </div>
                    
                    {event.registration_deadline && (
                      <div>
                        <p className="text-sm font-medium mb-1">Registration Deadline</p>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                          <p>{format(new Date(event.registration_deadline), 'MMMM d, yyyy')}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4">
                      {user && userType === 'candidate' && !isRegistered && canRegister && (
                        <Button onClick={handleRegister} className="w-full">
                          Register Now
                        </Button>
                      )}
                      
                      {isRegistered && !userTeam && !isPastEvent && (
                        <div className="space-y-2">
                          <Button onClick={handleCreateTeam} className="w-full">
                            Create Team
                          </Button>
                          <Button variant="outline" onClick={handleJoinTeam} className="w-full">
                            Join Team
                          </Button>
                        </div>
                      )}
                      
                      {userTeam && (
                        <Button onClick={() => navigate(`/teams/${userTeam.id}`)} className="w-full">
                          View My Team
                        </Button>
                      )}
                      
                      {!user && canRegister && (
                        <Button onClick={() => navigate('/auth/login')} className="w-full">
                          Sign In to Register
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetails;
