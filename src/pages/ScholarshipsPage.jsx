import { useState } from "react";
import { GraduationCap, Filter, Sparkles, Bell } from "lucide-react";
import ScholarshipCard from "../components/ScholarshipCard";
import { getScholarshipsForCountry, formatCurrency } from "../lib/countries";

export default function ScholarshipsPage({ profile }) {
  const countryCode = profile?.country || "IN";
  const allScholarships = getScholarshipsForCountry(countryCode);

  const [filterType, setFilterType] = useState("All");
  const [savedIds, setSavedIds] = useState([]);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [aiMatchingTip, setAiMatchingTip] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const filteredScholarships = allScholarships.filter((s) => {
    if (filterType === "All") return true;
    return s.type === filterType;
  });

  const toggleSaveScholarship = (scholarship) => {
    if (savedIds.includes(scholarship.id)) {
      setSavedIds(savedIds.filter((id) => id !== scholarship.id));
    } else {
      setSavedIds([...savedIds, scholarship.id]);

      // Trigger Browser Notification API
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(`Reminder Set: ${scholarship.name}`, {
            body: `Application deadline is ${scholarship.deadline}. We'll remind you!`,
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification(`Reminder Set: ${scholarship.name}`, {
                body: `Application deadline is ${scholarship.deadline}. We'll remind you!`,
              });
            }
          });
        }
      }

      setNotificationMsg(`Reminder set for ${scholarship.name}!`);
      setTimeout(() => setNotificationMsg(""), 4000);
    }
  };

  const handleAiMatching = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/finbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Match scholarships for student: studying ${profile?.course || "General"} at ${profile?.university || "University"} in ${profile?.countryData?.name || "India"}. Provide 2 practical application tips.`,
          systemPrompt: "You are a scholarship advisor. Give 2 concise tips on winning scholarships.",
          studentContext: {
            currencySymbol: profile?.countryData?.symbol || "₹",
            income: profile?.income || 15000,
            countryName: profile?.countryData?.name || "India",
            course: profile?.course || "General",
          },
        }),
      });
      if (!res.ok) throw new Error("Scholarship API unavailable");
      const data = await res.json();
      setAiMatchingTip(data.reply || "Submit applications at least 2 weeks before the deadline to maximize your review score.");
    } catch {
      setAiMatchingTip("Highlight your coursework and extracurricular achievements, and align your essay directly with the scholarship foundation's mission.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Scholarship Finder</h1>
          <p className="text-xs text-textSecondary">
            Curated student scholarships in {profile?.countryData?.name} ({allScholarships.length} available)
          </p>
        </div>

        <button
          onClick={handleAiMatching}
          disabled={loadingAi}
          className="btn-primary flex items-center gap-2 text-xs py-2 px-4"
        >
          <Sparkles size={14} />
          <span>{loadingAi ? "Matching..." : "IBM Scholarship Matching"}</span>
        </button>
      </div>

      {notificationMsg && (
        <div className="p-3 rounded-xl bg-accent/15 border border-accent/30 text-accent text-xs flex items-center gap-2">
          <Bell size={16} />
          <span>{notificationMsg}</span>
        </div>
      )}

      {aiMatchingTip && (
        <div className="glass p-4 rounded-xl border border-primary/30 text-xs text-textPrimary leading-relaxed">
          <span className="font-semibold text-primary block mb-1">IBM watsonx Advisor Tip:</span>
          {aiMatchingTip}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-textSecondary flex items-center gap-1 font-medium mr-2">
          <Filter size={14} /> Filter:
        </span>
        {["All", "Merit", "Need", "STEM"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterType === type
                ? "bg-primary text-white"
                : "glass text-textSecondary hover:text-textPrimary"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Scholarship Cards Grid */}
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
    </div>
  );
}
