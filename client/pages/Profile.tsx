import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Download, Share2, Eye, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { SIGN_OUT_SCOPES } from "@supabase/supabase-js";

const sampleCompletedWorkshops = Array.from({ length: 6 }, (_, i) => ({
  id: `workshop-${i + 1}`,
  title: [
    "Fundamental Workshop of Soft Skills",
    "UXUX Design Sprint",
    "Career Readiness Bootcamp",
    "Python Fundamentals",
    "Data Science Essentials",
    "Leadership Training",
  ][i],
  instructor: ["Dr. Andi Pratama", "Design Center", "Career Center", "Mike Johnson", "Dr. Ahmed Said", "Prof. Lisa Anderson"][i],
  completion: "100%",
}));

const sampleCertificates = Array.from({ length: 6 }, (_, i) => ({
  id: `cert-${i + 1}`,
  title: [
    "Fundamentals of Cloud Computing",
    "Academic Writing Essentials",
    "Cybersecurity Basics",
    "Mobile App Development",
    "Machine Learning Foundations",
    "Advanced JavaScript",
  ][i],
  issuedDate: ["20 Jan 2025", "15 Jan 2025", "22 Jan 2025", "10 Jan 2025", "18 Jan 2025", "25 Jan 2025"][i],
  certificateId: ["CERT-2025-001", "CERT-2025-002", "CERT-2025-003", "CERT-2025-004", "CERT-2025-005", "CERT-2025-006"][i],
  instructor: ["Dr. Andi Pratama", "Dr. Ahmed Said", "Prof. Lisa Anderson", "Emma Wilson", "David Kim", "Sarah Lee"][i],
}));

export function Profile() {
  const navigate = useNavigate();
  const { profile, updateProfile, signOut } = useAuth();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    npm: "",
    address: "123 Learning Street, Knowledge City",
    mothersName: "Jane Doe",
    idNumber: "3204001234567890",
    studentNumber: "STU-2022-12345",
    phoneNumber: "+62-812-3456-7890",
    email: "alex.student@student.dudung.ac.id",
  });


  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      // Fast-path: hydrate UI from auth context profile while Supabase fetch runs.
      if (Profile) {
        setFormData((prev) => ({
          ...prev,
          name: (profile.full_name ?? prev.name ?? "").toString(),
          npm: (profile.npm ?? prev.npm ?? "").toString(),
          email: (profile.email ?? user.email ?? "").toString(),
        }));
      }

      setLoadingProfile(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id,email,full_name,npm,avatar_url")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        // If profile doesn't exist yet, create a minimal row.
        if (!data?.id) {
          const { error: upsertErr } = await supabase.from("profiles").upsert(
            {
              id: user.id,
              email: user.email ?? null,
              full_name: null,
              npm: null,
              avatar_url: null,
            },
            { onConflict: "id" }
          );
          if (upsertErr) throw upsertErr;
        }

        const email = (data?.email ?? user.email ?? "").toString();
        setFormData((prev) => ({
          ...prev,
          name: (data?.full_name ?? prev.name ?? "").toString(),
          npm: (data?.npm ?? prev.npm ?? "").toString(),
          email,
        }));
      } catch (err: any) {
        toast({
          title: "Failed to load profile",
          description: err?.message ?? "Please refresh and try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user, Profile, toast]);

  // Institutional email rule (spec): if email is the default student domain,
  // treat it as read-only.
  const isInstitutionalEmail = /@student\.dudung\.ac\.id$/i.test(formData.email);

  const fillToTwelve = <T extends { id: string }>(items: T[], prefix: string) => {
    const trimmed = items.slice(0, 12);
    const placeholders = Array.from({ length: Math.max(0, 12 - trimmed.length) }, (_, i) => ({
      id: `${prefix}-placeholder-${i + 1}`,
      __placeholder: true as const,
    }));
    return [...trimmed, ...placeholders] as Array<T | { id: string; __placeholder: true }>;
  };

  const workshopsForUI = fillToTwelve(sampleCompletedWorkshops, "workshop");
  const certificatesForUI = fillToTwelve(sampleCertificates, "cert");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "name" || name === "npm") return;
    if (name === "email" && isInstitutionalEmail) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateProfile({
        full_name: formData.name || null,
        npm: formData.npm || null,
      });

      setIsEditing(false);
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 overflow-x-hidden">
      <div className="container mx-auto px-4 py-12">
        {loadingProfile && (
          <div className="mb-6 glassmorphism px-4 py-3 text-sm text-muted-foreground">
            Loading profile…
          </div>
        )}
        {/* Profile Header */}
        <div className="mb-12 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl">
            👤
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Hello, {formData.name}
            </h1>
            <p className="text-lg text-muted-foreground">
              Let's continue learning
            </p>
          </div>
        </div>

        {/* User Details Form */}
        <div className="glassmorphism p-8 mb-12 max-w-2xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            User Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  disabled={!isEditing}
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border",
                    "bg-white/30 dark:bg-white/5",
                    "border-white/20 dark:border-white/10",
                    "text-muted-foreground cursor-not-allowed opacity-60"
                  )}
                />
              </div>

              {/* NPM */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  NPM
                </label>
                <input
                  type="text"
                  name="npm"
                  value={formData.npm}
                  disabled
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border",
                    "bg-white/30 dark:bg-white/5",
                    "border-white/20 dark:border-white/10",
                    "text-muted-foreground cursor-not-allowed opacity-60"
                  )}
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your address"
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border",
                    "bg-white/50 dark:bg-white/10",
                    "border-white/30 dark:border-white/20",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    "placeholder:text-muted-foreground",
                    !isEditing && "opacity-60 cursor-not-allowed"
                  )}
                />
              </div>

              {/* Mother's Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Mother's Name
                </label>
                <input
                  type="text"
                  name="mothersName"
                  value={formData.mothersName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter mother's name"
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border",
                    "bg-white/50 dark:bg-white/10",
                    "border-white/30 dark:border-white/20",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    "placeholder:text-muted-foreground",
                    !isEditing && "opacity-60 cursor-not-allowed"
                  )}
                />
              </div>

              {/* ID Number */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  ID Number
                </label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your ID number"
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border",
                    "bg-white/50 dark:bg-white/10",
                    "border-white/30 dark:border-white/20",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    "placeholder:text-muted-foreground",
                    !isEditing && "opacity-60 cursor-not-allowed"
                  )}
                />
              </div>

              {/* Student Number */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Student Number
                </label>
                <input
                  type="text"
                  name="studentNumber"
                  value={formData.studentNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your student number"
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border",
                    "bg-white/50 dark:bg-white/10",
                    "border-white/30 dark:border-white/20",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    "placeholder:text-muted-foreground",
                    !isEditing && "opacity-60 cursor-not-allowed"
                  )}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your phone number"
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border",
                    "bg-white/50 dark:bg-white/10",
                    "border-white/30 dark:border-white/20",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    "placeholder:text-muted-foreground",
                    !isEditing && "opacity-60 cursor-not-allowed"
                  )}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing || isInstitutionalEmail}
                  placeholder="Enter your email"
                  className={cn(
                    "w-full px-4 py-2 rounded-lg border",
                    "bg-white/50 dark:bg-white/10",
                    "border-white/30 dark:border-white/20",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    "placeholder:text-muted-foreground text-sm",
                    (!isEditing || isInstitutionalEmail) && "opacity-60 cursor-not-allowed"
                  )}
                />
                {isInstitutionalEmail && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Institutional email is read-only.
                  </p>
                )}
              </div>

              {/* Formal Photo */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Formal Photo
                </label>
                <button
                  type="button"
                  disabled={!isEditing}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border-2 border-dashed",
                    "border-white/30 dark:border-white/20",
                    "flex items-center justify-center gap-2",
                    "smooth-transition",
                    isEditing
                      ? "hover:bg-white/30 dark:hover:bg-white/10 cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Upload Photo
                  </span>
                </button>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4 border-t border-white/20">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className={cn(
                    "px-6 py-3 rounded-2xl font-medium",
                    "btn-outline"
                  )}
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className={cn(
                      "px-6 py-3 rounded-2xl font-medium",
                      "btn-outline"
                    )}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={cn(
                      "px-6 py-3 rounded-2xl font-medium",
                      "btn-primary"
                    )}
                  >
                    Submit
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* My Workshops */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            My Workshops
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {workshopsForUI.map((workshop) => {
              const isPlaceholder = (workshop as any).__placeholder === true;
              return (
                <div
                  key={workshop.id}
                  className={cn(
                    "glassmorphism overflow-hidden smooth-transition flex flex-col",
                    isPlaceholder
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-lg hover:-translate-y-1"
                  )}
                >
                  <div
                    className={cn(
                      "h-24 flex items-center justify-center",
                      isPlaceholder
                        ? "bg-white/10 dark:bg-white/5"
                        : "bg-gradient-to-br from-primary/30 to-secondary/30"
                    )}
                  >
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="text-sm font-bold text-foreground mb-1 line-clamp-2">
                      {isPlaceholder ? "Coming soon" : (workshop as any).title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      {isPlaceholder ? "—" : (workshop as any).instructor}
                    </p>
                    <p className={cn("text-xs mb-3", isPlaceholder ? "text-muted-foreground" : "text-primary font-semibold")}>
                      {isPlaceholder ? "" : `Completion: ${(workshop as any).completion}`}
                    </p>
                    <div className="flex gap-2 mt-auto">
                      <button
                        type="button"
                        disabled={isPlaceholder}
                        title="View recording"
                        className={cn(
                          "flex-1 py-2 rounded-lg text-xs font-medium smooth-transition",
                          isPlaceholder
                            ? "bg-white/10 text-muted-foreground"
                            : "bg-primary/20 text-primary hover:bg-primary/30"
                        )}
                      >
                        <Eye className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        type="button"
                        disabled={isPlaceholder}
                        title="Download"
                        className={cn(
                          "flex-1 py-2 rounded-lg border text-xs font-medium smooth-transition",
                          isPlaceholder
                            ? "border-white/15 text-muted-foreground"
                            : "border-primary/30 hover:bg-white/20"
                        )}
                      >
                        <Download className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        type="button"
                        disabled={isPlaceholder}
                        title="Share"
                        className={cn(
                          "flex-1 py-2 rounded-lg border text-xs font-medium smooth-transition",
                          isPlaceholder
                            ? "border-white/15 text-muted-foreground"
                            : "border-primary/30 hover:bg-white/20"
                        )}
                      >
                        <Share2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* My Certificates */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            My Certificates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {certificatesForUI.map((cert) => {
              const isPlaceholder = (cert as any).__placeholder === true;
              return (
                <div
                  key={cert.id}
                  className={cn(
                    "glassmorphism overflow-hidden smooth-transition flex flex-col",
                    isPlaceholder
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-lg hover:-translate-y-1"
                  )}
                >
                  <div
                    className={cn(
                      "h-24 flex items-center justify-center",
                      isPlaceholder
                        ? "bg-white/10 dark:bg-white/5"
                        : "bg-gradient-to-br from-primary/30 to-secondary/30"
                    )}
                  >
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="text-sm font-bold text-foreground mb-1 line-clamp-2">
                      {isPlaceholder ? "Coming soon" : (cert as any).title}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-1">
                      {isPlaceholder ? "" : `Issued: ${(cert as any).issuedDate}`}
                    </p>
                    <p className="text-xs text-muted-foreground mb-1">
                      {isPlaceholder ? "" : `ID: ${(cert as any).certificateId}`}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {isPlaceholder ? "—" : (cert as any).instructor}
                    </p>
                    <div className="flex gap-2 mt-auto">
                      <button
                        type="button"
                        disabled={isPlaceholder}
                        title="View certificate"
                        className={cn(
                          "flex-1 py-2 rounded-lg text-xs font-medium smooth-transition",
                          isPlaceholder
                            ? "bg-white/10 text-muted-foreground"
                            : "bg-primary/20 text-primary hover:bg-primary/30"
                        )}
                      >
                        <Eye className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        type="button"
                        disabled={isPlaceholder}
                        title="Download"
                        className={cn(
                          "flex-1 py-2 rounded-lg border text-xs font-medium smooth-transition",
                          isPlaceholder
                            ? "border-white/15 text-muted-foreground"
                            : "border-primary/30 hover:bg-white/20"
                        )}
                      >
                        <Download className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        type="button"
                        disabled={isPlaceholder}
                        title="Share"
                        className={cn(
                          "flex-1 py-2 rounded-lg border text-xs font-medium smooth-transition",
                          isPlaceholder
                            ? "border-white/15 text-muted-foreground"
                            : "border-primary/30 hover:bg-white/20"
                        )}
                      >
                        <Share2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
            className="px-12 py-3 rounded-2xl bg-destructive text-destructive-foreground font-medium smooth-transition hover:bg-destructive/90">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
