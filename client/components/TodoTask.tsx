import { cn } from "@/lib/utils";

type TaskStatus = "Upcoming" | "Due Today" | "Overdue";

interface TodoTaskProps {
  id: string;
  title: string;
  courseName: string;
  deadline: string;
  status: TaskStatus;
  onClick?: (id: string) => void;
}

const statusConfig: Record<
  TaskStatus,
  { bgColor: string; textColor: string }
> = {
  Upcoming: {
    bgColor: "bg-blue-100 dark:bg-blue-900/40",
    textColor: "text-blue-700 dark:text-blue-200",
  },
  "Due Today": {
    bgColor: "bg-orange-100 dark:bg-orange-900/40",
    textColor: "text-orange-700 dark:text-orange-200",
  },
  Overdue: {
    bgColor: "bg-red-100 dark:bg-red-900/40",
    textColor: "text-red-700 dark:text-red-200",
  },
};

export function TodoTask({
  id,
  title,
  courseName,
  deadline,
  status,
  onClick,
}: TodoTaskProps) {
  const config = statusConfig[status];

  return (
    <div
      onClick={() => onClick?.(id)}
      className={cn(
        "p-4 rounded-xl border border-white/20 hover:border-primary",
        "bg-white/30 dark:bg-white/10 hover:bg-white/40 dark:hover:bg-white/15",
        "smooth-transition cursor-pointer group"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="text-sm font-semibold text-foreground flex-1 group-hover:text-primary smooth-transition">
          {title}
        </h4>
        <span
          className={cn(
            "px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap",
            config.bgColor,
            config.textColor
          )}
        >
          {status}
        </span>
      </div>

      <p className="text-xs text-muted-foreground mb-2">{courseName}</p>

      <p className="text-xs text-muted-foreground">📅 {deadline}</p>
    </div>
  );
}
