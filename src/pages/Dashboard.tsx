
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, Award, Calendar } from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/login');
    }
  }, [user, loading, navigate]);

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
        <section className="py-16 md:py-24 bg-secondary/20">
          <div className="section-container">
            <FadeIn className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome, {user?.user_metadata?.full_name || 'User'}</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Manage your hackathons, teams, and projects all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => navigate('/events/create')}>
                  <Plus className="mr-2 h-4 w-4" /> Create Event
                </Button>
                <Button variant="outline" onClick={() => navigate('/teams')}>
                  <Users className="mr-2 h-4 w-4" /> My Teams
                </Button>
                <Button variant="outline" onClick={() => navigate('/projects')}>
                  <Award className="mr-2 h-4 w-4" /> My Projects
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>
        
        <section className="py-16">
          <div className="section-container">
            <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    My Events
                  </CardTitle>
                  <CardDescription>Events you've created or joined</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't created any events yet</p>
                    <Button variant="outline" onClick={() => navigate('/events/create')}>
                      <Plus className="mr-2 h-4 w-4" /> Create Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    My Teams
                  </CardTitle>
                  <CardDescription>Teams you've created or joined</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't joined any teams yet</p>
                    <Button variant="outline" onClick={() => navigate('/teams')}>
                      <Plus className="mr-2 h-4 w-4" /> Find Teams
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Award className="mr-2 h-5 w-5 text-primary" />
                    My Projects
                  </CardTitle>
                  <CardDescription>Projects you've submitted</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't submitted any projects yet</p>
                    <Button variant="outline" onClick={() => navigate('/projects/create')}>
                      <Plus className="mr-2 h-4 w-4" /> Submit Project
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
