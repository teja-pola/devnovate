
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
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
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  type: z.string().min(1, 'Job type is required'),
  experience_level: z.string().min(1, 'Experience level is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  required_skills: z.array(z.string()).optional(),
  salary_min: z.string().optional(),
  salary_max: z.string().optional(),
  salary_currency: z.string().default('USD'),
});

type FormValues = z.infer<typeof formSchema>;

const CreateJob = () => {
  const { user, userType, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      company_name: '',
      location: '',
      type: '',
      experience_level: '',
      description: '',
      required_skills: [],
      salary_min: '',
      salary_max: '',
      salary_currency: 'USD',
    },
  });

  const { watch, setValue } = form;
  const requiredSkills = watch('required_skills') || [];

  useEffect(() => {
    if (!authLoading && (!user || userType !== 'recruiter')) {
      toast.error('Only recruiters can post jobs');
      navigate('/auth/login');
    }
  }, [user, userType, authLoading, navigate]);

  const addSkill = () => {
    if (skillInput.trim() && !requiredSkills.includes(skillInput.trim())) {
      setValue('required_skills', [...requiredSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setValue(
      'required_skills',
      requiredSkills.filter((s) => s !== skill)
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error('You must be logged in to post a job');
      return;
    }

    const salary_range = {
      min: values.salary_min ? parseInt(values.salary_min) : null,
      max: values.salary_max ? parseInt(values.salary_max) : null,
      currency: values.salary_currency,
    };

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('jobs').insert({
        title: values.title,
        company_name: values.company_name,
        location: values.location,
        type: values.type,
        experience_level: values.experience_level,
        description: values.description,
        required_skills: values.required_skills || [],
        salary_range,
        poster_id: user.id,
        status: 'open',
      });

      if (error) throw error;

      toast.success('Job posted successfully');
      navigate('/jobs');
    } catch (error: any) {
      console.error('Error posting job:', error);
      toast.error(error.message || 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
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
                <h1 className="text-4xl font-bold mb-6">Post a New Job</h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Fill in the details below to create a job listing and attract the best talent.
                </p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold">Job Details</h2>
                      
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Senior Frontend Developer" {...field} />
                            </FormControl>
                            <FormDescription>
                              The title of the position you're hiring for.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="company_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Acme Inc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. New York, NY or Remote" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Type</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select job type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Full-Time">Full-Time</SelectItem>
                                  <SelectItem value="Part-Time">Part-Time</SelectItem>
                                  <SelectItem value="Contract">Contract</SelectItem>
                                  <SelectItem value="Internship">Internship</SelectItem>
                                  <SelectItem value="Freelance">Freelance</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="experience_level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Experience Level</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select experience level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Entry Level">Entry Level</SelectItem>
                                <SelectItem value="Mid Level">Mid Level</SelectItem>
                                <SelectItem value="Senior">Senior</SelectItem>
                                <SelectItem value="Principal">Principal</SelectItem>
                                <SelectItem value="Executive">Executive</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe the job responsibilities, requirements, and benefits..." 
                                className="min-h-32" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Provide a comprehensive description of the job, responsibilities, and qualifications.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />
                    
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold">Required Skills</h2>
                      
                      <div className="space-y-2">
                        <FormLabel>Skills</FormLabel>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a skill (e.g. React, JavaScript, Python)"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                          />
                          <Button type="button" onClick={addSkill}>Add</Button>
                        </div>
                        <FormDescription>
                          Press Enter or click Add to add a skill.
                        </FormDescription>
                        
                        {requiredSkills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {requiredSkills.map((skill) => (
                              <div 
                                key={skill} 
                                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center"
                              >
                                {skill}
                                <button 
                                  type="button" 
                                  onClick={() => removeSkill(skill)} 
                                  className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold">Salary Information (Optional)</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="salary_min"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Salary</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="e.g. 60000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="salary_max"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Salary</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="e.g. 90000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="salary_currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Currency</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="USD">USD</SelectItem>
                                  <SelectItem value="EUR">EUR</SelectItem>
                                  <SelectItem value="GBP">GBP</SelectItem>
                                  <SelectItem value="CAD">CAD</SelectItem>
                                  <SelectItem value="AUD">AUD</SelectItem>
                                  <SelectItem value="INR">INR</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormDescription>
                        Providing salary information helps attract more qualified candidates.
                      </FormDescription>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button type="button" variant="outline" onClick={() => navigate('/jobs')}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Posting...' : 'Post Job'}
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

export default CreateJob;
