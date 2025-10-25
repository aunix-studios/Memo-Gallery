import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">404</h1>
        <p className="text-xl text-foreground">Oops! Page not found</p>
        <a href="/" className="inline-block text-primary underline hover:text-accent transition-smooth">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
