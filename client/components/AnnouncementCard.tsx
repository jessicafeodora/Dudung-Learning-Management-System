import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnouncementCardProps {
  id: string;
  title: string;
  author: string;
  date: string;
  time: string;
  preview: string;
  tag?: "NEW" | "IMPORTANT";
  onMoreClick: (id: string) => void;
}

export function AnnouncementCard({
  id,
  title,
  author,
  date,
  time,
  preview,
  tag,
  onMoreClick,
}: AnnouncementCardProps) {
  return (
    <div
      className={cn(
        "glassmorphism p-6 hover:shadow-lg hover:-translate-y-1",
        "smooth-transition group cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-base font-semibold text-foreground line-clamp-2 flex-1">
          {title}
        </h3>
        {tag && (
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap",
              tag === "NEW"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
                : "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200"
            )}
          >
            {tag}
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>By {author}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>📅 {date} • ⏰ {time}</span>
        </div>
      </div>

      <p className="text-sm text-foreground/80 line-clamp-3 mb-4">
        {preview}
      </p>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onMoreClick(id);
        }}
        className={cn(
          "inline-flex items-center gap-2 text-primary font-medium text-sm",
          "hover:gap-3 smooth-transition"
        )}
      >
        More →
      </button>
    </div>
  );
}
