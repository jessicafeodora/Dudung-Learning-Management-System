import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Moon, Sun, Mail, Phone, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      setIsDark(true);
    }
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:helpdesk.smartedu@dudung.ac.id";
  };

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/628123456789", "_blank");
  };

  return (
    <nav className="glassmorphism-light sticky top-0 z-40 w-full">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Title */}
          <Link
            to="/"
            className="flex items-center gap-3 smooth-transition hover:opacity-80"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              D
            </div>
            <span className="hidden sm:inline text-lg font-bold text-foreground">
              Dudung SmartEdu
            </span>
          </Link>

          {/* Right side - Desktop menu */}
          <div className="hidden nav:flex items-center gap-6">
            {/* Contact dropdown */}
            <div className="relative group">
              <button className="text-foreground hover:text-primary smooth-transition flex items-center gap-2">
                <span>Contact</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              <div
                className={cn(
                  "absolute right-0 mt-2 w-64 glassmorphism-light shadow-lg",
                  "origin-top-right",
                  // smooth dropdown motion (200ms vertical fade)
                  "opacity-0 translate-y-2 scale-95",
                  "group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100",
                  "pointer-events-none group-hover:pointer-events-auto",
                  "transition-all duration-200 ease-out"
                )}
              >
                <div className="p-4 space-y-3">
                  <a
                    href="https://dudung.ac.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/20 dark:hover:bg-white/10 smooth-transition"
                  >
                    <Globe className="w-4 h-4 text-primary" />
                    <span className="text-sm">Dudung University web</span>
                  </a>
                  <button
                    onClick={handleEmailClick}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/20 dark:hover:bg-white/10 smooth-transition text-left"
                  >
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-sm">Helpdesk Email</span>
                  </button>
                  <button
                    onClick={handleWhatsAppClick}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/20 dark:hover:bg-white/10 smooth-transition text-left"
                  >
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-sm">Helpdesk Contact</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="icon-btn"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-primary" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="nav:hidden icon-btn"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="nav:hidden mt-4 space-y-3 pb-4 border-t border-white/20 pt-4">
            <a
              href="https://dudung.ac.id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/20 dark:hover:bg-white/10 smooth-transition"
            >
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-sm">Dudung University web</span>
            </a>
            <button
              onClick={handleEmailClick}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/20 dark:hover:bg-white/10 smooth-transition text-left"
            >
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm">Helpdesk Email</span>
            </button>
            <button
              onClick={handleWhatsAppClick}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/20 dark:hover:bg-white/10 smooth-transition text-left"
            >
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-sm">Helpdesk Contact</span>
            </button>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-white/20 dark:hover:bg-white/10 smooth-transition"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-primary" />
              ) : (
                <Moon className="w-4 h-4 text-primary" />
              )}
              <span className="text-sm">
                {isDark ? "Light Mode" : "Dark Mode"}
              </span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
