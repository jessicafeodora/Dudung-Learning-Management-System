import { cn } from "@/lib/utils";

interface WorkshopCardProps {
  id: string;
  title: string;
  organizer: string;
  date: string;
  duration: string;
  labels?: ("FREE" | "RECOMMENDED" | "EXCLUSIVE")[];
  imageUrl?: string;
  onAction?: (action: string, id: string) => void;
}

export function WorkshopCard({
  id,
  title,
  organizer,
  date,
  duration,
  labels = [],
  imageUrl,
  onAction,
}: WorkshopCardProps) {
  return (
    <div
      className={cn(
        "glassmorphism overflow-hidden hover:shadow-lg hover:-translate-y-1",
        "smooth-transition cursor-pointer flex flex-col"
      )}
    >
      {/* Image section */}
      <div className="h-28 bg-gradient-to-br from-primary/30 to-secondary/30 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 smooth-transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl">🎓</span>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Labels */}
        {labels.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {labels.map((label) => (
              <span
                key={label}
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-bold",
                  label === "FREE"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200"
                    : label === "RECOMMENDED"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
                      : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200"
                )}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-base font-bold text-foreground mb-1 line-clamp-2">
          {title}
        </h3>

        {/* Organizer */}
        <p className="text-xs text-muted-foreground mb-2">{organizer}</p>

        {/* Date & Duration */}
        <p className="text-xs text-muted-foreground mb-4">
          📅 {date} • ⏱️ {duration}
        </p>

        {/* CTA Button */}
        <button
          onClick={() => onAction?.("enroll", id)}
          className="mt-auto py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm smooth-transition hover:bg-primary/90"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
