
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { supabaseExtended } from '@/integrations/supabase/extendedClient';

interface Event {
  id: string;
  title: string;
}

export function useEventData(userId: string | undefined) {
  const [events, setEvents] = useState<Event[]>([]);
  const [participatingEvents, setParticipatingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      
      if (!userId) return;
      
      try {
        const { data: registrations, error: regError } = await supabaseExtended
          .from('event_registrations')
          .select('event_id')
          .eq('user_id', userId);
          
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
    
    if (userId) {
      fetchEvents();
    }
  }, [userId]);

  useEffect(() => {
    const fetchParticipatingEvents = async () => {
      if (!userId) return;
      
      try {
        setEventsLoading(true);
        
        const { data: registrations } = await supabaseExtended
          .from('event_registrations')
          .select('event_id')
          .eq('user_id', userId);
        
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
      } finally {
        setEventsLoading(false);
      }
    };
    
    if (userId) {
      fetchParticipatingEvents();
    }
  }, [userId]);

  return { events, participatingEvents, loading, eventsLoading };
}
