
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FadeIn } from '@/components/animations/FadeIn';
import { TeamFormSkeleton } from '@/components/teams/TeamFormSkeleton';
import { NoEventsMessage } from '@/components/teams/NoEventsMessage';
import { TeamForm } from '@/components/teams/TeamForm';
import { useEventData } from '@/hooks/useEventData';

const CreateTeam = () => {
  const { user, userType, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const eventId = searchParams.get('event');
  
  const { participatingEvents, loading, eventsLoading } = useEventData(user?.id);

  useEffect(() => {
    if (!authLoading && (!user || userType !== 'candidate')) {
      toast.error('Only candidates can create teams');
      navigate('/auth/login');
    }
  }, [user, userType, authLoading, navigate]);

  if (authLoading || loading || eventsLoading) {
    return <TeamFormSkeleton />;
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
                  <NoEventsMessage />
                ) : (
                  <TeamForm 
                    defaultEventId={eventId} 
                    events={participatingEvents} 
                    userId={user?.id || ''}
                  />
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
