import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export function PlaceholderPage({
  title,
  description = "This page is coming soon. Continue prompting to build more features!",
}: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/40 dark:bg-primary/50 flex items-center justify-center animate-pulse">
            <span className="text-3xl">✨</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          {title}
        </h1>

        <p className="text-lg text-foreground/70 max-w-md mx-auto">
          {description}
        </p>

        <Link
          to="/"
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3",
            "btn-primary"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Add padding for mobile to account for bottom nav */}
      <div className="h-24 md:hidden" />
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
