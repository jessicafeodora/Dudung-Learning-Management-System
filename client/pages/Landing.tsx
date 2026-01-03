import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Check, Eye, EyeOff, X } from "lucide-react";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { cn } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  author: string;
  date: string;
  time: string;
  preview: string;
  tag?: "NEW" | "IMPORTANT";
}

const announcements: Announcement[] = [
  {
    id: "1",
    title: "[NEW] Welcome to Dudung SmartEdu beta for students",
    author: "Admin - Academic Information Center",
    date: "15 Mar 2025",
    time: "09:10",
    preview:
      "We are excited to launch the first public beta of Dudung SmartEdu for Dudung University students. Explore our courses, track your progress, and join workshops with a seamlessly integrated, glassmorphic interface designed for modern learning.",
    tag: "NEW",
  },
  {
    id: "2",
    title: "[IMPORTANT] Midterm exam schedule & online proctoring",
    author: "IT Support - IST Jurusan",
    date: "14 Mar 2025",
    time: "16:30",
    preview:
      "Please review the updated midterm exam schedule inside your course pages. All exams will use online proctoring. This will be 04:00 to 05:00 to improve performance and reliability. Please avoid critical submissions during this window.",
    tag: "IMPORTANT",
  },
  {
    id: "3",
    title: "Semester Kickoff & Onboarding Webinar",
    author: "Academic Office",
    date: "13 Mar 2025",
    time: "11:45",
    preview:
      "Join our live onboarding session to explore Dudung SmartEdu features, learn how to track your progress, submit assignments, and interact with lectures in real time.",
  },
  {
    id: "4",
    title: "System Maintenance Schedule for Midterm Week",
    author: "IT Support",
    date: "13 Mar 2025",
    time: "10:20",
    preview:
      "The platform will be undergoing scheduled maintenance next Sunday from 01:00 to 05:00 to improve performance and reliability. Please plan your activities accordingly.",
  },
];

function trimWords(text: string, maxWords: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")}…`;
}

export function Landing() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Announcements UX
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);
  const [activeAnnouncementId, setActiveAnnouncementId] = useState<string | null>(
    null
  );

  const [loginData, setLoginData] = useState({
    role: "Student" as "Student" | "Teacher",
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    role: "Student",
    fullname: "",
    npmNpwp: "",
    email: "",
    username: "",
    password: "",
  });

  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>(
    {}
  );

  const activeAnnouncement = useMemo(
    () => announcements.find((a) => a.id === activeAnnouncementId),
    [activeAnnouncementId]
  );

  const visibleAnnouncements = useMemo(() => {
    return showAllAnnouncements ? announcements : announcements.slice(0, 3);
  }, [showAllAnnouncements]);

  useEffect(() => {
    if (!activeAnnouncementId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveAnnouncementId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeAnnouncementId]);

  const handleAnnouncementMore = (id: string) => {
    setActiveAnnouncementId(id);
  };

  const handleLoginChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "role") {
      setRegisterData((prev) => ({
        ...prev,
        role: value as "Student" | "Teacher",
        npmNpwp: "",
        email: "",
      }));
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateRegister = () => {
    const errors: Record<string, string> = {};

    if (!registerData.fullname.trim()) {
      errors.fullname = "Full name is required";
    } else if (registerData.fullname.length > 50) {
      errors.fullname = "Full name must be 50 characters or less";
    }

    if (!registerData.npmNpwp.trim()) {
      errors.npmNpwp = `${registerData.role === "Student" ? "NPM" : "NPWP"} is required`;
    } else {
      const isStudent = registerData.role === "Student";
      const expected = isStudent ? 8 : 12;
      const actual = registerData.npmNpwp.length;
      if (actual !== expected) {
        errors.npmNpwp = `${isStudent ? "NPM" : "NPWP"} must be ${expected} digits`;
      }
    }

    if (!registerData.email.trim()) {
      errors.email = "Email is required";
    } else {
      const isStudent = registerData.role === "Student";
      const domain = isStudent ? "@student.dudung.ac.id" : "@staff.dudung.ac.id";
      if (!registerData.email.endsWith(domain)) {
        errors.email = `Email must end with ${domain}`;
      }
    }

    if (!registerData.username.trim()) {
      errors.username = "Username is required";
    } else if (registerData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    } else if (registerData.username.length > 20) {
      errors.username = "Username must be 20 characters or less";
    }

    if (!registerData.password.trim()) {
      errors.password = "Password is required";
    } else if (registerData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const pendingKey = (email: string) => `pending_profile:${email.toLowerCase()}`;

  const ensureProfile = async (userId: string, email: string) => {
    const { data: existing, error: selectErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (selectErr) throw selectErr;
    if (existing?.id) return;

    const pendingRaw = localStorage.getItem(pendingKey(email));
    const pending = pendingRaw ? (JSON.parse(pendingRaw) as any) : null;
    if (!pending) return;

    const payload = {
      id: userId,
      email,
      full_name: pending.full_name ?? pending.fullname ?? null,
      npm: pending.npm ?? pending.npmNpwp ?? null,
      avatar_url: null,
    };

    const { error: insertErr } = await supabase.from("profiles").insert(payload);
    if (!insertErr) {
      localStorage.removeItem(pendingKey(email));
      return;
    }
    console.warn("Profile insert failed:", insertErr);
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;

    try {
      localStorage.setItem(
        pendingKey(registerData.email),
        JSON.stringify({
          role: registerData.role,
          full_name: registerData.fullname,
          npm: registerData.npmNpwp,
          username: registerData.username,
        })
      );

      const { data, error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
      });

      if (error) throw error;

      setIsLoginMode(true);

      const newUser = data.user;
      const session = data.session;

      if (newUser && session) {
        await ensureProfile(newUser.id, registerData.email);
        toast({ title: "Registration successful", description: "Welcome! Redirecting…" });
        navigate("/dashboard");
        return;
      }

      toast({
        title: "Confirm your email",
        description:
          "We sent a confirmation link to your email. After confirming, please sign in.",
      });
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
      if (error) throw error;

      const authedUser = data.user;
      if (authedUser?.id && authedUser.email) {
        await ensureProfile(authedUser.id, authedUser.email);
      }

      toast({ title: "Signed in", description: "Redirecting to dashboard…" });
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Sign in failed",
        description: err?.message ?? "Please check your credentials.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Transform the way you learn — anytime, anywhere.
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              SmartEdu integrates modern learning, progress tracking, and instant
              interaction in one platform.
            </p>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("landing-main")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="mt-6 text-primary hover:text-primary/80 font-medium smooth-transition"
            >
            </button>
          </div>

          {/* Main Content - Tablet 60/40, Mobile: form first */}
          <div
            id="landing-main"
            className="grid grid-cols-1 md:grid-cols-12 gap-8"
          >
            {/* Auth Form (40%) */}
            <div className="md:col-span-5 order-1 md:order-2">
              <div className="glassmorphism p-8 md:sticky md:top-24">
                {/* Auth Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    Welcome to SmartEdu
                  </h2>
                  <p className="text-sm text-foreground/70">
                    Transform the way you learn — anytime, anywhere.
                  </p>
                </div>

                {/* Form Content */}
                {isLoginMode ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-foreground whitespace-nowrap">
                        Sign in as
                      </label>
                      <div className="flex gap-2 flex-1">
                        {["Student", "Teacher"].map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() =>
                              setLoginData((prev) => ({
                                ...prev,
                                role: role as "Student" | "Teacher",
                              }))
                            }
                            className={cn(
                              "flex-1 py-2 px-4 rounded-full font-medium smooth-transition text-sm",
                              loginData.role === role
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-white/30 dark:bg-white/10 text-foreground hover:bg-white/40 dark:hover:bg-white/15"
                            )}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email
                        <span className="text-destructive ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        placeholder="name@student.dudung.ac.id"
                        className={cn(
                          "w-full px-4 py-3 rounded-lg border",
                          "bg-white/50 dark:bg-white/10",
                          "border-white/30 dark:border-white/20",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                          "placeholder:text-muted-foreground text-sm"
                        )}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Password
                        <span className="text-destructive ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          placeholder="••••••••"
                          className={cn(
                            "w-full px-4 py-3 rounded-lg border pr-10",
                            "bg-white/50 dark:bg-white/10",
                            "border-white/30 dark:border-white/20",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                            "placeholder:text-muted-foreground text-sm"
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground smooth-transition"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-full font-medium btn-primary mt-6 flex items-center justify-center gap-2 shadow-md"
                    >
                      <Check className="w-5 h-5" />
                      Login
                    </button>

                    <div className="my-4 border-t border-white/20" />

                    <div className="text-center text-sm">
                      <span className="text-foreground/70">
                        New in here?{" "}
                        <button
                          type="button"
                          onClick={() => setIsLoginMode(false)}
                          className="text-primary hover:underline font-medium smooth-transition"
                        >
                          Register here
                        </button>
                      </span>
                    </div>
                  </form>
                ) : (
                  <form
                    onSubmit={handleRegisterSubmit}
                    className="space-y-5 max-h-[600px] overflow-y-auto"
                  >
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-foreground whitespace-nowrap">
                        Register as
                      </label>
                      <div className="flex gap-2 flex-1">
                        {["Student", "Teacher"].map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() =>
                              setRegisterData((prev) => ({
                                ...prev,
                                role: role as "Student" | "Teacher",
                                npmNpwp: "",
                              }))
                            }
                            className={cn(
                              "flex-1 py-2 px-4 rounded-full font-medium smooth-transition text-sm",
                              registerData.role === role
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-white/30 dark:bg-white/10 text-foreground hover:bg-white/40 dark:hover:bg-white/15"
                            )}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Fullname
                        <span className="text-destructive ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullname"
                        value={registerData.fullname}
                        onChange={handleRegisterChange}
                        placeholder="Enter your full name"
                        maxLength={50}
                        className={cn(
                          "w-full px-4 py-3 rounded-lg border text-sm",
                          "bg-white/50 dark:bg-white/10",
                          "border-white/30 dark:border-white/20",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                          "placeholder:text-muted-foreground",
                          registerErrors.fullname &&
                            "border-destructive focus:ring-destructive"
                        )}
                      />
                      {registerErrors.fullname && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {registerErrors.fullname}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {registerData.role === "Student" ? "NPM" : "NPWP"}
                        <span className="text-destructive ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="npmNpwp"
                        value={registerData.npmNpwp}
                        onChange={handleRegisterChange}
                        placeholder={
                          registerData.role === "Student"
                            ? "NPM (8 digits)"
                            : "NPWP (12 digits)"
                        }
                        maxLength={registerData.role === "Student" ? 8 : 12}
                        className={cn(
                          "w-full px-4 py-3 rounded-lg border text-sm",
                          "bg-white/50 dark:bg-white/10",
                          "border-white/30 dark:border-white/20",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                          "placeholder:text-muted-foreground",
                          registerErrors.npmNpwp &&
                            "border-destructive focus:ring-destructive"
                        )}
                      />
                      {registerErrors.npmNpwp && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {registerErrors.npmNpwp}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email
                        <span className="text-destructive ml-1">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        placeholder={
                          registerData.role === "Student"
                            ? "email@student.dudung.ac.id"
                            : "email@staff.dudung.ac.id"
                        }
                        className={cn(
                          "w-full px-4 py-3 rounded-lg border text-sm",
                          "bg-white/50 dark:bg-white/10",
                          "border-white/30 dark:border-white/20",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                          "placeholder:text-muted-foreground",
                          registerErrors.email &&
                            "border-destructive focus:ring-destructive"
                        )}
                      />
                      {registerErrors.email && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {registerErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Username
                        <span className="text-destructive ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={registerData.username}
                        onChange={handleRegisterChange}
                        placeholder="Choose a unique username"
                        className={cn(
                          "w-full px-4 py-3 rounded-lg border text-sm",
                          "bg-white/50 dark:bg-white/10",
                          "border-white/30 dark:border-white/20",
                          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                          "placeholder:text-muted-foreground",
                          registerErrors.username &&
                            "border-destructive focus:ring-destructive"
                        )}
                      />
                      {registerErrors.username && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {registerErrors.username}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Password
                        <span className="text-destructive ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          placeholder="Create a strong password"
                          className={cn(
                            "w-full px-4 py-3 rounded-lg border pr-10 text-sm",
                            "bg-white/50 dark:bg-white/10",
                            "border-white/30 dark:border-white/20",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                            "placeholder:text-muted-foreground",
                            registerErrors.password &&
                              "border-destructive focus:ring-destructive"
                          )}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground smooth-transition"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {registerErrors.password && (
                        <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {registerErrors.password}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-full font-medium btn-primary mt-6 flex items-center justify-center gap-2 shadow-md"
                    >
                      <Check className="w-5 h-5" />
                      Register
                    </button>

                    <div className="my-4 border-t border-white/20" />

                    <div className="text-center text-sm">
                      <span className="text-foreground/70">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setIsLoginMode(true)}
                          className="text-primary hover:underline font-medium smooth-transition"
                        >
                          Login
                        </button>
                      </span>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Announcements (60%) */}
            <div className="md:col-span-7 order-2 md:order-1">
              <div className="space-y-4">
                <div className="flex items-end justify-between gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    Announcements
                  </h2>
                  {announcements.length > 3 && (
                    <button
                      type="button"
                      onClick={() => setShowAllAnnouncements((v) => !v)}
                      className="text-sm text-primary hover:underline font-medium smooth-transition"
                    >
                      {showAllAnnouncements ? "See less" : "See more"}
                    </button>
                  )}
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4">
                  {visibleAnnouncements.map((announcement) => (
                    <AnnouncementCard
                      key={announcement.id}
                      {...announcement}
                      preview={trimWords(announcement.preview, 100)}
                      onMoreClick={handleAnnouncementMore}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Announcement Modal */}
      {activeAnnouncement && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onMouseDown={() => setActiveAnnouncementId(null)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-2xl glassmorphism p-6 sm:p-8"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {activeAnnouncement.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  By {activeAnnouncement.author} • {activeAnnouncement.date} •{" "}
                  {activeAnnouncement.time}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveAnnouncementId(null)}
                className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-white/10 smooth-transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-1">
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {activeAnnouncement.preview}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveAnnouncementId(null)}
                className="px-5 py-2 rounded-full bg-white/30 dark:bg-white/10 hover:bg-white/40 dark:hover:bg-white/15 text-foreground font-medium smooth-transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
