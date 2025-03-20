
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FadeIn } from '@/components/animations/FadeIn';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, Globe, Camera } from 'lucide-react';

const profileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  avatar_url: z.string().optional(),
  bio: z.string().optional(),
  skills: z.string().optional(),
  github_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  linkedin_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  portfolio_url: z.string().url('Enter a valid URL').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      avatar_url: '',
      bio: '',
      skills: '',
      github_url: '',
      linkedin_url: '',
      portfolio_url: '',
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/login');
      return;
    }

    const fetchProfile = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        setProfileData(data);
        
        // Set form values
        form.reset({
          full_name: data?.full_name || user.user_metadata?.full_name || '',
          avatar_url: data?.avatar_url || user.user_metadata?.avatar_url || '',
          bio: data?.bio || '',
          skills: data?.skills ? data.skills.join(', ') : '',
          github_url: data?.github_url || '',
          linkedin_url: data?.linkedin_url || '',
          portfolio_url: data?.portfolio_url || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
        
        // Initialize form with user data from auth
        form.reset({
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
          bio: '',
          skills: '',
          github_url: '',
          linkedin_url: '',
          portfolio_url: '',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading, navigate, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Parse skills string into array
      const skillsArray = values.skills
        ? values.skills.split(',').map(skill => skill.trim()).filter(Boolean)
        : [];
      
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          full_name: values.full_name,
          avatar_url: values.avatar_url || null,
          bio: values.bio || null,
          skills: skillsArray.length > 0 ? skillsArray : null,
          github_url: values.github_url || null,
          linkedin_url: values.linkedin_url || null,
          portfolio_url: values.portfolio_url || null,
          updated_at: new Date().toISOString(),
        });
        
      if (error) throw error;
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <section className="py-16 md:py-24">
          <div className="section-container">
            <FadeIn>
              <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Profile</h1>
                
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                          <div className="flex flex-col items-center space-y-2">
                            <Avatar className="w-24 h-24 border-2 border-border">
                              <AvatarImage src={form.watch('avatar_url')} />
                              <AvatarFallback className="text-xl">
                                {form.watch('full_name').charAt(0)?.toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <FormField
                              control={form.control}
                              name="avatar_url"
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormControl>
                                    <div className="flex items-center space-x-2">
                                      <Input 
                                        placeholder="Avatar URL" 
                                        {...field} 
                                        value={field.value || ''}
                                        className="text-xs" 
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="flex-1 space-y-4">
                            <FormField
                              control={form.control}
                              name="full_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="bio"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Bio</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Tell us about yourself"
                                      className="resize-none min-h-32"
                                      {...field}
                                      value={field.value || ''}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Share information about your background, experience, and interests.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="skills"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Skills</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="React, TypeScript, Node.js, etc."
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormDescription>
                                Enter your skills separated by commas.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="github_url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center space-x-1">
                                  <Github className="h-4 w-4" />
                                  <span>GitHub URL</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="https://github.com/username" {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="linkedin_url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center space-x-1">
                                  <Linkedin className="h-4 w-4" />
                                  <span>LinkedIn URL</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="https://linkedin.com/in/username" {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="portfolio_url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center space-x-1">
                                  <Globe className="h-4 w-4" />
                                  <span>Portfolio URL</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="https://yourportfolio.com" {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex justify-end">
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Profile'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
