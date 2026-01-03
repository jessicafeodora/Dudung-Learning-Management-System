import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CourseOverviewCardProps {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  lastAccessed: string;
  imageUrl?: string;
  onAction?: (action: string, courseId: string) => void;
  /** Render a disabled grey placeholder (used to fill empty slots up to 12). */
  isPlaceholder?: boolean;
}

export function CourseOverviewCard({
  id,
  title,
  instructor,
  progress,
  lastAccessed,
  imageUrl,
  onAction,
  isPlaceholder = false,
}: CourseOverviewCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className={cn(
        "glassmorphism overflow-hidden smooth-transition group flex flex-col",
        !isPlaceholder && "hover:shadow-lg hover:-translate-y-1",
        isPlaceholder && "opacity-60 grayscale pointer-events-none"
      )}
      aria-disabled={isPlaceholder}
    >
      {/* Image section */}
      <div
        className={cn(
          "h-32 overflow-hidden",
          isPlaceholder
            ? "bg-white/10 dark:bg-white/5"
            : "bg-gradient-to-br from-primary/30 to-secondary/30"
        )}
      >
        {!isPlaceholder && imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 smooth-transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl">{isPlaceholder ? "" : "📖"}</span>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Header with menu */}
        <div className="flex items-start justify-between mb-3">
          {isPlaceholder ? (
            <div className="space-y-2 flex-1">
              <div className="h-4 w-3/4 rounded bg-white/20 dark:bg-white/10" />
              <div className="h-4 w-1/2 rounded bg-white/20 dark:bg-white/10" />
            </div>
          ) : (
            <>
              <h3 className="text-base font-bold text-foreground line-clamp-2 flex-1">
                {title}
              </h3>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 hover:bg-white/30 dark:hover:bg-white/10 rounded-lg smooth-transition"
                  type="button"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-1 w-40 glassmorphism-light rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        onAction?.("continue", id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-white/30 dark:hover:bg-white/10 text-sm smooth-transition"
                      type="button"
                    >
                      Continue Course
                    </button>
                    <button
                      onClick={() => {
                        onAction?.("details", id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-white/30 dark:hover:bg-white/10 text-sm smooth-transition border-t border-white/20"
                      type="button"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        onAction?.("unenroll", id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-destructive/20 text-sm text-destructive smooth-transition border-t border-white/20"
                      type="button"
                    >
                      Unenroll
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Instructor */}
        {isPlaceholder ? (
          <div className="h-3 w-1/2 rounded bg-white/15 dark:bg-white/10 mb-3" />
        ) : (
          <p className="text-xs text-muted-foreground mb-2">Dr. {instructor}</p>
        )}

        {/* Progress bar */}
        <div className="mb-2">
          <div className="w-full h-2 bg-white/30 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full smooth-transition",
                isPlaceholder ? "bg-white/20" : "bg-primary"
              )}
              style={{ width: `${isPlaceholder ? 35 : progress}%` }}
            />
          </div>
        </div>

        {/* Last accessed */}
        {isPlaceholder ? (
          <div className="h-3 w-2/3 rounded bg-white/15 dark:bg-white/10" />
        ) : (
          <p className="text-xs text-muted-foreground">
            Last accessed: {lastAccessed}
          </p>
        )}
      </div>
    </div>
  );
}
