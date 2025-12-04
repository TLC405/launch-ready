import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center film-grain">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-cinematic" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center px-6">
        {/* 404 Number */}
        <h1 className="font-display text-8xl md:text-9xl font-bold text-gradient-gold mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
          Lost in Time
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          The page you're looking for seems to have traveled to a different era. 
          Let's get you back to the present.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="gold" size="lg" asChild>
            <Link to="/">
              <Home className="w-5 h-5" />
              Return Home
            </Link>
          </Button>
          <Button variant="gold-outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
