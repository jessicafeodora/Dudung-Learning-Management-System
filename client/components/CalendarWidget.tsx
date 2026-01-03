import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  date: number;
  taskName: string;
  courseName: string;
  dueTime: string;
  type: "deadline" | "quiz" | "exam" | "submission";
}

interface CalendarWidgetProps {
  events?: CalendarEvent[];
}

const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

export function CalendarWidget({ events = [] }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<number | null>(null);

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const daysArray = Array.from({
    length: daysInMonth(currentDate),
  });
  const firstDay = firstDayOfMonth(currentDate);
  const emptyDays = Array.from({ length: firstDay });

  const getEventsForDate = (day: number) => {
    return events.filter((e) => e.date === day);
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  return (
    <div className="glassmorphism p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-foreground">Calendar</h3>
        <p className="text-sm text-muted-foreground">
          Deadlines, quizzes, exams, and submissions at a glance.
        </p>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-lg hover:bg-white/30 dark:hover:bg-white/10 smooth-transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h4 className="font-semibold text-foreground">{monthName}</h4>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-lg hover:bg-white/30 dark:hover:bg-white/10 smooth-transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="h-8 flex items-center justify-center text-xs font-semibold text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {emptyDays.map((_, i) => (
            <div key={`empty-${i}`} className="h-10" />
          ))}

          {daysArray.map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDate(day);
            const isHovered = hoveredDate === day;

            return (
              <div
                key={day}
                onMouseEnter={() => setHoveredDate(day)}
                onMouseLeave={() => setHoveredDate(null)}
                className={cn(
                  "h-10 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer",
                  "smooth-transition border border-white/20",
                  isHovered || dayEvents.length > 0
                    ? "bg-primary/30 border-primary text-foreground"
                    : "bg-white/20 dark:bg-white/5 text-foreground hover:bg-white/30"
                )}
              >
                <div className="relative group">
                  {day}
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-1 h-1 rounded-full bg-primary" />
                  )}

                  {/* Hover popup */}
                  {isHovered && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 glassmorphism-light rounded-xl p-3 z-20 shadow-lg">
                      {dayEvents.length > 0 ? (
                        <div className="space-y-2">
                          {dayEvents.slice(0, 3).map((event, idx) => (
                            <div key={idx} className="text-xs">
                              <p className="font-semibold text-foreground">
                                {event.taskName}
                              </p>
                              <p className="text-muted-foreground">
                                {event.courseName}
                              </p>
                              <p className="text-muted-foreground">
                                Due: {event.dueTime}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs">
                          <p className="font-semibold text-foreground">
                            No scheduled events
                          </p>
                          <p className="text-muted-foreground">
                            Hover another date to check.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sync to Google Calendar */}
      <button className="w-full py-2 rounded-lg border border-primary text-primary font-medium text-sm smooth-transition hover:bg-primary/10">
        📅 Sync to Google Calendar
      </button>
    </div>
  );
}
