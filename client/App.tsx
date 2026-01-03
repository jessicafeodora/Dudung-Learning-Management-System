import "./global.css";

import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import { Navbar } from "./components/Navbar";
import { BottomNav } from "./components/BottomNav";
import { LiveChatWidget } from "./components/LiveChatWidget";

import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import Courses from "./pages/Courses";
import { Search } from "./pages/Search";
import { Profile } from "./pages/Profile";
import { CourseDetail } from "./pages/CourseDetail";
import { Lesson } from "./pages/Lesson";
import { InDevelopment } from "./pages/InDevelopment";
import WorkshopCertification from "./pages/WorkshopCertification";

import { AuthProvider, useAuth } from "./lib/auth";

const queryClient = new QueryClient();

/**
 * Redirect unauthenticated users to Landing, but keep a loading UI while
 * Supabase is restoring session from storage.
 */
function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="glassmorphism px-6 py-4 text-sm text-muted-foreground">
          Loading…
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  return <>{children}</>;
}

function AppLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  // Where we show the bottom nav:
  // - Hide on landing (login/register)
  // - Show on all protected pages
  const isLandingPage = pathname === "/";
  const showBottomNav = !isLandingPage;

  // Live chat is only enabled on Landing + Dashboard per spec.
  const liveChatEnabled = pathname === "/" || pathname === "/dashboard";

  // Position rules per spec:
  // - Landing: bottom-right
  // - Dashboard: bottom-left
  const liveChatPosition = "bottom-right";

  // Landing has no bottom-nav, so we can anchor closer to the screen edge.
  const chatButtonBottom = isLandingPage ? "bottom-6" : "bottom-28";
  const chatPanelBottom = isLandingPage ? "bottom-24" : "bottom-36";

  return (
    <div className="app-shell flex flex-col min-h-screen">
      <Navbar />

      <main className={isLandingPage ? "flex-1" : "flex-1 pb-24 md:pb-0"}>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />

          <Route
            path="/courses"
            element={
              <RequireAuth>
                <Courses />
              </RequireAuth>
            }
          />

          <Route
            path="/course/:id"
            element={
              <RequireAuth>
                <CourseDetail />
              </RequireAuth>
            }
          />

          <Route
            path="/search"
            element={
              <RequireAuth>
                <Search />
              </RequireAuth>
            }
          />

          <Route path="/profile" element={<Profile />} />


          <Route
            path="/lesson/:slug"
            element={
              <RequireAuth>
                <Lesson />
              </RequireAuth>
            }
          />

          <Route
            path="/in-development"
            element={
              <RequireAuth>
                <InDevelopment />
              </RequireAuth>
            }
          />

          <Route
            path="/workshops"
            element={
              <RequireAuth>
                <WorkshopCertification />
              </RequireAuth>
            }
          />

          {/* fallback */}
          <Route path="*" element={<Navigate to={isLandingPage ? "/" : "/dashboard"} replace />} />
        </Routes>
      </main>

      {showBottomNav ? <BottomNav /> : null}

      <LiveChatWidget
        enabled={liveChatEnabled}
        position={liveChatPosition}
        buttonBottomClass={chatButtonBottom}
        panelBottomClass={chatPanelBottom}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
