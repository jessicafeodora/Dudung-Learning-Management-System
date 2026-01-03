import { useEffect, useState } from "react";
import { ArrowLeft, Play, Volume2, Maximize, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const sampleCourse = {
  id: "1",
  title: "Data Structures & Algorithms",
  totalDuration: "12 hours 30 minutes",
  currentLesson: {
    number: 1,
    title: "Welcome & Course Structure",
    description:
      "In this introductory lesson, we'll explore the course structure, learning objectives, and how to get the most out of this comprehensive data structures and algorithms course.",
    duration: "15 minutes",
    completed: false,
  },
  progress: 8,
  totalLessons: 12,
};

const sampleLessons = [
  { number: 1, title: "Welcome & Course Structure", duration: "15 min", completed: false },
  { number: 2, title: "Arrays and Lists Fundamentals", duration: "45 min", completed: false },
  { number: 3, title: "Linked Lists Implementation", duration: "50 min", completed: true },
  { number: 4, title: "Stacks and Queues", duration: "40 min", completed: true },
  { number: 5, title: "Trees - Basic Concepts", duration: "55 min", completed: true },
  { number: 6, title: "Binary Search Trees", duration: "50 min", completed: true },
  { number: 7, title: "Tree Traversal Methods", duration: "45 min", completed: true },
  { number: 8, title: "Graphs - Introduction", duration: "60 min", completed: true },
  { number: 9, title: "Recursion Basics", duration: "40 min", completed: false },
  { number: 10, title: "Sorting Algorithms", duration: "90 min", completed: false },
  { number: 11, title: "Searching Algorithms", duration: "50 min", completed: false },
  { number: 12, title: "Course Review & Project", duration: "120 min", completed: false },
];

export function CourseDetail() {
  const [currentLessonNumber, setCurrentLessonNumber] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Keyboard navigation: ← / → to switch lessons (when not typing in an input/textarea)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTypingTarget =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          (target as HTMLElement).isContentEditable);

      if (isTypingTarget) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePreviousLesson();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextLesson();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLessonNumber]);

  const handlePreviousLesson = () => {
    if (currentLessonNumber > 1) {
      setCurrentLessonNumber(currentLessonNumber - 1);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonNumber < sampleLessons.length) {
      setCurrentLessonNumber(currentLessonNumber + 1);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handleLessonSelect = (lessonNumber: number) => {
    setCurrentLessonNumber(lessonNumber);
    setProgress(0);
    setIsPlaying(false);
  };

  const currentLesson = sampleLessons[currentLessonNumber - 1];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/courses"
            className="flex items-center gap-2 text-primary hover:text-primary/80 smooth-transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Course Detail</span>
          </Link>
        </div>

        {/* Course Title and Breadcrumb */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-2">Module</p>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {sampleCourse.title}
          </h1>
          <p className="text-muted-foreground">
            Lesson {currentLessonNumber} • {currentLesson.title}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Video Player and Lesson (70%) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player */}
            <div className="glassmorphism overflow-hidden">
              {/* Video Area */}
              <div className="relative w-full aspect-video bg-black/80 flex items-center justify-center group cursor-pointer">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute w-16 h-16 rounded-full bg-primary/80 hover:bg-primary text-white flex items-center justify-center smooth-transition group-hover:scale-110 z-10"
                >
                  <Play className="w-8 h-8 ml-1" fill="white" />
                </button>

                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 smooth-transition">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary smooth-transition"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-white text-xs font-mono">
                      {Math.floor((progress / 100) * 15)}:00 / 15:00
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <button className="p-2 hover:bg-white/20 rounded-lg smooth-transition">
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-white/20 rounded-lg smooth-transition">
                      <Maximize className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Details */}
            <div className="glassmorphism p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {currentLesson.title}
                  </h2>
                  <p className="text-muted-foreground">
                    Duration: {currentLesson.duration}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-semibold">
                    Progress · {sampleCourse.progress}%
                  </span>
                </div>
              </div>

              <div className="border-t border-white/20 pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Lesson Content
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  {sampleCourse.currentLesson.description}
                </p>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="glassmorphism p-6 space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={handlePreviousLesson}
                  disabled={currentLessonNumber === 1}
                  className={cn(
                    "flex-1 py-3 rounded-2xl font-medium smooth-transition flex items-center justify-center gap-2",
                    currentLessonNumber === 1
                      ? "btn-outline opacity-50 cursor-not-allowed"
                      : "btn-outline hover:bg-white/20 dark:hover:bg-white/10"
                  )}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous lesson
                </button>
                <button
                  onClick={handleNextLesson}
                  disabled={currentLessonNumber === sampleLessons.length}
                  className={cn(
                    "flex-1 py-3 rounded-2xl font-medium smooth-transition flex items-center justify-center gap-2",
                    currentLessonNumber === sampleLessons.length
                      ? "btn-primary opacity-50 cursor-not-allowed"
                      : "btn-primary hover:bg-primary/90"
                  )}
                >
                  Next lesson
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Use ← and → keys to navigate between lessons.
              </p>
            </div>
          </div>

          {/* Right Column - Course Outline (30%) */}
          <div>
            <div className="glassmorphism p-6 sticky top-24">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Course Outline
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Total duration: {sampleCourse.totalDuration}
              </p>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {sampleLessons.map((lesson) => (
                  <button
                    key={lesson.number}
                    onClick={() => handleLessonSelect(lesson.number)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg smooth-transition",
                      currentLessonNumber === lesson.number
                        ? "bg-primary/30 border border-primary text-foreground"
                        : "hover:bg-white/30 dark:hover:bg-white/10 text-foreground/80"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {lesson.completed ? (
                          <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                            <span className="text-green-700 dark:text-green-200 text-xs">
                              ✓
                            </span>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/40 flex items-center justify-center text-xs text-muted-foreground">
                            {lesson.number}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">
                          {lesson.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {lesson.duration}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Course Stats */}
              <div className="mt-6 pt-6 border-t border-white/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-bold text-primary">
                    {sampleCourse.progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-white/30 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary smooth-transition"
                    style={{ width: `${sampleCourse.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-right">
                  {currentLessonNumber} of {sampleLessons.length} lessons
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add padding for mobile to account for bottom nav */}
      <div className="h-24 md:hidden" />
    </div>
  );
}
