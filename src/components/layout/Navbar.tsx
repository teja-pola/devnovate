
import { useState, useEffect } from 'react';
import ThemeToggle from '../ui/ThemeToggle'; // Import the ThemeToggle component

import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Briefcase, CalendarDays, Menu, PlusCircle, Users, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, userType, signOut } = useAuth();
  const navigate = useNavigate();

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [navigate]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

    return (
    <header className="bg-background border-b border-border/40">
      <div className="section-container py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Logo size="md" />
            <span className="text-2xl font-bold">Devnovate</span>
          </Link>

          {/* Desktop Navigation */}
          

           {/* Add the ThemeToggle component here */}

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/events" className="text-foreground/80 hover:text-foreground transition-colors">
              Events
            </Link>
            
            <Link to="/jobs" className="text-foreground/80 hover:text-foreground transition-colors">
              Jobs
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                
                {userType === 'candidate' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Host
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => navigate('/events/create')}>
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Host Event
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/teams/create')}>
                        <Users className="mr-2 h-4 w-4" />
                        Create Team
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                
                {userType === 'recruiter' && (
                  <Button variant="outline" size="sm" onClick={() => navigate('/jobs/create')}>
                    <Briefcase className="mr-2 h-4 w-4" />
                    Post Job
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {user.user_metadata?.full_name 
                          ? getInitials(user.user_metadata.full_name) 
                          : user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/auth/login')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/auth/signup')}>
                  Sign Up
                </Button>
              </div>
            )}
            <ThemeToggle />
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col gap-4 items-center">
              <Link to="/events" className="text-foreground/80 hover:text-foreground transition-colors">
                Events
              </Link>
              
              <Link to="/jobs" className="text-foreground/80 hover:text-foreground transition-colors">
                Jobs
              </Link>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                  
                  {userType === 'candidate' && (
                    <>
                      <Link to="/events/create" className="text-foreground/80 hover:text-foreground transition-colors">
                        Host Event
                      </Link>
                      <Link to="/teams/create" className="text-foreground/80 hover:text-foreground transition-colors">
                        Create Team
                      </Link>
                    </>
                  )}
                  
                  {userType === 'recruiter' && (
                    <Link to="/jobs/create" className="text-foreground/80 hover:text-foreground transition-colors">
                      Post Job
                    </Link>
                  )}
                  
                  <Link to="/profile" className="text-foreground/80 hover:text-foreground transition-colors">
                    Profile
                  </Link>
                  
                  <Button variant="outline" onClick={() => signOut()} className="w-full">
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex gap-2 w-full">
                  <Button variant="outline" onClick={() => navigate('/auth/login')} className="flex-1">
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/auth/signup')} className="flex-1">
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
    );
};
