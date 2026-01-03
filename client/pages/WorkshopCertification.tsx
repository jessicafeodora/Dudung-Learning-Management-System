import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, CalendarDays, ExternalLink, X } from "lucide-react";
import { Link } from "react-router-dom";

type WorkshopItem = {
  id: string;
  title: string;
  date: string;
  status: "Upcoming" | "Completed";
  tags?: string[];
  description?: string;
  host?: string;
};

type CertificateItem = {
  id: string;
  title: string;
  issuedAt: string;
  status: "Available" | "Locked";
  tags?: string[];
  description?: string;
};

const MAX_SLOTS = 12;

function PlaceholderCard({ label }: { label: string }) {
  return (
    <Card className="glassmorphism opacity-60 border border-white/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">No data yet.</CardContent>
    </Card>
  );
}

function DetailModal({
  open,
  title,
  meta,
  tags,
  description,
  ctaLabel,
  onCta,
  onClose,
}: {
  open: boolean;
  title: string;
  meta?: string;
  tags?: string[];
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-xl">
        <Card className="glassmorphism border border-white/20 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="text-lg truncate">{title}</CardTitle>
                {meta ? (
                  <div className="mt-1 text-xs text-muted-foreground">{meta}</div>
                ) : null}
              </div>

              <Button type="button" variant="ghost" size="icon" className="icon-btn" onClick={onClose} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
            ) : null}

            <div className="text-sm leading-relaxed text-foreground/90">
              {description ?? "No additional details available yet."}
            </div>

            {ctaLabel ? (
              <div className="pt-2 flex justify-end">
                <Button type="button" size="sm" onClick={onCta}>
                  {ctaLabel}
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function WorkshopCard({
  item,
  onDetails,
}: {
  item: WorkshopItem;
  onDetails: (item: WorkshopItem) => void;
}) {
  return (
    <Card className="glassmorphism border border-white/20 hover-lift">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base">{item.title}</CardTitle>
          <Badge variant={item.status === "Upcoming" ? "secondary" : "outline"}>{item.status}</Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>{item.date}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {(item.tags ?? []).slice(0, 3).map((t) => (
            <Badge key={t} variant="outline" className="text-xs">
              {t}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            className="flex-1"
            variant={item.status === "Upcoming" ? "default" : "secondary"}
            onClick={() => onDetails(item)}
          >
            Details
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>

          <Button
            type="button"
            size="sm"
            className="flex-1"
            disabled={item.status !== "Upcoming"}
            onClick={() => onDetails(item)}
          >
            Enroll
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CertificateCard({
  item,
  onDetails,
}: {
  item: CertificateItem;
  onDetails: (item: CertificateItem) => void;
}) {
  const isLocked = item.status === "Locked";
  return (
    <Card className={`glassmorphism border border-white/20 ${isLocked ? "opacity-70" : "hover-lift"}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base">{item.title}</CardTitle>
          <Badge variant={isLocked ? "secondary" : "outline"}>{item.status}</Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Award className="h-4 w-4" />
          <span>Issued: {item.issuedAt}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {(item.tags ?? []).slice(0, 3).map((t) => (
            <Badge key={t} variant="outline" className="text-xs">
              {t}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Button type="button" size="sm" className="flex-1" variant="secondary" onClick={() => onDetails(item)}>
            Details
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>

          <Button
            type="button"
            size="sm"
            className="flex-1"
            disabled={isLocked}
            onClick={() => onDetails(item)}
          >
            {isLocked ? "Complete course first" : "Download"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function WorkshopCertification() {
  const [activeTab, setActiveTab] = useState<"workshops" | "certificates">("workshops");

  const [selectedWorkshop, setSelectedWorkshop] = useState<WorkshopItem | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateItem | null>(null);

  const workshops = useMemo<WorkshopItem[]>(
    () => [
      {
        id: "ws-1",
        title: "Intro to UI Consistency",
        date: "Jan 10, 2026",
        status: "Upcoming",
        tags: ["UI", "Basics"],
        host: "Dudung Academy",
        description:
          "A practical workshop focused on building consistent UI patterns across pages. You'll learn layout rules, spacing rhythm, and reusable components.",
      },
      {
        id: "ws-2",
        title: "Debugging Frontend Like a Pro",
        date: "Dec 20, 2025",
        status: "Completed",
        tags: ["Debug", "Frontend"],
        host: "Dudung Academy",
        description:
          "Review real debugging cases and learn a repeatable workflow: reproduce, isolate, instrument, and validate fixes.",
      },
    ],
    []
  );

  const certificates = useMemo<CertificateItem[]>(
    () => [
      {
        id: "cert-1",
        title: "React Fundamentals",
        issuedAt: "Nov 2025",
        status: "Available",
        tags: ["React", "Certificate"],
        description:
          "Certificate issued for completing the React Fundamentals track, including final assessment and required modules.",
      },
      {
        id: "cert-2",
        title: "UI Consistency Workshop",
        issuedAt: "—",
        status: "Locked",
        tags: ["UI", "Workshop"],
        description:
          "This certificate will unlock after you finish the workshop requirements and complete the short evaluation.",
      },
    ],
    []
  );

  const workshopCount = workshops.length;
  const certificateCount = certificates.length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-5">
      <div className="flex flex-col gap-2">
        <div className="text-xs text-muted-foreground">
          <Link to="/courses" className="hover:underline">
            My Course
          </Link>{" "}
          <span className="mx-1">/</span>
          <span className="text-foreground/90">Workshop & Certification</span>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold leading-tight">Workshop & Certification</h1>
            <p className="text-sm text-muted-foreground">
              Track your workshops, and download certificates when available.
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="glassmorphism border border-white/20">
          <TabsTrigger value="workshops" className="data-[state=active]:bg-white/10">
            Workshops <span className="ml-2 text-xs text-muted-foreground">({workshopCount})</span>
          </TabsTrigger>
          <TabsTrigger value="certificates" className="data-[state=active]:bg-white/10">
            Certificates <span className="ml-2 text-xs text-muted-foreground">({certificateCount})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workshops" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: MAX_SLOTS }).map((_, i) => {
              const item = workshops[i];
              return item ? (
                <WorkshopCard key={item.id} item={item} onDetails={setSelectedWorkshop} />
              ) : (
                <PlaceholderCard key={`ws-ph-${i}`} label={`Workshop slot ${i + 1}`} />
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: MAX_SLOTS }).map((_, i) => {
              const item = certificates[i];
              return item ? (
                <CertificateCard key={item.id} item={item} onDetails={setSelectedCertificate} />
              ) : (
                <PlaceholderCard key={`cert-ph-${i}`} label={`Certificate slot ${i + 1}`} />
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <DetailModal
        open={!!selectedWorkshop}
        title={selectedWorkshop?.title ?? ""}
        meta={
          selectedWorkshop
            ? `${selectedWorkshop.status} · ${selectedWorkshop.date}${selectedWorkshop.host ? ` · ${selectedWorkshop.host}` : ""}`
            : undefined
        }
        tags={selectedWorkshop?.tags}
        description={selectedWorkshop?.description}
        ctaLabel={selectedWorkshop?.status === "Upcoming" ? "Enroll" : undefined}
        onCta={() => {
          // Placeholder for future enroll action
          setSelectedWorkshop(null);
        }}
        onClose={() => setSelectedWorkshop(null)}
      />

      <DetailModal
        open={!!selectedCertificate}
        title={selectedCertificate?.title ?? ""}
        meta={
          selectedCertificate
            ? `${selectedCertificate.status} · Issued: ${selectedCertificate.issuedAt}`
            : undefined
        }
        tags={selectedCertificate?.tags}
        description={selectedCertificate?.description}
        ctaLabel={selectedCertificate?.status === "Available" ? "Download" : undefined}
        onCta={() => {
          // Placeholder for future download action
          setSelectedCertificate(null);
        }}
        onClose={() => setSelectedCertificate(null)}
      />
    </div>
  );
}
