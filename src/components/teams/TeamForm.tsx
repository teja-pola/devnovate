
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  event_id: z.string().min(1, 'Event is required'),
  looking_for_members: z.boolean().default(true),
});

export type FormValues = z.infer<typeof formSchema>;

interface TeamFormProps {
  defaultEventId?: string | null;
  events: Array<{ id: string; title: string }>;
  userId: string;
}

export const TeamForm = ({ defaultEventId, events, userId }: TeamFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      event_id: defaultEventId || '',
      looking_for_members: true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!userId) {
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
          user_id: userId,
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

  return (
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
                  {events.map((event) => (
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
  );
};
