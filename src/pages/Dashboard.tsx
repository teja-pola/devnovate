
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, Award, Calendar, Briefcase, CalendarDays, ExternalLink } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { supabase } from '@/integrations/supabase/client';
import { supabaseExtended } from '@/integrations/supabase/extendedClient';
import { format } from 'date-fns';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, userType, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hostedEvents, setHostedEvents] = useState<any[]>([]);
  const [participatingEvents, setParticipatingEvents] = useState<any[]>([]);
  const [userTeams, setUserTeams] = useState<any[]>([]);
  const [postedJobs, setPostedJobs] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        if (userType === 'candidate') {
          // Fetch hosted events (events created by user)
          const { data: createdEvents } = await supabase
            .from('events')
            .select('*')
            .eq('creator_id', user.id)
            .order('created_at', { ascending: false });
            
          setHostedEvents(createdEvents || []);
          
          // Fetch events the user is participating in
          const { data: registrations } = await supabaseExtended
            .from('event_registrations')
            .select('event_id')
            .eq('user_id', user.id);
            
          if (registrations && registrations.length > 0) {
            const eventIds = registrations.map(reg => reg.event_id);
            
            const { data: participatingEventData } = await supabase
              .from('events')
              .select('*')
              .in('id', eventIds)
              .order('start_date', { ascending: true });
              
            setParticipatingEvents(participatingEventData || []);
          }
          
          // Fetch user's teams
          const { data: teams } = await supabase
            .from('team_members')
            .select('teams(*)')
            .eq('user_id', user.id);
            
          if (teams) {
            setUserTeams(teams.map(t => t.teams));
          }
          
          // Fetch upcoming events
          const now = new Date().toISOString();
          const { data: upcoming } = await supabase
            .from('events')
            .select('*')
            .gt('start_date', now)
            .eq('status', 'published')
            .order('start_date', { ascending: true })
            .limit(5);
            
          setUpcomingEvents(upcoming || []);
          
          // Fetch live events
          const { data: live } = await supabase
            .from('events')
            .select('*')
            .lte('start_date', now)
            .gte('end_date', now)
            .eq('status', 'published')
            .order('end_date', { ascending: true })
            .limit(5);
            
          setLiveEvents(live || []);
          
          // Fetch available jobs
          const { data: jobs } = await supabase
            .from('jobs')
            .select('*')
            .eq('status', 'open')
            .order('created_at', { ascending: false })
            .limit(5);
            
          setAvailableJobs(jobs || []);
        } else if (userType === 'recruiter') {
          // Fetch jobs posted by the recruiter
          const { data: jobs } = await supabase
            .from('jobs')
            .select('*')
            .eq('poster_id', user.id)
            .order('created_at', { ascending: false });
            
          setPostedJobs(jobs || []);
          
          // Fetch upcoming events (for recruiters to see talent)
          const now = new Date().toISOString();
          const { data: upcoming } = await supabase
            .from('events')
            .select('*')
            .gt('start_date', now)
            .eq('status', 'published')
            .order('start_date', { ascending: true })
            .limit(5);
            
          setUpcomingEvents(upcoming || []);
          
          // Fetch live events (for recruiters to see talent)
          const { data: live } = await supabase
            .from('events')
            .select('*')
            .lte('start_date', now)
            .gte('end_date', now)
            .eq('status', 'published')
            .order('end_date', { ascending: true })
            .limit(5);
            
          setLiveEvents(live || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchDashboardData();
    }
  }, [user, userType]);

  if (authLoading || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-secondary/20">
          <div className="section-container">
            <FadeIn className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome, {user?.user_metadata?.full_name || 'User'}</h1>
              <p className="text-lg text-muted-foreground mb-8">
                {userType === 'candidate' 
                  ? 'Manage your hackathons, teams, and projects all in one place.'
                  : 'Manage your job postings and find talented developers.'}
              </p>
              <div className="flex flex-wrap gap-4">
                {userType === 'candidate' ? (
                  <>
                    <Button onClick={() => navigate('/events/create')}>
                      <Plus className="mr-2 h-4 w-4" /> Host Event
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/teams')}>
                      <Users className="mr-2 h-4 w-4" /> My Teams
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/projects')}>
                      <Award className="mr-2 h-4 w-4" /> My Projects
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => navigate('/jobs/create')}>
                      <Plus className="mr-2 h-4 w-4" /> Post Job
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/jobs')}>
                      <Briefcase className="mr-2 h-4 w-4" /> My Job Listings
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/events')}>
                      <Calendar className="mr-2 h-4 w-4" /> Browse Events
                    </Button>
                  </>
                )}
              </div>
            </FadeIn>
          </div>
        </section>
        
        <section className="py-16">
          <div className="section-container">
            <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
            
            {userType === 'candidate' ? (
              <Tabs defaultValue="events">
                <TabsList className="mb-6">
                  <TabsTrigger value="events">My Events</TabsTrigger>
                  <TabsTrigger value="teams">My Teams</TabsTrigger>
                  <TabsTrigger value="discover">Discover</TabsTrigger>
                </TabsList>
                
                <TabsContent value="events">
                  <div className="space-y-6">
                    {/* Hosted Events */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Hosted Events</h3>
                        <Button variant="outline" size="sm" onClick={() => navigate('/events/create')}>
                          <Plus className="mr-2 h-4 w-4" /> Host New Event
                        </Button>
                      </div>
                      
                      {hostedEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {hostedEvents.map(event => (
                            <Card key={event.id} className="overflow-hidden">
                              <div className="relative">
                                <img 
                                  src={event.cover_image || 'https://placehold.co/800x400/f8fafc/cbd5e1?text=Event+Image'} 
                                  alt={event.title} 
                                  className="w-full h-32 object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-primary text-white text-xs font-semibold py-1 px-2 rounded">
                                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </div>
                              </div>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{event.title}</CardTitle>
                                <CardDescription className="flex items-center text-sm">
                                  <CalendarDays className="h-4 w-4 mr-1" /> 
                                  {format(new Date(event.start_date), 'MMM d')} - {format(new Date(event.end_date), 'MMM d, yyyy')}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => navigate(`/events/${event.slug}`)}
                                >
                                  Manage Event
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Card>
                          <CardContent className="text-center py-8">
                            <p className="text-muted-foreground mb-4">You haven't created any events yet</p>
                            <Button onClick={() => navigate('/events/create')}>
                              <Plus className="mr-2 h-4 w-4" /> Host Your First Event
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    
                    {/* Participating Events */}
                    <div className="mt-8">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Participating Events</h3>
                        <Button variant="outline" size="sm" onClick={() => navigate('/events')}>
                          Find More Events
                        </Button>
                      </div>
                      
                      {participatingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {participatingEvents.map(event => (
                            <Card key={event.id} className="overflow-hidden">
                              <div className="relative">
                                <img 
                                  src={event.cover_image || 'https://placehold.co/800x400/f8fafc/cbd5e1?text=Event+Image'} 
                                  alt={event.title} 
                                  className="w-full h-32 object-cover"
                                />
                                {new Date(event.start_date) > new Date() ? (
                                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold py-1 px-2 rounded">
                                    Upcoming
                                  </div>
                                ) : new Date(event.end_date) < new Date() ? (
                                  <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs font-semibold py-1 px-2 rounded">
                                    Ended
                                  </div>
                                ) : (
                                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold py-1 px-2 rounded flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-white mr-1 animate-pulse"></div>
                                    Live
                                  </div>
                                )}
                              </div>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{event.title}</CardTitle>
                                <CardDescription className="flex items-center text-sm">
                                  <CalendarDays className="h-4 w-4 mr-1" /> 
                                  {format(new Date(event.start_date), 'MMM d')} - {format(new Date(event.end_date), 'MMM d, yyyy')}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => navigate(`/events/${event.slug}`)}
                                >
                                  View Event
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Card>
                          <CardContent className="text-center py-8">
                            <p className="text-muted-foreground mb-4">You're not participating in any events yet</p>
                            <Button onClick={() => navigate('/events')}>
                              Browse Events
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="teams">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">My Teams</h3>
                    <Button variant="outline" size="sm" onClick={() => navigate('/teams/create')}>
                      <Plus className="mr-2 h-4 w-4" /> Create Team
                    </Button>
                  </div>
                  
                  {userTeams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userTeams.map(team => (
                        <Card key={team.id}>
                          <CardHeader>
                            <CardTitle>{team.name}</CardTitle>
                            <CardDescription>
                              {team.looking_for_members ? 'Recruiting members' : 'Team complete'}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm line-clamp-3 mb-4">{team.description}</p>
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => navigate(`/teams/${team.id}`)}
                            >
                              Manage Team
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p className="text-muted-foreground mb-4">You haven't joined any teams yet</p>
                        <Button onClick={() => navigate('/teams')}>
                          Find Teams
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="discover">
                  <div className="space-y-10">
                    {/* Live Events */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                          Live Events
                        </h3>
                        <Button variant="outline" size="sm" onClick={() => navigate('/events')}>
                          View All
                        </Button>
                      </div>
                      
                      {liveEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {liveEvents.map(event => (
                            <Card key={event.id} className="overflow-hidden">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{event.title}</CardTitle>
                                <CardDescription className="flex items-center text-sm">
                                  Ends on {format(new Date(event.end_date), 'MMM d, yyyy')}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <Button 
                                  size="sm"
                                  className="w-full"
                                  onClick={() => navigate(`/events/${event.slug}`)}
                                >
                                  Join Now
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Card>
                          <CardContent className="text-center py-8">
                            <p className="text-muted-foreground">No live events at the moment</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    
                    {/* Upcoming Events */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Upcoming Events</h3>
                        <Button variant="outline" size="sm" onClick={() => navigate('/events')}>
                          View All
                        </Button>
                      </div>
                      
                      {upcomingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {upcomingEvents.map(event => (
                            <Card key={event.id} className="overflow-hidden">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{event.title}</CardTitle>
                                <CardDescription className="flex items-center text-sm">
                                  Starts on {format(new Date(event.start_date), 'MMM d, yyyy')}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => navigate(`/events/${event.slug}`)}
                                >
                                  Register
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Card>
                          <CardContent className="text-center py-8">
                            <p className="text-muted-foreground">No upcoming events</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    
                    {/* Available Jobs */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Available Jobs</h3>
                        <Button variant="outline" size="sm" onClick={() => navigate('/jobs')}>
                          View All
                        </Button>
                      </div>
                      
                      {availableJobs.length > 0 ? (
                        <div className="space-y-4">
                          {availableJobs.map(job => (
                            <Card key={job.id} className="overflow-hidden hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-semibold text-lg">{job.title}</h4>
                                    <p className="text-muted-foreground">{job.company_name} • {job.location}</p>
                                  </div>
                                  <Button 
                                    size="sm"
                                    onClick={() => navigate(`/jobs/${job.id}`)}
                                  >
                                    Apply
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Card>
                          <CardContent className="text-center py-8">
                            <p className="text-muted-foreground">No jobs available at the moment</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              // Recruiter Dashboard
              <Tabs defaultValue="jobs">
                <TabsList className="mb-6">
                  <TabsTrigger value="jobs">My Job Listings</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                </TabsList>
                
                <TabsContent value="jobs">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Posted Jobs</h3>
                      <Button onClick={() => navigate('/jobs/create')}>
                        <Plus className="mr-2 h-4 w-4" /> Post Job
                      </Button>
                    </div>
                    
                    {postedJobs.length > 0 ? (
                      <div className="space-y-4">
                        {postedJobs.map(job => (
                          <Card key={job.id} className="overflow-hidden">
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div>
                                  <h4 className="font-semibold text-lg">{job.title}</h4>
                                  <p className="text-muted-foreground mb-2">{job.company_name} • {job.location}</p>
                                  <div className="flex gap-2 mb-4">
                                    <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">
                                      {job.type}
                                    </span>
                                    <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">
                                      {job.experience_level}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs ${
                                      job.status === 'open' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="outline"
                                    onClick={() => navigate(`/jobs/${job.id}/applications`)}
                                  >
                                    View Applications
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    onClick={() => navigate(`/jobs/${job.id}/edit`)}
                                  >
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="text-center py-8">
                          <p className="text-muted-foreground mb-4">You haven't posted any jobs yet</p>
                          <Button onClick={() => navigate('/jobs/create')}>
                            <Plus className="mr-2 h-4 w-4" /> Post Your First Job
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="events">
                  <div className="space-y-10">
                    {/* Live Events */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                          Live Events
                        </h3>
                        <Button variant="outline" size="sm" onClick={() => navigate('/events')}>
                          View All
                        </Button>
                      </div>
                      
                      {liveEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {liveEvents.map(event => (
                            <Card key={event.id} className="overflow-hidden">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{event.title}</CardTitle>
                                <CardDescription className="flex items-center text-sm">
                                  Ends on {format(new Date(event.end_date), 'MMM d, yyyy')}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <Button 
                                  size="sm"
                                  className="w-full"
                                  onClick={() => navigate(`/events/${event.slug}`)}
                                >
                                  Scout Talent
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Card>
                          <CardContent className="text-center py-8">
                            <p className="text-muted-foreground">No live events at the moment</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    
                    {/* Upcoming Events */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Upcoming Events</h3>
                        <Button variant="outline" size="sm" onClick={() => navigate('/events')}>
                          View All
                        </Button>
                      </div>
                      
                      {upcomingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {upcomingEvents.map(event => (
                            <Card key={event.id} className="overflow-hidden">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{event.title}</CardTitle>
                                <CardDescription className="flex items-center text-sm">
                                  Starts on {format(new Date(event.start_date), 'MMM d, yyyy')}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => navigate(`/events/${event.slug}`)}
                                >
                                  View Details
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Card>
                          <CardContent className="text-center py-8">
                            <p className="text-muted-foreground">No upcoming events</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
