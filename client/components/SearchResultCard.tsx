import { cn } from "@/lib/utils";

type ContentType = "Course" | "Workshop" | "Certificate";

interface SearchResultCardProps {
  id: string;
  title: string;
  description?: string;
  type: ContentType;
  instructor?: string;
  lastUpdated?: string;
  imageUrl?: string;
  tags?: string[];
  onClick?: (id: string) => void;
}

const typeConfig: Record<ContentType, { bgColor: string; textColor: string }> = {
  Course: {
    bgColor: "bg-blue-100 dark:bg-blue-900/40",
    textColor: "text-blue-700 dark:text-blue-200",
  },
  Workshop: {
    bgColor: "bg-green-100 dark:bg-green-900/40",
    textColor: "text-green-700 dark:text-green-200",
  },
  Certificate: {
    bgColor: "bg-purple-100 dark:bg-purple-900/40",
    textColor: "text-purple-700 dark:text-purple-200",
  },
};

function toDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeSvgText(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getFallbackImage(type: ContentType, title: string) {
  const icon = type === "Course" ? "📚" : type === "Workshop" ? "🎓" : "🏆";
  const subtitle = type === "Course" ? "Course" : type === "Workshop" ? "Workshop" : "Certificate";
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#4A70A9" stop-opacity="0.40" />
        <stop offset="1" stop-color="#8FABD4" stop-opacity="0.35" />
      </linearGradient>
    </defs>
    <rect width="1200" height="600" rx="44" fill="url(#g)" />
    <rect x="48" y="48" width="1104" height="504" rx="36" fill="#FFFFFF" fill-opacity="0.16" stroke="#FFFFFF" stroke-opacity="0.28" />
    <text x="92" y="170" font-size="72" font-family="ui-sans-serif, system-ui" fill="#000000" fill-opacity="0.70">${icon}</text>
    <text x="180" y="170" font-size="40" font-family="ui-sans-serif, system-ui" fill="#000000" fill-opacity="0.68">${subtitle}</text>
    <text x="92" y="250" font-size="52" font-family="ui-sans-serif, system-ui" fill="#000000" fill-opacity="0.76">${escapeSvgText(title)}</text>
  </svg>`;
  return toDataUri(svg);
}

export function SearchResultCard({
  id,
  title,
  description,
  type,
  instructor,
  lastUpdated,
  imageUrl,
  tags,
  onClick,
}: SearchResultCardProps) {
  const config = typeConfig[type];
  const resolvedImage = imageUrl || getFallbackImage(type, title);
  const shownTags = (tags || []).slice(0, 2);

  return (
    <div
      onClick={() => onClick?.(id)}
      className={cn(
        "glassmorphism overflow-hidden hover:shadow-lg hover:-translate-y-1",
        "smooth-transition cursor-pointer flex flex-col group"
      )}
    >
      {/* Image section */}
      <div className="h-40 bg-gradient-to-br from-primary/30 to-secondary/30 overflow-hidden">
        <img
          src={resolvedImage}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 smooth-transition"
        />
      </div>

      {/* Content section */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Type badge */}
        <div className="mb-3">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold inline-block",
              config.bgColor,
              config.textColor
            )}
          >
            {type}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary smooth-transition">
          {title}
        </h3>

        {/* Tags */}
        {shownTags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {shownTags.map((t) => (
              <span
                key={t}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-medium",
                  "bg-white/40 dark:bg-white/10 border border-white/25 dark:border-white/15",
                  "text-foreground/80"
                )}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
            {description}
          </p>
        )}

        {/* Instructor */}
        {instructor && (
          <p className="text-xs text-muted-foreground mb-2">
            Instructor: {instructor}
          </p>
        )}

        {/* Last updated */}
        {lastUpdated && (
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        )}

        {/* CTA */}
        <button
          type="button"
          className="mt-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm smooth-transition hover:bg-primary/90"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
