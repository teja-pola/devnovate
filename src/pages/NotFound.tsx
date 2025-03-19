
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FadeIn } from "@/components/animations/FadeIn";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <FadeIn className="text-center">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <p className="text-2xl text-foreground mb-8">Oops! Page not found</p>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Button variant="primary" size="lg" asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </FadeIn>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
