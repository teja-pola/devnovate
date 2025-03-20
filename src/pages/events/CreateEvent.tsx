import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ui/ThemeToggle'; // Import the ThemeToggle component

import { Navbar } from '@/components/layout/Navbar'; // Corrected import statement

import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

import { Footer } from '@/components/layout/Footer';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { FadeIn } from '@/components/animations/FadeIn';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),
  start_date: z.date({
    required_error: 'Start date is required',
  }),
  end_date: z.date({
    required_error: 'End date is required',
  }),
  registration_deadline: z.date().optional(),
  max_team_size: z.coerce.number().int().min(1).max(10),
  cover_image: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateEvent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      slug: '',
      max_team_size: 4,
      cover_image: '',
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/login');
    }
  }, [user, loading, navigate]);

  const onSubmit = async (values: FormValues) => {
    console.log('User ID:', user.id); // Log the user ID for debugging

    if (!user) {
      toast.error('You must be logged in to create an event');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: userExists, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (userCheckError || !userExists) {
        console.log('User not found in users table, creating it now');

        const { data: authUser, error: authError } =
          await supabase.auth.getUser();

        if (authError) throw authError;

        const { error: createUserError } = await supabase.from('users').insert({
          id: user.id,
          full_name: authUser.user?.user_metadata?.full_name || 'User',
        });

        if (createUserError) {
          console.error('Failed to create user record:', createUserError);
          throw createUserError;
        }

        console.log('User record created successfully');
      }

      const { data: existingEvent } = await supabase
        .from('events')
        .select('slug')
        .eq('slug', values.slug)
        .single();

      if (existingEvent) {
        form.setError('slug', {
          type: 'manual',
          message: 'This slug is already taken. Please choose another one.',
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase.from('events').insert({
        title: values.title,
        description: values.description,
        slug: values.slug,
        start_date: values.start_date.toISOString(),
        end_date: values.end_date.toISOString(),
        registration_deadline: values.registration_deadline?.toISOString(),
        max_team_size: values.max_team_size,
        cover_image: values.cover_image || null,
        creator_id: user.id,
        status: 'draft',
      });

      if (error) throw error;

      toast.success('Event created successfully');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast.error(error.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateSlug = () => {
    const title = form.watch('title');
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      form.setValue('slug', slug);
    }
  };

  if (loading) {
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
                <h1 className="text-4xl font-bold mb-6">Create a New Event</h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Fill in the details below to create your hackathon or coding
                  event.
                </p>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Summer Hackathon 2024"
                              {...field}
                              onChange={e => {
                                field.onChange(e);
                                updateSlug();
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            The name of your event as it will appear to
                            participants.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Slug</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. summer-hackathon-2024"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The URL-friendly name for your event. Only lowercase
                            letters, numbers, and hyphens.
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
                          <FormLabel>Event Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your event, its goals, and what participants can expect..."
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A detailed description of your event. Markdown is
                            supported.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className="w-full pl-3 text-left font-normal"
                                  >
                                    {field.value ? (
                                      format(field.value, 'PPP')
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={date => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              When the event starts.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>End Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className="w-full pl-3 text-left font-normal"
                                  >
                                    {field.value ? (
                                      format(field.value, 'PPP')
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={date =>
                                    date < new Date() ||
                                    (form.watch('start_date') &&
                                      date < form.watch('start_date'))
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              When the event ends.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="registration_deadline"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>
                            Registration Deadline (Optional)
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full pl-3 text-left font-normal"
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value || undefined}
                                onSelect={field.onChange}
                                disabled={date =>
                                  date < new Date() ||
                                  (form.watch('start_date') &&
                                    date > form.watch('start_date'))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            The last date participants can register. If not set,
                            registration will close when the event starts.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="max_team_size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Team Size</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              {...field}
                              onChange={e => {
                                const value = parseInt(e.target.value) || 4;
                                field.onChange(value);
                              }}
                              value={field.value}
                            />
                          </FormControl>
                          <FormDescription>
                            The maximum number of participants allowed in a
                            team.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cover_image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Image URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/image.jpg"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A URL to an image that represents your event.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/dashboard')}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create Event'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CreateEvent;
