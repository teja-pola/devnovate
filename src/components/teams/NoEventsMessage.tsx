
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const NoEventsMessage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-muted p-6 rounded-lg text-center">
      <h3 className="text-xl font-semibold mb-2">No Eligible Events</h3>
      <p className="text-muted-foreground mb-4">
        You need to register for an event before you can create a team.
      </p>
      <Button onClick={() => navigate('/events')}>
        Browse Events
      </Button>
    </div>
  );
};
