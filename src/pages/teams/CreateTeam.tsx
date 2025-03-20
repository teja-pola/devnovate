
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { supabaseExtended } from '@/integrations/supabase/extendedClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FadeIn } from '@/components/animations/FadeIn';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  event_id: z.string().min(1, 'Event is required'),
  looking_for_members: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface Event {
  id: string;
  title: string;
}

const CreateTeam = () => {
  const { user, userType, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [participatingEvents, setParticipatingEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  const searchParams = new URLSearchParams(location.search);
  const eventId = searchParams.get('event');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      event_id: eventId || '',
      looking_for_members: true,
    },
  });

  useEffect(() => {
    if (!authLoading && (!user || userType !== 'candidate')) {
      toast.error('Only candidates can create teams');
      navigate('/auth/login');
    }
  }, [user, userType, authLoading, navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      
      if (!user) return;
      
      try {
        const { data: registrations, error: regError } = await supabaseExtended
          .from('event_registrations')
          .select('event_id')
          .eq('user_id', user.id);
          
        if (regError) {
          console.error('Error fetching registrations:', regError);
          setLoading(false);
          return;
        }
        
        if (!registrations || registrations.length === 0) {
          setLoading(false);
          return;
        }
        
        const eventIds = registrations.map(reg => reg.event_id);
        
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('id, title')
          .in('id', eventIds)
          .eq('status', 'published')
          .gte('end_date', new Date().toISOString());
        
        if (eventError) {
          console.error('Error fetching events:', eventError);
          setLoading(false);
          return;
        }
        
        setEvents(eventData || []);
        setLoading(false);
      } catch (error) {
        console.error('Error in fetchEvents:', error);
        setLoading(false);
      }
    };
    
    if (user) {
      fetchEvents();
    }
  }, [user]);

  useEffect(() => {
    const fetchParticipatingEvents = async () => {
      if (!user) return;
      
      try {
        setEventsLoading(true);
        
        const { data: registrations } = await supabaseExtended
          .from('event_registrations')
          .select('event_id')
          .eq('user_id', user.id);
        
        if (registrations && registrations.length > 0) {
          const eventIds = registrations.map(reg => reg.event_id);
          
          const { data: events } = await supabase
            .from('events')
            .select('*')
            .in('id', eventIds)
            .order('start_date', { ascending: false });
          
          setParticipatingEvents(events || []);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
      } finally {
        setEventsLoading(false);
      }
    };
    
    if (user) {
      fetchParticipatingEvents();
    }
  }, [user]);

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error('You must be logged in to create a team');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: values.name,
          description: values.description,
          event_id: values.event_id,
          looking_for_members: values.looking_for_members,
        })
        .select()
        .single();

      if (teamError) throw teamError;
      
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: teamData.id,
          user_id: user.id,
          role: 'leader',
        });

      if (memberError) throw memberError;

      toast.success('Team created successfully');
      navigate(`/teams/${teamData.id}`);
    } catch (error: any) {
      console.error('Error creating team:', error);
      toast.error(error.message || 'Failed to create team');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading || eventsLoading) {
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
        <section className="py-16 md:py-24">
          <div className="section-container">
            <FadeIn>
              <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-6">Create a New Team</h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Form a team to participate in hackathons and coding events.
                </p>

                {participatingEvents.length === 0 ? (
                  <div className="bg-muted p-6 rounded-lg text-center">
                    <h3 className="text-xl font-semibold mb-2">No Eligible Events</h3>
                    <p className="text-muted-foreground mb-4">
                      You need to register for an event before you can create a team.
                    </p>
                    <Button onClick={() => navigate('/events')}>
                      Browse Events
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Team Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Code Ninjas" {...field} />
                            </FormControl>
                            <FormDescription>
                              Choose a creative and unique name for your team.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Team Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your team, your skills, and what you're looking for in teammates..." 
                                className="min-h-32" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Tell others about your team's strengths, goals, and the skills you're looking for.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="event_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an event" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {participatingEvents.map((event) => (
                                  <SelectItem key={event.id} value={event.id}>
                                    {event.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              The event this team is participating in.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="looking_for_members"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Looking for Members</FormLabel>
                              <FormDescription>
                                Allow others to request to join your team.
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => navigate('/teams')}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Creating...' : 'Create Team'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CreateTeam;
