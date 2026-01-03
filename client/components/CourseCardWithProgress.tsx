import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CourseCardWithProgressProps {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  lastAccessed: string;
  imageUrl?: string;
  onAction?: (action: string, courseId: string) => void;
}

export function CourseCardWithProgress({
  id,
  title,
  instructor,
  progress,
  lastAccessed,
  imageUrl,
  onAction,
}: CourseCardWithProgressProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className={cn(
        "glassmorphism overflow-hidden hover:shadow-lg hover:-translate-y-1",
        "smooth-transition flex flex-col"
      )}
    >
      {/* Image section */}
      <div className="h-40 bg-gradient-to-br from-primary/30 to-secondary/30 overflow-hidden relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 smooth-transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Header with menu */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base font-bold text-foreground line-clamp-2 flex-1">
            {title}
          </h3>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-white/30 dark:hover:bg-white/10 rounded-lg smooth-transition ml-2 flex-shrink-0"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 w-44 glassmorphism-light rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    onAction?.("continue", id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-white/30 dark:hover:bg-white/10 text-sm smooth-transition"
                >
                  Continue Course
                </button>
                <button
                  onClick={() => {
                    onAction?.("details", id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-white/30 dark:hover:bg-white/10 text-sm smooth-transition border-t border-white/20"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    onAction?.("unenroll", id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-destructive/20 text-sm text-destructive smooth-transition border-t border-white/20"
                >
                  Unenroll
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Instructor */}
        <p className="text-sm text-muted-foreground mb-3">Dr. {instructor}</p>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="w-full h-2 bg-white/30 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary smooth-transition"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Last accessed */}
        <p className="text-xs text-muted-foreground">
          Last accessed: {lastAccessed}
        </p>
      </div>
    </div>
  );
}
