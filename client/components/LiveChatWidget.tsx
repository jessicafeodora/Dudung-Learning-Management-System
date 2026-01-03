import { useMemo, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type LiveChatPosition = "bottom-right" | "bottom-left";

type LiveChatWidgetProps = {
  /** Show / hide the chat widget. */
  enabled?: boolean;
  /** Floating button + panel placement. */
  position?: LiveChatPosition;
  /** Bottom offset for the floating button (Tailwind class, e.g. "bottom-6"). */
  buttonBottomClass?: string;
  /** Bottom offset for the panel (Tailwind class, e.g. "bottom-20"). */
  panelBottomClass?: string;
  /** Max words allowed in message input (spec: 100). */
  maxMessageWords?: number;
};

export function LiveChatWidget({
  enabled = true,
  position = "bottom-right",
  buttonBottomClass = "bottom-28",
  panelBottomClass = "bottom-36",
  maxMessageWords = 100,
}: LiveChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "Student",
    npmNpwp: "",
    whatsapp: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const MAX_MESSAGE_WORDS = maxMessageWords;

  const sideClass = useMemo(() => {
    return position === "bottom-left" ? "left-6" : "right-6";
  }, [position]);

  if (!enabled) return null;

  const countWords = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(Boolean).length;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "npmNpwp") {
      const role = formData.role;
      const maxLength = role === "Student" ? 8 : 12;
      if (value.length > maxLength) return;
    }

    if (name === "message") {
      // Enforce 100 words max (spec)
      const words = value.trim().split(/\s+/).filter(Boolean);
      if (words.length > MAX_MESSAGE_WORDS) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.npmNpwp.trim()) newErrors.npmNpwp = "NPM/NPWP is required";
    if (!formData.whatsapp.trim()) newErrors.whatsapp = "WhatsApp is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Chat message sent:", formData);
      setFormData({
        name: "",
        role: "Student",
        npmNpwp: "",
        whatsapp: "",
        message: "",
      });
      setIsOpen(false);
      alert("Message sent successfully!");
    }
  };

  const npmNpwpLabel =
    formData.role === "Student" ? "NPM" : "NPWP";
  const npmNpwpPlaceholder =
    formData.role === "Student"
      ? "NPM (8 digits)"
      : "NPWP (12 digits)";
  const npmNpwpMaxLength =
    formData.role === "Student" ? 8 : 12;

  if (!enabled) return null;

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed w-14 h-14 rounded-full",
          buttonBottomClass,
          sideClass,
          "bg-primary text-primary-foreground shadow-lg",
          "flex items-center justify-center hover:scale-110 active:scale-95",
          "smooth-transition z-40"
        )}
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={cn(
            "fixed w-[18rem] sm:w-80 max-h-[70vh]",
            panelBottomClass,
            sideClass,
            "glass-card shadow-xl overflow-y-auto z-40",
            "animate-scale-in rounded-2xl"
          )}
        >
          <div className="p-4 sm:p-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              SmartEdu Live Chat
            </h3>
            <p className="text-sm text-muted-foreground">
              All fields are required
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className={cn(
                    "input-glass",
                    errors.name && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={cn("input-glass", "text-foreground")}
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                </select>
              </div>

              {/* NPM/NPWP */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {npmNpwpLabel} *
                </label>
                <input
                  type="text"
                  name="npmNpwp"
                  value={formData.npmNpwp}
                  onChange={handleInputChange}
                  placeholder={npmNpwpPlaceholder}
                  maxLength={npmNpwpMaxLength}
                  className={cn(
                    "input-glass",
                    errors.npmNpwp && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.npmNpwp && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.npmNpwp}
                  </p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="Enter your WhatsApp number"
                  className={cn(
                    "input-glass",
                    errors.whatsapp && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.whatsapp && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.whatsapp}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your question or issue here (up to 100 words)"
                  rows={4}
                  className={cn(
                    "input-glass resize-none",
                    errors.message && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {countWords(formData.message)} / {MAX_MESSAGE_WORDS} words
                </p>
                {errors.message && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={cn(
                  "w-full py-3 rounded-2xl font-medium",
                  "btn-primary"
                )}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
