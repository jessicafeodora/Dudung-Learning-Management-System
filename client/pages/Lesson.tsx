import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";

type LessonContent = {
  title: string;
  subtitle: string;
  sections: { heading: string; body: string }[];
};

const LESSONS: Record<string, LessonContent> = {
  "usage-analytics": {
    title: "Usage Analytics I",
    subtitle: "Getting started with metrics, funnels, and dashboards",
    sections: [
      {
        heading: "What you’ll learn",
        body:
          "In this lesson you’ll explore core analytics concepts (events, properties, segments) and how to translate product questions into measurable signals.",
      },
      {
        heading: "Quick exercise",
        body:
          "Pick one feature in your app, then write 3 events you would track and 2 questions you want the dashboard to answer.",
      },
    ],
  },
  "web-programming": {
    title: "Web Programming",
    subtitle: "Building modern web apps with clean structure",
    sections: [
      {
        heading: "Key topics",
        body:
          "Project structure, component thinking, state management, and how to avoid common UI pitfalls on mobile devices.",
      },
      {
        heading: "Mini task",
        body:
          "Refactor one page into smaller components and ensure it stays readable on a 360px-wide screen.",
      },
    ],
  },
  "data-structures-algorithms": {
    title: "Data Structures & Algorithms",
    subtitle: "Page: Data Structures & Algorithms (overview)",
    sections: [
      {
        heading: "Recursion Basics",
        body:
          "Understand base cases, recursive cases, and how to reason about time/space. Practice by converting iterative solutions into recursive ones (and vice versa).",
      },
      {
        heading: "Next up",
        body:
          "Arrays vs. linked lists, stacks/queues, and when to choose each structure based on constraints.",
      },
    ],
  },
};

export function Lesson() {
  const { slug } = useParams();

  const content = useMemo(() => {
    if (!slug) return null;
    return LESSONS[slug] ?? null;
  }, [slug]);

  if (!content) {
    return (
      <div className="min-h-screen bg-background pb-24 overflow-x-hidden">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="glassmorphism p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              This page is in development
            </h1>
            <p className="text-muted-foreground mb-6">
              The lesson page you opened hasn’t been built yet.
            </p>
            <Link to="/dashboard" className="text-primary hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{content.title}</h1>
            <p className="text-muted-foreground">{content.subtitle}</p>
          </div>
          <Link
            to="/dashboard"
            className={cn(
              "glassmorphism px-4 py-2 rounded-full text-sm font-medium",
              "hover:bg-white/20 dark:hover:bg-white/10 smooth-transition"
            )}
          >
            Back
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {content.sections.map((s) => (
            <div key={s.heading} className="glassmorphism p-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">{s.heading}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}

          <div className="glassmorphism p-6 lg:col-span-3">
            <h2 className="text-lg font-semibold text-foreground mb-2">Notes</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This is a placeholder lesson page to fix navigation and make “Continue learning”
              routes consistent across cards. Content can be replaced with real materials later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
