
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Features from "./pages/Features";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AuthCallback from "./pages/auth/AuthCallback";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/events/CreateEvent";
import EventsPage from "./pages/events/EventsPage";
import EventDetails from "./pages/events/EventDetails";
import JobsPage from "./pages/jobs/JobsPage";
import CreateJob from "./pages/jobs/CreateJob";
import CreateTeam from "./pages/teams/CreateTeam";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<Features />} />
            
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Events Routes */}
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/create" element={<CreateEvent />} />
            <Route path="/events/:slug" element={<EventDetails />} />
            
            {/* Jobs Routes */}
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/create" element={<CreateJob />} />
            
            {/* Teams Routes */}
            <Route path="/teams/create" element={<CreateTeam />} />
            
            {/* Profile Routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
