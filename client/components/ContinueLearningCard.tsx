import { cn } from "@/lib/utils";

interface ContinueLearningCardProps {
  id: string;
  subject: string;
  lessonTitle: string;
  lessonNumber: number;
  totalLessons: number;
  progress: number;
  imageUrl?: string;
}

export function ContinueLearningCard({
  id,
  subject,
  lessonTitle,
  lessonNumber,
  totalLessons,
  progress,
  imageUrl,
}: ContinueLearningCardProps) {
  return (
    <div
      className={cn(
        "glassmorphism overflow-hidden hover:shadow-lg hover:-translate-y-1",
        "smooth-transition cursor-pointer group"
      )}
    >
      {/* Image section */}
      <div className="h-40 bg-gradient-to-br from-primary/30 to-secondary/30 overflow-hidden relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={subject}
            className="w-full h-full object-cover group-hover:scale-105 smooth-transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2">{subject}</h3>
          <p className="text-sm text-muted-foreground">
            Lesson {lessonNumber} • {lessonTitle}
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="w-full h-2 bg-white/30 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary smooth-transition"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">
            {progress}% Complete — {lessonNumber} of {totalLessons} Lessons
          </p>
        </div>

        {/* CTA Button */}
        <button className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium smooth-transition hover:bg-primary/90">
          Continue Learning
        </button>
      </div>
    </div>
  );
}
