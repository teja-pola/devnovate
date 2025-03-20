
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';

export const TeamForm = ({ 
  defaultEventId, 
  events, 
  userId 
}: { 
  defaultEventId: string | null; 
  events: any[]; 
  userId: string;
}) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    eventId: defaultEventId || '',
    lookingForMembers: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, eventId: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, lookingForMembers: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Team name is required');
      return;
    }

    if (!formData.eventId) {
      toast.error('Please select an event');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: formData.name,
          description: formData.description,
          event_id: formData.eventId,
          looking_for_members: formData.lookingForMembers
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Add the creator as a team member with 'leader' role
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: userId,
          role: 'leader'
        });

      if (memberError) throw memberError;

      toast.success('Team created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('Failed to create team');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="eventId">Select Event</Label>
            <Select
              value={formData.eventId}
              onValueChange={handleSelectChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {events.map(event => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter team name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Team Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your team, skills needed, etc."
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="lookingForMembers" 
              checked={formData.lookingForMembers}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="lookingForMembers">We're looking for more team members</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Team'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
