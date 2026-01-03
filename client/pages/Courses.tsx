import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CourseCardWithProgress } from "@/components/CourseCardWithProgress";

const sampleCourses = Array.from({ length: 6 }, (_, i) => ({
  id: `course-${i + 1}`,
  title: [
    "Data Structures & Algorithms",
    "Web Programming",
    "Intro to AI",
    "Database Systems",
    "Cloud Computing",
    "Mobile Development",
  ][i],
  instructor: [
    "DR. Rahma",
    "Budi Santoso",
    "Andi Pratama",
    "Lina Patel",
    "Ahmad Hassan",
    "Emma Wilson",
  ][i],
  progress: [70, 45, 30, 60, 20, 80][i],
  lastAccessed: [
    "Last accessed yesterday",
    "Last accessed 2 days ago",
    "Last accessed 5 days ago",
    "Last accessed 1 week ago",
    "Last accessed 3 days ago",
    "Last accessed today",
  ][i],
  imageUrl: [
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=600&q=80",
  ][i],
}));

export default function CoursesPage() {
  const navigate = useNavigate();

  const courses = useMemo(() => sampleCourses, []);

  const handleCourseAction = (action: string, courseId: string) => {
    // Keep this deterministic & no side effects (we'll wire to real data later)
    if (action === "details" || action === "continue") {
      navigate(`/course/${courseId}`);
      return;
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
            <p className="text-muted-foreground mt-1">
              Continue learning from where you left off.
            </p>
          </div>

          <Link
            to="/workshops"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-2xl font-medium bg-white/15 dark:bg-white/10 hover:bg-white/25 dark:hover:bg-white/15 smooth-transition border border-white/20"
          >
            Workshops & Certification
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCardWithProgress
              key={course.id}
              {...course}
              onAction={handleCourseAction}
            />
          ))}
        </div>

        <div className="sm:hidden mt-6">
          <Link
            to="/workshops"
            className="w-full inline-flex items-center justify-center px-4 py-3 rounded-2xl font-medium bg-white/15 dark:bg-white/10 hover:bg-white/25 dark:hover:bg-white/15 smooth-transition border border-white/20"
          >
            Workshops & Certification
          </Link>
        </div>
      </div>

      {/* Add padding for mobile to account for bottom nav */}
      <div className="h-24 md:hidden" />
    </div>
  );
}
