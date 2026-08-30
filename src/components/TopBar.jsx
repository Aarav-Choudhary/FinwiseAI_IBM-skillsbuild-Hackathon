import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  BellRing,
  Sparkles,
  Trash2,
  Calendar,
  ExternalLink,
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";
import { getScholarshipsForCountry, formatCurrency } from "../lib/countries";

export default function TopBar({ user, profile, title = "Dashboard" }) {
  const country = profile?.countryData;
  const countryCode = profile?.country || "IN";

  const [notifPermission, setNotifPermission] = useState("default");
  const [showDropdown, setShowDropdown] = useState(false);
  const [savedIds, setSavedIds] = useState([]);
  const dropdownRef = useRef(null);

  // Load all scholarships for student's country
  const allCountryScholarships = getScholarshipsForCountry(countryCode);
  const savedScholarships = allCountryScholarships.filter((s) =>
    savedIds.includes(s.id)
  );

  // Calculate relative due dates (e.g., "Due Tomorrow", "Due in 3 days", etc.)
  const getDueStatus = (deadlineStr) => {
    if (!deadlineStr) {
      return {
        label: "Deadline Pending",
        badgeClass: "text-textSecondary bg-surface border-border",
      };
    }
    const target = new Date(deadlineStr);
    const now = new Date();
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return {
        label: "⚠️ Due Tomorrow!",
        badgeClass: "text-danger bg-danger/15 border-danger/30 font-bold animate-pulse",
      };
    } else if (diffDays === 0) {
      return {
        label: "🚨 Due Today!",
        badgeClass: "text-danger bg-danger/20 border-danger/40 font-bold animate-pulse",
      };
    } else if (diffDays < 0) {
      return {
        label: "Expired",
        badgeClass: "text-textSecondary bg-surface border-border/80",
      };
    } else if (diffDays <= 7) {
      return {
        label: `⏳ Due in ${diffDays} days (${deadlineStr})`,
        badgeClass: "text-warning bg-warning/15 border-warning/30 font-semibold",
      };
    } else {
      return {
        label: `📅 Deadline: ${deadlineStr}`,
        badgeClass: "text-accent bg-accent/15 border-accent/30 font-medium",
      };
    }
  };

  const loadSavedIds = () => {
    try {
      const saved = localStorage.getItem("saved_scholarship_ids");
      setSavedIds(saved ? JSON.parse(saved) : []);
    } catch (_) {
      setSavedIds([]);
    }
  };

  useEffect(() => {
    if ("Notification" in window) {
      setNotifPermission(Notification.permission);
    }

    loadSavedIds();

    const handleSync = () => {
      loadSavedIds();
    };

    window.addEventListener("scholarships_updated", handleSync);
    window.addEventListener("storage", handleSync);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scholarships_updated", handleSync);
      window.removeEventListener("storage", handleSync);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationPermission = () => {
    if (!("Notification" in window)) {
      alert("Browser notifications are not supported by this browser.");
      return;
    }

    Notification.requestPermission().then((permission) => {
      setNotifPermission(permission);
      if (permission === "granted") {
        new Notification("FinWise AI Scholarship Alerts", {
          body: "Scholarship deadline notifications are active!",
        });
      } else if (permission === "denied") {
        alert(
          "Notifications are blocked in your browser. Please allow notifications in site settings to receive reminders."
        );
      }
    });
  };

  const deleteScholarshipReminder = (id) => {
    const updated = savedIds.filter((x) => x !== id);
    setSavedIds(updated);
    localStorage.setItem("saved_scholarship_ids", JSON.stringify(updated));
    window.dispatchEvent(new Event("scholarships_updated"));
    window.dispatchEvent(new Event("storage"));
  };

  const hasNotifications = savedScholarships.length > 0;

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0 relative z-50"
      style={{
        background: "rgba(11,11,13,0.9)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* ── Page Title ── */}
      <div className="md:block hidden">
        <h2 className="font-semibold text-textPrimary text-base">{title}</h2>
        {country && (
          <p className="text-xs text-textSecondary">
            {country.flag} {country.name} · {country.symbol} {country.currency}
          </p>
        )}
      </div>

      {/* ── Right side ── */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Grok Badge */}
        <div className="badge badge-primary hidden sm:inline-flex py-1 px-3">
          <Sparkles size={12} className="mr-1 text-primary" />
          Powered by Grok AI
        </div>

        {/* ── Scholarship Notifications Bell & Dropdown ── */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`p-2 rounded-xl glass transition-all relative ${
              showDropdown ? "border-primary text-primary" : "hover:border-primary/60"
            }`}
            title="Scholarship Deadline Notifications"
          >
            {hasNotifications ? (
              <BellRing size={16} className="text-accent" />
            ) : (
              <Bell size={16} className="text-textSecondary" />
            )}

            {/* Notification badge / dot */}
            {hasNotifications ? (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-bg text-[9px] font-bold flex items-center justify-center shadow-md">
                {savedScholarships.length}
              </span>
            ) : (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-textSecondary/40" />
            )}
          </button>

          {/* ── Notification Dropdown Box ── */}
          {showDropdown && (
            <div
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 p-4 rounded-2xl border border-border shadow-2xl z-[9999] space-y-3"
              style={{
                background: "#16161a",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.08)",
              }}
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-border/60 pb-2.5">
                <div className="flex items-center gap-2">
                  <GraduationCap size={15} className="text-primary" />
                  <span className="text-xs font-bold text-textPrimary">
                    Scholarship Deadlines
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                      hasNotifications
                        ? "text-accent bg-accent/10 border-accent/25"
                        : "text-textSecondary bg-surface border-border"
                    }`}
                  >
                    {hasNotifications
                      ? `${savedScholarships.length} Active`
                      : "0 Active"}
                  </span>
                </div>
              </div>

              {/* Browser Permission Request Prompt (if not granted) */}
              {notifPermission !== "granted" && (
                <div className="p-2.5 rounded-xl bg-warning/10 border border-warning/20 space-y-1.5 text-left">
                  <p className="text-[10.5px] text-warning leading-snug">
                    Enable browser notifications to receive deadline popup alerts.
                  </p>
                  <button
                    type="button"
                    onClick={handleNotificationPermission}
                    className="w-full py-1.5 rounded-lg bg-warning text-bg font-bold text-[10px] hover:opacity-90 transition-opacity"
                  >
                    Enable Browser Popups
                  </button>
                </div>
              )}

              {/* Scholarship Reminders List */}
              <div className="space-y-2 text-left">
                {savedScholarships.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                    {savedScholarships.map((s) => {
                      const due = getDueStatus(s.deadline);
                      return (
                        <div
                          key={s.id}
                          className="p-3 rounded-xl bg-surface/80 border border-border/80 hover:border-primary/40 transition-all space-y-2"
                        >
                          {/* Title + Delete button */}
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <h4
                                className="font-semibold text-textPrimary text-xs truncate"
                                title={s.name}
                              >
                                {s.name}
                              </h4>
                              <p className="text-[10px] text-textSecondary truncate">
                                {s.provider} ·{" "}
                                <span className="font-bold text-accent">
                                  {formatCurrency(s.amount, countryCode)}
                                  {s.amountPerYear ? " / yr" : ""}
                                </span>
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => deleteScholarshipReminder(s.id)}
                              className="p-1 rounded-lg text-textSecondary hover:text-danger hover:bg-danger/10 transition-colors shrink-0"
                              title="Delete this reminder"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {/* Due date tag badge */}
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] border ${due.badgeClass}`}
                            >
                              {due.label}
                            </span>

                            {/* Direct link to page or application */}
                            <div className="flex items-center gap-2">
                              {s.link ? (
                                <a
                                  href={s.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10.5px] text-primary hover:text-primary/80 font-medium flex items-center gap-0.5 transition-colors"
                                >
                                  <span>Apply</span>
                                  <ExternalLink size={11} />
                                </a>
                              ) : (
                                <Link
                                  to="/scholarships"
                                  onClick={() => setShowDropdown(false)}
                                  className="text-[10.5px] text-primary hover:text-primary/80 font-medium flex items-center gap-0.5 transition-colors"
                                >
                                  <span>Details</span>
                                  <ArrowUpRight size={11} />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center space-y-2">
                    <GraduationCap
                      size={28}
                      className="mx-auto text-textSecondary/40"
                    />
                    <p className="text-xs text-textSecondary font-medium">
                      No active scholarship reminders.
                    </p>
                    <p className="text-[11px] text-textSecondary/70 max-w-xs mx-auto leading-relaxed">
                      Go to the Scholarships page and click the 🔔 icon on any
                      scholarship to track its deadline here.
                    </p>
                    <Link
                      to="/scholarships"
                      onClick={() => setShowDropdown(false)}
                      className="btn-primary inline-flex items-center gap-1.5 text-xs py-1.5 px-3.5 mt-2 rounded-xl"
                    >
                      <span>Explore Scholarships</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        {user && (
          <img
            src={
              user.photoURL ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.displayName || "U"
              )}&background=6C63FF&color=fff`
            }
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30"
          />
        )}
      </div>
    </header>
  );
}
