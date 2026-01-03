import { useMemo, useState } from "react";
import { SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SearchResultCard } from "@/components/SearchResultCard";
import { cn } from "@/lib/utils";

type ContentType = "All" | "Course" | "Workshop" | "Certificate";

const allResults = [
  {
    id: "1",
    title: "Introduction to Data Science",
    description: "Learn the fundamentals of data science and analytics",
    type: "Course" as const,
    instructor: "Dr. Rahma",
    lastUpdated: "5 Jan 2025",
    tags: ["Beginner", "Data"],
  },
  {
    id: "2",
    title: "UXUX Design Workshop: From Zero to Prototype",
    description: "Create your first prototype in just 3 hours",
    type: "Workshop" as const,
    instructor: "Design Center",
    lastUpdated: "10 Jan 2025",
    tags: ["Design", "Hands-on"],
  },
  {
    id: "3",
    title: "Fundamentals of Cloud Computing",
    description: "Master cloud infrastructure and deployment",
    type: "Certificate" as const,
    instructor: "Dr. Andi Pratama",
    lastUpdated: "15 Jan 2025",
    tags: ["Cloud", "Credential"],
  },
  {
    id: "4",
    title: "Web Programming Essentials",
    description: "Build modern web applications with HTML, CSS, and JavaScript",
    type: "Course" as const,
    instructor: "Budi Santoso",
    lastUpdated: "8 Jan 2025",
    tags: ["Web", "Frontend"],
  },
  {
    id: "5",
    title: "Public Speaking Masterclass",
    description: "Develop confident public speaking skills",
    type: "Workshop" as const,
    instructor: "Career Center",
    lastUpdated: "12 Jan 2025",
    tags: ["Soft skill", "Career"],
  },
  {
    id: "6",
    title: "Academic Writing Essentials",
    description: "Perfect your academic writing techniques",
    type: "Certificate" as const,
    instructor: "Dr. Ahmed Said",
    lastUpdated: "18 Jan 2025",
    tags: ["Writing", "Academic"],
  },
  {
    id: "7",
    title: "Python for Data Analysis",
    description: "Advanced Python programming for data professionals",
    type: "Course" as const,
    instructor: "Mike Johnson",
    lastUpdated: "11 Jan 2025",
    tags: ["Python", "Data"],
  },
  {
    id: "8",
    title: "Soft Skills Bootcamp: Communication at Work",
    description: "Enhance your workplace communication abilities",
    type: "Workshop" as const,
    instructor: "Career Center",
    lastUpdated: "14 Jan 2025",
    tags: ["Communication", "Team"],
  },
  {
    id: "9",
    title: "Cybersecurity Basics",
    description: "Understand the fundamentals of cybersecurity",
    type: "Certificate" as const,
    instructor: "Prof. Lisa Anderson",
    lastUpdated: "20 Jan 2025",
    tags: ["Security", "Basics"],
  },
  {
    id: "10",
    title: "Database Design and Management",
    description: "Design and manage complex database systems",
    type: "Course" as const,
    instructor: "Lina Patel",
    lastUpdated: "9 Jan 2025",
    tags: ["Database", "SQL"],
  },
  {
    id: "11",
    title: "Machine Learning Workshop",
    description: "Get started with machine learning algorithms",
    type: "Workshop" as const,
    instructor: "DataTech Institute",
    lastUpdated: "16 Jan 2025",
    tags: ["AI", "Practice"],
  },
  {
    id: "12",
    title: "Mobile App Development Certificate",
    description: "Build native and cross-platform mobile applications",
    type: "Certificate" as const,
    instructor: "Emma Wilson",
    lastUpdated: "19 Jan 2025",
    tags: ["Mobile", "Credential"],
  },
  {
    id: "13",
    title: "Intro to AI and Machine Learning",
    description: "Explore artificial intelligence fundamentals",
    type: "Course" as const,
    instructor: "Andi Pratama",
    lastUpdated: "13 Jan 2025",
    tags: ["AI", "Intro"],
  },
  {
    id: "14",
    title: "Portfolio Building for Fresh Graduates",
    description: "Create a compelling professional portfolio",
    type: "Workshop" as const,
    instructor: "Career Center",
    lastUpdated: "17 Jan 2025",
    tags: ["Portfolio", "Career"],
  },
  {
    id: "15",
    title: "Advanced JavaScript Certificate",
    description: "Master advanced JavaScript concepts and patterns",
    type: "Certificate" as const,
    instructor: "Sarah Lee",
    lastUpdated: "21 Jan 2025",
    tags: ["JavaScript", "Advanced"],
  },
];

const ITEMS_PER_PAGE = 9;

export function Search() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<ContentType>("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return allResults.filter((item) => {
      const matchesSearch =
        q.length === 0 ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.instructor.toLowerCase().includes(q) ||
        (item.tags || []).some((t) => t.toLowerCase().includes(q));

      const matchesType = filterType === "All" || item.type === filterType;

      return matchesSearch && matchesType;
    });
  }, [searchQuery, filterType]);

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedResults = filteredResults.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleFilterChange = (type: ContentType) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToResult = (result: (typeof allResults)[number]) => {
    // NOTE: only Courses have a dedicated detail page in the current scope.
    if (result.type === "Course") {
      navigate(`/course/${result.id}`);
      return;
    }
    // Workshops & Certificates live under a combined page.
    navigate("/workshops");
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <h1 className="text-3xl font-bold text-foreground mb-2">Search</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Find courses, workshops, and certificates across Dudung SmartEdu.
        </p>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, instructor, or keyword"
              value={searchQuery}
              onChange={handleSearch}
              className={cn("input-glass w-full pl-12 pr-12 py-3 rounded-2xl")}
            />

            {searchQuery.trim().length > 0 && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 icon-btn"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex gap-2">
            <label className="text-sm font-medium text-foreground">
              Filter:
            </label>
            <select
              value={filterType}
              onChange={(e) =>
                handleFilterChange(e.target.value as ContentType)
              }
              className={cn("input-glass px-4 py-2 rounded-xl")}
            >
              <option value="All">Default (all)</option>
              <option value="Course">Course</option>
              <option value="Workshop">Workshop</option>
              <option value="Certificate">Certificate</option>
            </select>
          </div>

          <p className="text-sm text-muted-foreground">
            Showing {paginatedResults.length > 0 ? startIndex + 1 : 0} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredResults.length)} of{" "}
            {filteredResults.length} results
          </p>
        </div>

        {/* Search Results */}
        {paginatedResults.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedResults.map((result) => (
                <SearchResultCard
                  key={result.id}
                  {...result}
                  onClick={() => goToResult(result)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                  "p-2 rounded-lg border smooth-transition",
                  "border-white/30 dark:border-white/20",
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/30 dark:hover:bg-white/10"
                )}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium smooth-transition",
                        currentPage === page
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/30 dark:bg-white/10 hover:bg-white/40 dark:hover:bg-white/15 text-foreground"
                      )}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                  "p-2 rounded-lg border smooth-transition",
                  "border-white/30 dark:border-white/20",
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/30 dark:hover:bg-white/10"
                )}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No results found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search query or filters
            </p>
          </div>
        )}
      </div>

      {/* Add padding for mobile to account for bottom nav */}
      <div className="h-24 md:hidden" />
    </div>
  );
}
