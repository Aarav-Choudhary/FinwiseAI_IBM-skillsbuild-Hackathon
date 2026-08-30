import { useState, useEffect } from "react";
import {
  Building2,
  Calculator,
  Sparkles,
  AlertCircle,
  Info,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Percent,
} from "lucide-react";
import LoanCard from "../components/LoanCard";
import { getLoansForCountry, formatCurrency } from "../lib/countries";
import { exportToPDF } from "../lib/pdfExport";

export default function LoansPage({ profile }) {
  const countryCode = profile?.country || "IN";
  const defaultLoans = getLoansForCountry(countryCode);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [loansList, setLoansList] = useState(() => {
    try {
      const cached = localStorage.getItem(`ai_discovered_loans_${countryCode}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        const existingIds = new Set(defaultLoans.map((l) => l.id));
        const custom = parsed.filter((l) => !existingIds.has(l.id));
        return [...defaultLoans, ...custom];
      }
    } catch (_) {}
    return defaultLoans;
  });

  const [principal, setPrincipal] = useState(250000);
  const [rate, setRate] = useState(8.15);
  const [tenureMonths, setTenureMonths] = useState(60);
  const [aiAssessment, setAiAssessment] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);

  // Sync with default country loans whenever country changes
  useEffect(() => {
    const base = getLoansForCountry(countryCode);
    try {
      const cached = localStorage.getItem(`ai_discovered_loans_${countryCode}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        const existingIds = new Set(base.map((l) => l.id));
        const custom = parsed.filter((l) => !existingIds.has(l.id));
        setLoansList([...base, ...custom]);
        return;
      }
    } catch (_) {}
    setLoansList(base);
  }, [countryCode]);

  // Auto-fetch latest live loans and subsidies from AI backend on mount
  useEffect(() => {
    const autoDiscoverLoans = async () => {
      setIsAutoSyncing(true);
      try {
        const res = await fetch("/api/discover-loans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: profile?.countryData?.name || "India",
            countryCode,
            course: profile?.course || "Engineering / Higher Education",
            university: profile?.university || "University",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.loans && data.loans.length > 0) {
            setLoansList((prev) => {
              const currentIds = new Set(prev.map((l) => l.id));
              const newItems = data.loans.filter(
                (l) => !currentIds.has(l.id) && l.name && l.interestRate !== undefined
              );
              if (newItems.length > 0) {
                const combined = [...prev, ...newItems];
                localStorage.setItem(
                  `ai_discovered_loans_${countryCode}`,
                  JSON.stringify(combined)
                );
                return combined;
              }
              return prev;
            });
          }
        }
      } catch (e) {
        console.error("Auto loan discovery error:", e);
      } finally {
        setIsAutoSyncing(false);
      }
    };

    autoDiscoverLoans();
  }, [countryCode, profile]);

  // EMI Math: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = rate / 12 / 100;
  const emi =
    monthlyRate > 0
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1)
      : principal / tenureMonths;

  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;

  // Filtered loans list
  const filteredLoans = loansList.filter((l) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      l.name.toLowerCase().includes(query) ||
      l.provider.toLowerCase().includes(query) ||
      l.description.toLowerCase().includes(query) ||
      l.eligibility.toLowerCase().includes(query);

    let matchesFilter = true;
    if (filterType === "Govt") {
      matchesFilter =
        l.interestRate === 0 ||
        l.name.toLowerCase().includes("pm") ||
        l.provider.toLowerCase().includes("ministry") ||
        l.provider.toLowerCase().includes("govt");
    } else if (filterType === "LowInterest") {
      matchesFilter = l.interestRate <= 8.5;
    }

    return matchesSearch && matchesFilter;
  });

  const handleSelectLoan = (loan) => {
    setPrincipal(loan.minAmount || 100000);
    setRate(loan.interestRate || 8);
    if (loan.tenure && loan.tenure > 0) setTenureMonths(loan.tenure);
  };

  const cleanFormattedAdvice = (rawText) => {
    if (!rawText) return null;

    // Filter out markdown table separator lines like |---|---| and parse table rows into clean bullets
    const lines = rawText.split("\n");
    const cleanedLines = [];

    for (let line of lines) {
      const trimmed = line.trim();
      // Skip empty or table divider lines
      if (!trimmed || trimmed.match(/^\|?\s*[-:]+\s*\|/)) continue;

      // If line is a markdown table row (e.g. | Item | Value |)
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        const cells = trimmed
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean);
        if (cells.length >= 2) {
          // If it's a header like Item | Figure, skip it
          if (cells[0].toLowerCase() === "item" || cells[0].toLowerCase() === "metric") continue;
          cleanedLines.push(`• **${cells[0]}:** ${cells.slice(1).join(" — ")}`);
          continue;
        }
      }

      // Remove any trailing or leading lone pipes
      const cleanLine = trimmed.replace(/^\|\s*/, "").replace(/\s*\|$/, "");
      cleanedLines.push(cleanLine);
    }

    return cleanedLines.map((line, idx) => {
      // Process bold formatting
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const isBullet = line.startsWith("- ") || line.startsWith("• ") || line.startsWith("* ");
      const displayLine = isBullet ? line.replace(/^[-•*]\s*/, "") : line;

      return (
        <div key={idx} className={`leading-relaxed ${isBullet ? "flex items-start gap-1.5 pl-1 my-1 text-textSecondary" : "my-1 text-textPrimary"}`}>
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

  const handleAssessLoan = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/finbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Assess student loan affordability:
Loan amount: ${formatCurrency(principal, countryCode)}, Rate: ${rate}%, Tenure: ${tenureMonths} months. Monthly EMI: ${formatCurrency(
            Math.round(emi),
            countryCode
          )}. Student monthly income: ${formatCurrency(
            profile?.income || 0,
            countryCode
          )}. Student studying ${profile?.course || "Engineering"} at ${
            profile?.university || "University"
          }. Recommend whether PM Vidyalaxmi or CSIS subsidy applies.`,
          systemPrompt:
            "You are a student loan financial advisor. Give 2-3 concise bullet points with actionable financial advice and government subsidy recommendations (like PM Vidyalaxmi / CSIS). DO NOT output markdown tables, pipe symbols (|), or repeat loan stats. Use bullet points only.",
          studentContext: {
            currencySymbol: profile?.countryData?.symbol || "₹",
            income: profile?.income || 15000,
            countryName: profile?.countryData?.name || "India",
          },
        }),
      });
      if (!res.ok) throw new Error("Loan assessment API unavailable");
      const data = await res.json();
      setAiAssessment(
        data.reply ||
          `• At an EMI of ${formatCurrency(
            Math.round(emi),
            countryCode
          )}/mo, this loan represents ${Math.round(
            (emi / (profile?.income || 15000)) * 100
          )}% of your monthly cash flow.\n• Apply for the PM Vidyalaxmi or Vidya Lakshmi CSIS subsidy for up to 100% interest subvention during college.`
      );
    } catch {
      setAiAssessment(
        `• At an EMI of ${formatCurrency(
          Math.round(emi),
          countryCode
        )}/month, ensure expected starting salary comfortably exceeds 4x your EMI.\n• Eligible students should explore PM Vidyalaxmi or CSIS scheme to reduce interest.`
      );
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" id="loans-report">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
            <Building2 className="text-primary" /> Student Loan Advisor
          </h1>
          <p className="text-xs text-textSecondary">
            Verified student loan schemes & subsidies in {profile?.countryData?.name} ·{" "}
            <span className="text-accent font-semibold">
              {filteredLoans.length} schemes available
            </span>
          </p>
        </div>

        <button
          onClick={() =>
            exportToPDF("loans-report", "Student-Loan-Plan", {
              title: "Student Loan Repayment Plan",
              studentName: profile?.name,
            })
          }
          className="btn-ghost flex items-center gap-2 text-xs"
        >
          <Download size={14} />
          <span>Export Loan Summary</span>
        </button>
      </div>

      {/* EMI Calculator + AI Assessment (Aligned equal height boxes with clean scrolling) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Calculator Form */}
        <div className="glass p-5 rounded-2xl border border-border flex flex-col justify-between space-y-3 h-[360px]">
          <h2 className="text-sm font-semibold text-textPrimary flex items-center gap-2">
            <Calculator size={16} className="text-primary" /> EMI Repayment Calculator
          </h2>

          <div className="space-y-2.5 text-xs flex-1 flex flex-col justify-center">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-textSecondary">Loan Amount</span>
                <span className="font-bold text-textPrimary">
                  {formatCurrency(principal, countryCode)}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="4000000"
                step="10000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full accent-primary h-1.5 bg-surface rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-textSecondary">Interest Rate (p.a.)</span>
                <span className="font-bold text-warning">{rate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="16"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-warning h-1.5 bg-surface rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-textSecondary">Tenure</span>
                <span className="font-bold text-accent">
                  {tenureMonths} Mos ({Math.round(tenureMonths / 12)} Yrs)
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="240"
                step="12"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full accent-accent h-1.5 bg-surface rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleAssessLoan}
            disabled={loadingAi}
            className="btn-primary w-full py-2 text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 shrink-0"
          >
            <Sparkles size={14} className={loadingAi ? "animate-spin" : ""} />
            <span>{loadingAi ? "Analyzing..." : "Grok Loan Affordability"}</span>
          </button>
        </div>

        {/* Repayment Breakdown Stats */}
        <div className="glass p-5 rounded-2xl border border-border flex flex-col justify-between space-y-3 h-[360px]">
          <h2 className="text-sm font-semibold text-textPrimary flex items-center gap-2">
            <Percent size={16} className="text-accent" /> Repayment Summary
          </h2>

          <div className="space-y-2.5 flex-1 flex flex-col justify-center">
            <div className="p-3 rounded-xl bg-surface border border-border">
              <span className="text-textSecondary text-[10.5px] block">
                Estimated Monthly EMI
              </span>
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(Math.round(emi), countryCode)}
              </span>
              <span className="text-[10px] text-textSecondary block mt-0.5">
                per month after course moratorium
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-surface border border-border">
                <span className="text-textSecondary text-[10px] block">
                  Total Interest
                </span>
                <span className="font-bold text-danger">
                  {formatCurrency(Math.round(totalInterest), countryCode)}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface border border-border">
                <span className="text-textSecondary text-[10px] block">
                  Total Repayable
                </span>
                <span className="font-bold text-textPrimary">
                  {formatCurrency(Math.round(totalPayment), countryCode)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10.5px] text-textSecondary flex items-center gap-1.5 p-2 rounded-lg bg-surface/50 border border-border/50 shrink-0">
            <Info size={13} className="text-primary shrink-0" />
            <span>Govt schemes offer up to 100% interest subsidy during study.</span>
          </div>
        </div>

        {/* AI Assessment Panel */}
        <div className="glass p-5 rounded-2xl border border-border flex flex-col justify-between space-y-3 h-[360px]">
          <div className="flex justify-between items-center shrink-0">
            <h2 className="text-sm font-semibold text-textPrimary flex items-center gap-2">
              <Sparkles size={16} className="text-primary" /> AI Financial Risk
            </h2>
            <span className="badge badge-primary">Grok AI</span>
          </div>

          {aiAssessment ? (
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 text-xs flex-1 overflow-y-auto max-h-[220px] space-y-1 pr-1.5">
              <span className="font-semibold text-primary block text-[11px] mb-1">
                Affordability Advice:
              </span>
              <div className="space-y-1">
                {cleanFormattedAdvice(aiAssessment)}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-surface/60 border border-border text-center space-y-2 flex-1 flex flex-col items-center justify-center">
              <AlertCircle size={24} className="text-primary/60" />
              <p className="text-xs text-textSecondary leading-relaxed">
                Click &quot;Grok Loan Affordability&quot; to receive instant advice on whether this loan fits your income.
              </p>
            </div>
          )}

          <div className="p-2 rounded-xl bg-accent/10 border border-accent/20 text-[10.5px] text-accent flex items-center gap-1.5 shrink-0">
            <CheckCircle2 size={13} className="shrink-0" />
            <span>Eligible for Section 80E tax deduction on interest paid.</span>
          </div>
        </div>
      </div>

      {/* Loan Schemes Section Header + Search & Filter */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg font-bold text-textPrimary">
              Available Loan Schemes & Subsidies
            </h2>
            <p className="text-xs text-textSecondary">
              Click &quot;Simulate in Calculator&quot; on any card below to test its rate and EMI.
            </p>
          </div>

          {/* Search & Filter pills */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary"
              />
              <input
                type="text"
                placeholder="Search bank, PM Vidyalaxmi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-8 pr-3 py-1.5 text-xs w-full sm:w-56"
              />
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilterType("All")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterType === "All"
                    ? "bg-primary text-white"
                    : "glass text-textSecondary hover:text-textPrimary"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType("Govt")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterType === "Govt"
                    ? "bg-accent text-bg font-bold"
                    : "glass text-textSecondary hover:text-textPrimary"
                }`}
              >
                Govt & Subsidized
              </button>
              <button
                onClick={() => setFilterType("LowInterest")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterType === "LowInterest"
                    ? "bg-primary text-white"
                    : "glass text-textSecondary hover:text-textPrimary"
                }`}
              >
                Low Interest (&lt;8.5%)
              </button>
            </div>
          </div>
        </div>

        {/* Loan Cards Grid */}
        {filteredLoans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                countryCode={countryCode}
                onSelect={handleSelectLoan}
              />
            ))}
          </div>
        ) : (
          <div className="glass p-8 rounded-2xl border border-border text-center space-y-2">
            <Building2 size={32} className="mx-auto text-textSecondary/50" />
            <h3 className="text-sm font-semibold text-textPrimary">
              No matching loan schemes found
            </h3>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterType("All");
              }}
              className="btn-ghost text-xs py-1 px-3"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
