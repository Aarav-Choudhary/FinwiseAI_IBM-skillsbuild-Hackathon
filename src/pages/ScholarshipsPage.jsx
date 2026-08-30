import { useState, useEffect } from "react";
import {
  GraduationCap,
  Filter,
  Sparkles,
  Bell,
  Search,
  CheckCircle2,
  Calendar,
  ExternalLink,
} from "lucide-react";
import ScholarshipCard from "../components/ScholarshipCard";
import { getScholarshipsForCountry } from "../lib/countries";

export default function ScholarshipsPage({ profile }) {
  const countryCode = profile?.country || "IN";
  const defaultScholarships = getScholarshipsForCountry(countryCode);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [scholarshipsList, setScholarshipsList] = useState(() => {
    try {
      const cached = localStorage.getItem(`ai_discovered_scholarships_${countryCode}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Merge cached with default
        const existingIds = new Set(defaultScholarships.map((s) => s.id));
        const custom = parsed.filter((s) => !existingIds.has(s.id));
        return [...defaultScholarships, ...custom];
      }
    } catch (_) {}
    return defaultScholarships;
  });

  const [savedIds, setSavedIds] = useState(() => {
    try {
      const saved = localStorage.getItem("saved_scholarship_ids");
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });
  const [notificationMsg, setNotificationMsg] = useState("");
  const [aiMatchingTip, setAiMatchingTip] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);

  // Sync with default country scholarships whenever country changes
  useEffect(() => {
    const base = getScholarshipsForCountry(countryCode);
    try {
      const cached = localStorage.getItem(`ai_discovered_scholarships_${countryCode}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        const existingIds = new Set(base.map((s) => s.id));
        const custom = parsed.filter((s) => !existingIds.has(s.id));
        setScholarshipsList([...base, ...custom]);
        return;
      }
    } catch (_) {}
    setScholarshipsList(base);
  }, [countryCode]);

  // Auto-fetch latest live scholarships from AI backend on mount
  useEffect(() => {
    const autoDiscoverScholarships = async () => {
      setIsAutoSyncing(true);
      try {
        const res = await fetch("/api/discover-scholarships", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: profile?.countryData?.name || "India",
            countryCode,
            course: profile?.course || "Computer Science / Engineering",
            university: profile?.university || "University",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.scholarships && data.scholarships.length > 0) {
            setScholarshipsList((prev) => {
              const currentIds = new Set(prev.map((s) => s.id));
              const newItems = data.scholarships.filter(
                (s) => !currentIds.has(s.id) && s.name && s.deadline
              );
              if (newItems.length > 0) {
                const combined = [...prev, ...newItems];
                localStorage.setItem(
                  `ai_discovered_scholarships_${countryCode}`,
                  JSON.stringify(combined)
                );
                return combined;
              }
              return prev;
            });
          }
        }
      } catch (e) {
        console.error("Auto discovery error:", e);
      } finally {
        setIsAutoSyncing(false);
      }
    };

    autoDiscoverScholarships();
  }, [countryCode, profile]);

  useEffect(() => {
    const syncSaved = () => {
      try {
        const saved = localStorage.getItem("saved_scholarship_ids");
        setSavedIds(saved ? JSON.parse(saved) : []);
      } catch (_) {}
    };
    window.addEventListener("scholarships_updated", syncSaved);
    window.addEventListener("storage", syncSaved);
    return () => {
      window.removeEventListener("scholarships_updated", syncSaved);
      window.removeEventListener("storage", syncSaved);
    };
  }, []);

  // Filter and search logic
  const filteredScholarships = scholarshipsList.filter((s) => {
    const matchesFilter = filterType === "All" || s.type === filterType;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      s.name.toLowerCase().includes(query) ||
      s.provider.toLowerCase().includes(query) ||
      (s.field && s.field.toLowerCase().includes(query)) ||
      (s.description && s.description.toLowerCase().includes(query)) ||
      (s.eligibility && s.eligibility.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  const toggleSaveScholarship = (scholarship) => {
    let updated;
    if (savedIds.includes(scholarship.id)) {
      updated = savedIds.filter((id) => id !== scholarship.id);
      setNotificationMsg(`Reminder removed for ${scholarship.name}.`);
    } else {
      updated = [...savedIds, scholarship.id];
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`Reminder Set: ${scholarship.name}`, {
          body: `Application deadline is ${scholarship.deadline}. We'll remind you!`,
        });
      }
      setNotificationMsg(`Reminder set for ${scholarship.name}!`);
    }
    setSavedIds(updated);
    localStorage.setItem("saved_scholarship_ids", JSON.stringify(updated));
    window.dispatchEvent(new Event("scholarships_updated"));
    setTimeout(() => setNotificationMsg(""), 4000);
  };

  const cleanFormattedAdvice = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.split("\n");
    const cleanedLines = [];

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.match(/^\|?\s*[-:]+\s*\|/)) continue;

      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        const cells = trimmed
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean);
        if (cells.length >= 2) {
          if (cells[0].toLowerCase() === "item" || cells[0].toLowerCase() === "scholarship") continue;
          cleanedLines.push(`• **${cells[0]}:** ${cells.slice(1).join(" — ")}`);
          continue;
        }
      }

      const cleanLine = trimmed.replace(/^\|\s*/, "").replace(/\s*\|$/, "");
      cleanedLines.push(cleanLine);
    }

    return cleanedLines.map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const isBullet = line.startsWith("- ") || line.startsWith("• ") || line.startsWith("* ");
      const displayLine = isBullet ? line.replace(/^[-•*]\s*/, "") : line;

      return (
        <div
          key={idx}
          className={`leading-relaxed ${
            isBullet
              ? "flex items-start gap-1.5 pl-1 my-1 text-textSecondary"
              : "my-1 text-textPrimary"
          }`}
        >
          {isBullet && <span className="text-primary font-bold">•</span>}
          <span>
            {parts.map((part, pIdx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={pIdx} className="text-textPrimary font-semibold">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            })}
          </span>
        </div>
      );
    });
  };

  const [aiMatchData, setAiMatchData] = useState(null);

  const handleAiMatching = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/match-scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: profile?.countryData?.name || "India",
          countryCode,
          course: profile?.course || "Computer Science / Engineering",
          university: profile?.university || "University",
          income: profile?.income || 15000,
          currencySymbol: profile?.countryData?.symbol || "₹",
        }),
      });
      if (!res.ok) throw new Error("Scholarship match API unavailable");
      const data = await res.json();
      setAiMatchData(data);
    } catch {
      setAiMatchData({
        bestScholarships: [
          {
            name: "Reliance Foundation Undergraduate Scholarship",
            provider: "Reliance Foundation",
            amount: "₹2,00,000",
            deadline: "2026-10-15",
            whyBest: `Specifically awards up to ₹2 Lakhs for undergraduate degree students in ${profile?.course || "Engineering"}, combining financial support with leadership mentorship.`,
            link: "https://www.scholarships.reliancefoundation.org/",
          },
          {
            name: "Central Sector Scheme of University Scholarships (NSP)",
            provider: "Ministry of Education (Govt of India)",
            amount: "₹20,000 / yr",
            deadline: "2026-12-31",
            whyBest: "Direct Benefit Transfer (DBT) directly into your bank account with simple merit-based board percentile criteria.",
            link: "https://scholarships.gov.in/",
          },
        ],
        howToApplySteps: [
          "1. Register on the official portal with your Aadhaar, student email, and phone number.",
          "2. Complete student profile details (College roll number, NIRF status, income bracket).",
          "3. Upload scanned marksheets, current year bonafide certificate, and parental income affidavit.",
          "4. Submit your application online and notify your college scholarship nodal officer for institute verification.",
        ],
        requiredDocuments: [
          "Class 10 & 12 Academic Marksheets",
          "Family Income Certificate / ITR",
          "College Bonafide Student Certificate",
          "Bank Account Passbook (Aadhaar linked)",
          "College ID Card & Admission Fee Receipt",
        ],
      });
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <GraduationCap className="text-primary" /> Scholarship Finder
          </h1>
          <p className="text-xs text-textSecondary">
            Active 2026/2027 student scholarships in {profile?.countryData?.name} ·{" "}
            <span className="text-accent font-semibold">
              {filteredScholarships.length} active opportunities
            </span>
          </p>
        </div>

        <button
          onClick={handleAiMatching}
          disabled={loadingAi}
          className="btn-primary flex items-center gap-2 text-xs py-2.5 px-4 shadow-lg shadow-primary/20"
        >
          <Sparkles size={14} className={loadingAi ? "animate-spin" : ""} />
          <span>{loadingAi ? "Analyzing Best Matches..." : "Grok AI: Find Best & How to Apply"}</span>
        </button>
      </div>

      {/* Notification popup alert */}
      {notificationMsg && (
        <div className="p-3 rounded-xl bg-accent/15 border border-accent/30 text-accent text-xs flex items-center gap-2 animate-fade-in">
          <Bell size={16} />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Comprehensive AI Best Match & Application Guide Panel */}
      {aiMatchData && (
        <div className="glass p-5 rounded-2xl border border-primary/40 text-xs space-y-4 animate-fade-in bg-gradient-to-b from-primary/10 via-surface/60 to-surface/80">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <h3 className="font-bold text-textPrimary text-sm">
                Grok AI: Best Matching Scholarships for {profile?.course || "Your Degree"}
              </h3>
            </div>
            <button
              onClick={() => setAiMatchData(null)}
              className="text-textSecondary hover:text-textPrimary text-xs px-2 py-1 rounded-lg hover:bg-surface border border-border/60"
            >
              ✕ Close Guide
            </button>
          </div>

          {/* Section 1: Top Recommended Scholarships */}
          {aiMatchData.bestScholarships && aiMatchData.bestScholarships.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-accent uppercase tracking-wider block">
                ⭐ Top Recommended Opportunities:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {aiMatchData.bestScholarships.map((rec, rIdx) => (
                  <div
                    key={rIdx}
                    className="p-3.5 rounded-xl bg-surface/90 border border-border/90 hover:border-primary/50 transition-all flex flex-col justify-between space-y-2.5 shadow-sm"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h4 className="font-semibold text-textPrimary text-xs line-clamp-1" title={rec.name}>
                          {rec.name}
                        </h4>
                        <span className="text-[10px] font-bold text-accent shrink-0">
                          {rec.amount}
                        </span>
                      </div>
                      <p className="text-[10px] text-textSecondary mb-2">{rec.provider}</p>

                      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-[10.5px] text-textPrimary/90 leading-snug">
                        <span className="font-bold text-primary block text-[10px] mb-0.5">
                          🎯 Why it&apos;s best for you:
                        </span>
                        {rec.whyBest}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-border/50 text-[10px]">
                      <span className="text-warning font-medium">Due: {rec.deadline}</span>
                      {rec.link && (
                        <a
                          href={rec.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary py-1 px-2.5 rounded-lg text-[10px] flex items-center gap-1 font-medium"
                        >
                          <span>Apply Portal</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: How to Apply Roadmap & Documents */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border/60">
            {/* Step-by-step Roadmap */}
            <div className="md:col-span-2 space-y-2">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                📝 Step-by-Step How to Apply:
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {(aiMatchData.howToApplySteps || []).map((step, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-2.5 rounded-xl bg-surface/70 border border-border/60 flex items-start gap-2 text-[11px] leading-relaxed text-textPrimary"
                  >
                    <span className="w-4 h-4 rounded-full bg-primary/20 text-primary font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                      {sIdx + 1}
                    </span>
                    <p className="flex-1">{step.replace(/^\d+\.\s*/, "")}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Documents Checklist */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-warning uppercase tracking-wider block">
                📋 Mandatory Documents:
              </span>
              <div className="p-3 rounded-xl bg-surface/70 border border-border/60 space-y-1.5 max-h-48 overflow-y-auto">
                {(aiMatchData.requiredDocuments || []).map((docItem, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2 text-[10.5px] text-textSecondary">
                    <CheckCircle2 size={12} className="text-accent shrink-0" />
                    <span className="text-textPrimary/90 truncate" title={docItem}>{docItem}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary"
          />
          <input
            type="text"
            placeholder="Search by scholarship name, provider, STEM, Need..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 pr-3 py-2 text-xs w-full"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-textPrimary text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Type Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs text-textSecondary flex items-center gap-1 font-medium mr-1 shrink-0">
            <Filter size={13} /> Filter:
          </span>
          {["All", "Merit", "Need", "STEM"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                filterType === type
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "glass text-textSecondary hover:text-textPrimary hover:border-primary/40"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Scholarship Cards Grid */}
      {filteredScholarships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
              countryCode={countryCode}
              onSave={toggleSaveScholarship}
              isSaved={savedIds.includes(scholarship.id)}
            />
          ))}
        </div>
      ) : (
        <div className="glass p-12 rounded-2xl border border-border text-center space-y-3">
          <GraduationCap size={36} className="mx-auto text-textSecondary/50" />
          <h3 className="text-base font-semibold text-textPrimary">
            No matching scholarships found
          </h3>
          <p className="text-xs text-textSecondary max-w-sm mx-auto">
            Try adjusting your search keywords or switch the filter to &quot;All&quot; to see all available grants.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterType("All");
            }}
            className="btn-ghost text-xs py-1 px-4"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
