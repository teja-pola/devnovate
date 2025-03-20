
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { supabaseExtended } from '@/integrations/supabase/extendedClient';
import { toast } from 'sonner';

export const useEventData = (userId?: string) => {
  const [participatingEvents, setParticipatingEvents] = useState<any[]>([]);
  const [hostedEvents, setHostedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setEventsLoading(false);
      return;
    }

    const fetchEventData = async () => {
      try {
        setLoading(true);
        
        // Fetch hosted events (events created by user)
        const { data: createdEvents, error: hostedError } = await supabase
          .from('events')
          .select('*')
          .eq('creator_id', userId)
          .order('created_at', { ascending: false });
          
        if (hostedError) throw hostedError;
        setHostedEvents(createdEvents || []);
        
        // Fetch events the user is participating in
        const { data: registrations, error: regError } = await supabaseExtended
          .from('event_registrations')
          .select('event_id')
          .eq('user_id', userId);
          
        if (regError) throw regError;
        
        if (registrations && registrations.length > 0) {
          const eventIds = registrations.map(reg => reg.event_id);
          
          const { data: participatingEventData, error: eventsError } = await supabase
            .from('events')
            .select('*')
            .in('id', eventIds)
            .order('start_date', { ascending: true });
            
          if (eventsError) throw eventsError;
          setParticipatingEvents(participatingEventData || []);
        } else {
          setParticipatingEvents([]);
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
        toast.error('Failed to load event data');
      } finally {
        setLoading(false);
        setEventsLoading(false);
      }
    };
    
    fetchEventData();
  }, [userId]);

  return { 
    participatingEvents, 
    hostedEvents, 
    loading, 
    eventsLoading 
  };
};
