import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ContinueLearningCard } from "@/components/ContinueLearningCard";
import { CourseOverviewCard } from "@/components/CourseOverviewCard";
import { WorkshopCard } from "@/components/WorkshopCard";
import { TodoTask } from "@/components/TodoTask";
import { CalendarWidget } from "@/components/CalendarWidget";
import { cn } from "@/lib/utils";

const sampleUser = {
  name: "Alex Student",
  profileImage: "https://via.placeholder.com/64",
};

const sampleContinueLearning = {
  id: "1",
  subject: "Data Structures & Algorithms",
  lessonTitle: "Recursion Basics",
  lessonNumber: 8,
  totalLessons: 12,
  progress: 64,
};

const sampleRecentlyAccessed = [
  {
    id: "1",
    title: "UXUX Fundamentals",
    instructor: "John Doe",
    progress: 45,
    lastAccessed: "Yesterday",
  },
  {
    id: "2",
    title: "Cloud Basics Workshop",
    instructor: "Jane Smith",
    progress: 60,
    lastAccessed: "2 days ago",
  },
  {
    id: "3",
    title: "Python Certification",
    instructor: "Mike Johnson",
    progress: 75,
    lastAccessed: "Last week",
  },
  {
    id: "4",
    title: "Intro to Databases",
    instructor: "Sarah Lee",
    progress: 30,
    lastAccessed: "3 days ago",
  },
];

const sampleCourses = [
  {
    id: "1",
    title: "Usage Analytics I",
    instructor: "DR. Rahma",
    progress: 50,
    lastAccessed: "Sun, 17 Jan",
  },
  {
    id: "2",
    title: "Web Programming",
    instructor: "Budi Santoso",
    progress: 75,
    lastAccessed: "Mon, 18 Jan",
  },
  {
    id: "3",
    title: "Intro to AI",
    instructor: "Andi Pratama",
    progress: 40,
    lastAccessed: "Tue, 19 Jan",
  },
  {
    id: "4",
    title: "Database Systems",
    instructor: "Lina Patel",
    progress: 60,
    lastAccessed: "Sun, 17 Jan",
  },
  {
    id: "5",
    title: "Cloud Computing",
    instructor: "Ahmad Hassan",
    progress: 35,
    lastAccessed: "Wed, 20 Jan",
  },
  {
    id: "6",
    title: "Mobile Development",
    instructor: "Emma Wilson",
    progress: 45,
    lastAccessed: "Fri, 22 Jan",
  },
  {
    id: "7",
    title: "Machine Learning",
    instructor: "David Kim",
    progress: 25,
    lastAccessed: "Thu, 21 Jan",
  },
  {
    id: "8",
    title: "Cybersecurity",
    instructor: "Lisa Anderson",
    progress: 55,
    lastAccessed: "Sat, 23 Jan",
  },
];

const sampleTodos = [
  {
    id: "1",
    title: "Submit Assignment 2",
    courseName: "Web Programming",
    deadline: "19 Jan 2025, 23:59",
    status: "Overdue" as const,
  },
  {
    id: "2",
    title: "Prepare Midterm Quiz",
    courseName: "Database Systems",
    deadline: "20 Jan 2025, 15:00",
    status: "Due Today" as const,
  },
  {
    id: "3",
    title: "Watch Workshop Recording",
    courseName: "Cloud Basics Workshop",
    deadline: "25 Jan 2025, 17:00",
    status: "Upcoming" as const,
  },
];

type WorkshopLabel = "FREE" | "RECOMMENDED" | "EXCLUSIVE";

const sampleWorkshops: Array<{
  id: string;
  title: string;
  organizer: string;
  date: string;
  duration: string;
  labels: WorkshopLabel[];
}> = [
  {
    id: "1",
    title: "Data Literacy for All Students",
    organizer: "Organizer: Career Center",
    date: "20 Jan • 10:00-12:00",
    duration: "",
    labels: ["FREE", "RECOMMENDED"],
  },
  {
    id: "2",
    title: "Python Fundamentals Certification",
    organizer: "Instructor: Dr. Andi Pratama",
    date: "25 Jan • 08:00-16:00",
    duration: "",
    labels: ["EXCLUSIVE"],
  },
  {
    id: "3",
    title: "Career Readiness Bootcamp",
    organizer: "Organizer: Career Center",
    date: "26 Jan • 09:00-17:00",
    duration: "",
    labels: ["RECOMMENDED"],
  },
];

const sampleCalendarEvents = [
  {
    date: 15,
    taskName: "Assignment 1",
    courseName: "Web Programming",
    dueTime: "23:59",
    type: "deadline" as const,
  },
  {
    date: 18,
    taskName: "Midterm Exam",
    courseName: "Database Systems",
    dueTime: "14:00",
    type: "exam" as const,
  },
  {
    date: 20,
    taskName: "Project Submission",
    courseName: "Cloud Basics",
    dueTime: "17:00",
    type: "submission" as const,
  },
];

export function Dashboard() {
  const [openMenuCourse, setOpenMenuCourse] = useState<string | null>(null);

  // Keep Courses Overview layout stable by filling empty slots (up to 12).
  const coursesOverviewItems = useMemo(() => {
    const max = 12;
    const real = sampleCourses.slice(0, max);
    const placeholders = Array.from({ length: Math.max(0, max - real.length) }).map(
      (_, i) => ({
        id: `placeholder-${i + 1}`,
        title: "",
        instructor: "",
        progress: 0,
        lastAccessed: "",
        isPlaceholder: true as const,
      })
    );
    return [...real, ...placeholders];
  }, []);

  const handleCourseAction = (action: string, courseId: string) => {
    console.log(`Course action: ${action} for course ${courseId}`);
  };

  const handleWorkshopAction = (action: string, workshopId: string) => {
    console.log(`Workshop action: ${action} for workshop ${workshopId}`);
  };

  const handleTodoClick = (taskId: string) => {
    console.log(`Todo clicked: ${taskId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Profile Section */}
        <div className="mb-12 flex items-center gap-6">
          <Link
            to="/profile"
            className="relative group"
            aria-label="Manage profile"
            title="Manage profile"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            {/* Tooltip */}
            <div
              className={cn(
                "pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-3",
                "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0",
                "smooth-transition"
              )}
              role="tooltip"
            >
              <div className="glassmorphism-light px-3 py-1.5 rounded-xl text-xs font-medium text-foreground shadow-lg">
                Manage Profile
              </div>
            </div>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Hello, {sampleUser.name}
            </h1>
            <p className="text-lg text-muted-foreground">
              Let's continue learning
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content (70%) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Continue Learning
              </h2>
              <ContinueLearningCard {...sampleContinueLearning} />
            </section>

            {/* Recently Accessed */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Recently Accessed
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                {sampleRecentlyAccessed.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex-shrink-0 w-48 h-32 glassmorphism p-4",
                      "flex items-end justify-between snap-center"
                    )}
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Accessed {item.lastAccessed}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Courses Overview */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Courses Overview
                </h2>
                <button className="text-primary hover:text-primary/80 font-medium smooth-transition">
                  View all
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {coursesOverviewItems.map((course) => (
                  <CourseOverviewCard
                    key={course.id}
                    {...course}
                    onAction={handleCourseAction}
                  />
                ))}
              </div>
            </section>

            {/* Calendar */}
            <section>
              <CalendarWidget events={sampleCalendarEvents} />
            </section>
          </div>

          {/* Right Column - Sidebar Widgets (30%) */}
          <div className="space-y-8">
            {/* To-do List */}
            <section>
              <h3 className="text-xl font-bold text-foreground mb-4">To do</h3>
              <div className="space-y-3">
                {sampleTodos.map((task) => (
                  <TodoTask
                    key={task.id}
                    {...task}
                    onClick={handleTodoClick}
                  />
                ))}
              </div>
            </section>

            {/* Workshop & Certification */}
            <section>
              <h3 className="text-xl font-bold text-foreground mb-4">
                Workshop & Certification
              </h3>
              <div className="space-y-4">
                {sampleWorkshops.map((workshop) => (
                  <WorkshopCard
                    key={workshop.id}
                    {...workshop}
                    onAction={handleWorkshopAction}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Add padding for mobile to account for bottom nav */}
      <div className="h-24 md:hidden" />
    </div>
  );
}
