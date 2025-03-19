
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/CustomButton';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Events', href: '#events' },
    { name: 'Jobs', href: '#jobs' },
    { name: 'About', href: '#about' },
  ];

  return (
    <nav 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        scrolled ? 'py-3 bg-white/80 backdrop-blur-lg shadow-sm' : 'py-5 bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo and brand name */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-bold text-foreground"
            onClick={closeMenu}
          >
            <span className="bg-primary text-white px-2 py-1 rounded-md">D</span>
            <span>Devnovate</span>
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href}
                  className="text-foreground/80 hover:text-foreground transition-colors text-sm font-medium"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button variant="primary" size="sm" asChild>
              <Link to="/register">Register</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button 
            type="button"
            className="md:hidden rounded-md p-2 text-foreground"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={cn(
          'md:hidden absolute top-full left-0 right-0 overflow-hidden bg-white/95 backdrop-blur-lg transition-all duration-300 ease-in-out border-b',
          isMenuOpen ? 'max-h-96 border-border' : 'max-h-0 border-transparent'
        )}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block px-3 py-3 text-foreground font-medium rounded-md hover:bg-muted transition-colors"
              onClick={closeMenu}
            >
              {link.name}
            </a>
          ))}
          <div className="grid grid-cols-2 gap-3 pt-2 pb-3">
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link to="/login" onClick={closeMenu}>Login</Link>
            </Button>
            <Button variant="primary" size="sm" className="w-full" asChild>
              <Link to="/register" onClick={closeMenu}>Register</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
