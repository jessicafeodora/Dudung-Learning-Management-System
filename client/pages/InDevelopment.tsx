import { Link } from "react-router-dom";

export function InDevelopment() {
  return (
    <div className="min-h-screen bg-background pb-24 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="glassmorphism p-6 sm:p-10 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            This page is in development
          </h1>
          <p className="text-muted-foreground mb-8">
            We’re still building this page. Thank you for your patience!
          </p>
          <Link to="/dashboard" className="text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
