import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FadeIn } from '@/components/animations/FadeIn';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Briefcase, MapPin, Search, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Job = {
  id: string;
  title: string;
  company_name: string;
  location: string;
  type: string;
  experience_level: string;
  description: string;
  required_skills: string[] | null;
  salary_range: any;
  poster_id: string;
  created_at: string;
  status: string;
  poster_name?: string;
};

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*, profiles:poster_id(full_name)')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
        return;
      }
      
      const formattedJobs = data.map(job => ({
        ...job,
        poster_name: job.profiles?.full_name || 'Unknown'
      }));
      
      setJobs(formattedJobs);
      setFilteredJobs(formattedJobs);
      setLoading(false);
    };
    
    fetchJobs();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredJobs(jobs);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = jobs.filter(
      job => 
        job.title.toLowerCase().includes(term) ||
        job.company_name.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term) ||
        (job.required_skills && job.required_skills.some(skill => 
          skill.toLowerCase().includes(term)
        ))
    );
    
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleCreateJob = () => {
    navigate('/jobs/create');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow w-full items-center">
      <section className="pt-5 pb-5 bg-secondary/20 flex items-center justify-center">
      <div className="section-container text-center">
      <FadeIn className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Next Opportunity</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Explore jobs and opportunities posted by companies looking for tech talent.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search jobs, skills, or companies..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                
                {user && userType === 'recruiter' && (
                  <Button onClick={handleCreateJob}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Post Job
                  </Button>
                )}
              </div>
            </FadeIn>
          </div>
        </section>
        
        <section className="pt-5 pb-5 w-full flex items-center justify-center">
          <div className="section-container">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-8">
                <TabsTrigger value="all">All Jobs ({filteredJobs.length})</TabsTrigger>
                <TabsTrigger value="remote">Remote Jobs</TabsTrigger>
                <TabsTrigger value="fulltime">Full-Time</TabsTrigger>
                <TabsTrigger value="contract">Contract</TabsTrigger>
                <TabsTrigger value="parttime">Part-Time</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {renderJobsList(filteredJobs, loading, navigate)}
              </TabsContent>
              
              <TabsContent value="remote">
                {renderJobsList(
                  filteredJobs.filter(job => job.location.toLowerCase().includes('remote')),
                  loading,
                  navigate
                )}
              </TabsContent>
              
              <TabsContent value="fulltime">
                {renderJobsList(
                  filteredJobs.filter(job => job.type.toLowerCase() === 'full-time'),
                  loading,
                  navigate
                )}
              </TabsContent>
              
              <TabsContent value="contract">
                {renderJobsList(
                  filteredJobs.filter(job => job.type.toLowerCase() === 'contract'),
                  loading,
                  navigate
                )}
              </TabsContent>

              <TabsContent value="parttime">
                {renderJobsList(
                  filteredJobs.filter(job => job.type.toLowerCase() === 'part-time'),
                  loading,
                  navigate
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const renderJobsList = (jobs: Job[], loading: boolean, navigate: Function) => {
  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary border-r-2"></div>
      </div>
    );
  }
  
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No Jobs Found</h3>
        <p className="text-muted-foreground">Try adjusting your search criteria or check back later.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {jobs.map(job => (
        <JobCard key={job.id} job={job} onClick={() => navigate(`/jobs/${job.id}`)} />
      ))}
    </div>
  );
};

const JobCard = ({ job, onClick }: { job: Job; onClick: () => void }) => {
  const formattedDate = new Date(job.created_at).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-md flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex-grow space-y-3">
            <div>
              <h3 className="text-lg font-bold">{job.title}</h3>
              <p className="text-muted-foreground">{job.company_name}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {job.location}
              </div>
              <Badge variant="outline">{job.type}</Badge>
              <Badge variant="outline">{job.experience_level}</Badge>
            </div>
            
            {job.required_skills && job.required_skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {job.required_skills.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="font-normal">
                    {skill}
                  </Badge>
                ))}
                {job.required_skills.length > 5 && (
                  <Badge variant="secondary" className="font-normal">
                    +{job.required_skills.length - 5} more
                  </Badge>
                )}
              </div>
            )}
            
            <p className="text-sm line-clamp-2">{job.description}</p>
            
            {job.salary_range && (
              <p className="text-sm font-medium">
                {job.salary_range.min && job.salary_range.max 
                  ? `${formatSalary(job.salary_range.min)} - ${formatSalary(job.salary_range.max)} ${job.salary_range.currency || 'USD'}`
                  : 'Salary undisclosed'}
              </p>
            )}
          </div>
          
          <div className="flex flex-col items-end justify-between gap-4 self-stretch md:text-right">
            <p className="text-sm text-muted-foreground">Posted {formattedDate}</p>
            <Button>View Details</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const formatSalary = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

export default JobsPage;
