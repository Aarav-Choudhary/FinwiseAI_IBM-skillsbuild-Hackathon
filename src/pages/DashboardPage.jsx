import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, MessageSquare, Receipt, Building2, GraduationCap,
  PiggyBank, Calendar, TrendingUp, Plus, ArrowUpRight
} from "lucide-react";
import HealthScoreGauge from "../components/HealthScoreGauge";
import AIInsightCard from "../components/AIInsightCard";
import BudgetRing from "../components/BudgetRing";
import { formatCurrency, getScholarshipsForCountry, getLoansForCountry } from "../lib/countries";

export default function DashboardPage({ profile, expenses = [], budget }) {
  const countryCode = profile?.country || "IN";
  const currencySymbol = profile?.countryData?.symbol || "₹";

  const [healthScore, setHealthScore] = useState(78);
  const [healthGrade, setHealthGrade] = useState("B");
  const [aiTip, setAiTip] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const totalIncome = profile?.income || 15000;
  const totalSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalBudget = budget?.total || totalIncome;

  const scholarships = getScholarshipsForCountry(countryCode).slice(0, 2);
  const loans = getLoansForCountry(countryCode).slice(0, 2);

  const fetchHealthScore = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/health-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, expenses, budget }),
      });
      if (!res.ok) throw new Error("Health score API unavailable");
      const data = await res.json();
      setHealthScore(data.score || 78);
      setHealthGrade(data.grade || "B");
      setAiTip(data.summary || "Your budget is looking healthy!");
    } catch {
      const savingsRate = totalIncome > 0 ? Math.max(0, (totalIncome - totalSpent) / totalIncome) : 0;
      const score = Math.round(Math.min(100, Math.max(35, (savingsRate * 50) + (totalSpent <= totalBudget ? 30 : 10) + 20)));
      const grade = score >= 80 ? "A" : score >= 60 ? "B" : score >= 40 ? "C" : "D";
      setHealthScore(score);
      setHealthGrade(grade);
      setAiTip(savingsRate > 0.15
        ? "Excellent job! You are maintaining a healthy savings buffer this month."
        : "Keep your non-essential expenses under 30% of total income to stay on track.");
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchHealthScore();
  }, [expenses]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* ── Welcome Banner ─────────────────────────────────── */}
      <div className="glass p-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-textPrimary">
              Welcome back, {profile?.name || "Student"} 👋
            </h1>
            <span className="text-xl">{profile?.countryData?.flag}</span>
          </div>
          <p className="text-xs text-textSecondary">
            Studying {profile?.course || "General Studies"} at {profile?.university || "University"} · {profile?.year || "Student"}
          </p>
        </div>

        <Link to="/chat" className="btn-primary flex items-center gap-2 text-xs py-2.5 px-4">
          <Sparkles size={14} />
          <span>Ask FinBot AI</span>
        </Link>
      </div>

      {/* ── Core Grid: Health Score, Budget, AI Insight ───── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Widget 1: AI Health Score */}
        <div className="glass p-6 rounded-2xl border border-border flex flex-col items-center justify-between">
          <div className="w-full flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">AI Financial Health Score</span>
            <span className="badge badge-primary">IBM Granite</span>
          </div>
          <HealthScoreGauge score={healthScore} grade={healthGrade} />
          <p className="text-[11px] text-textSecondary text-center mt-3">
            Based on budget adherence, savings, and expense patterns
          </p>
        </div>

        {/* Widget 2: Budget Ring */}
        <div className="glass p-6 rounded-2xl border border-border flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Monthly Budget</span>
            <Link to="/budget" className="text-xs text-primary hover:underline flex items-center gap-0.5">
              Details <ArrowUpRight size={12} />
            </Link>
          </div>
          <BudgetRing spent={totalSpent} total={totalBudget} countryCode={countryCode} />
        </div>

        {/* Widget 3: Daily AI Insight */}
        <div className="flex flex-col justify-between">
          <AIInsightCard tip={aiTip} loading={loadingAi} onRefresh={fetchHealthScore} />

          {/* Quick Action Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Link to="/expenses" className="glass p-3 rounded-xl hover:border-primary/40 transition-all flex items-center gap-2 text-xs text-textPrimary">
              <Receipt size={16} className="text-primary" />
              <span>Add Expense</span>
            </Link>
            <Link to="/chat" className="glass p-3 rounded-xl hover:border-primary/40 transition-all flex items-center gap-2 text-xs text-textPrimary">
              <MessageSquare size={16} className="text-accent" />
              <span>Ask FinBot</span>
            </Link>
            <Link to="/loans" className="glass p-3 rounded-xl hover:border-primary/40 transition-all flex items-center gap-2 text-xs text-textPrimary">
              <Building2 size={16} className="text-warning" />
              <span>Check Loans</span>
            </Link>
            <Link to="/scholarships" className="glass p-3 rounded-xl hover:border-primary/40 transition-all flex items-center gap-2 text-xs text-textPrimary">
              <GraduationCap size={16} className="text-primary" />
              <span>Scholarships</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Second Row: Deadlines + Recommended Loans ──────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Scholarship Deadlines */}
        <div className="glass p-6 rounded-2xl border border-border space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-accent" />
              <h3 className="font-semibold text-textPrimary text-sm">Upcoming Scholarship Deadlines</h3>
            </div>
            <Link to="/scholarships" className="text-xs text-accent hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {scholarships.map((s) => (
              <div key={s.id} className="p-3 rounded-xl bg-surface border border-border/80 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-semibold text-textPrimary">{s.name}</h4>
                  <p className="text-[11px] text-textSecondary">{s.provider}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-accent">{formatCurrency(s.amount, countryCode)}</span>
                  <p className="text-[10px] text-warning font-medium">Due: {s.deadline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Eligible Loans */}
        <div className="glass p-6 rounded-2xl border border-border space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-warning" />
              <h3 className="font-semibold text-textPrimary text-sm">Top Loan Schemes ({profile?.countryData?.name})</h3>
            </div>
            <Link to="/loans" className="text-xs text-warning hover:underline flex items-center gap-1">
              Calculator <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {loans.map((l) => (
              <div key={l.id} className="p-3 rounded-xl bg-surface border border-border/80 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-semibold text-textPrimary">{l.name}</h4>
                  <p className="text-[11px] text-textSecondary">{l.provider}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-primary">{l.interestRate}% p.a.</span>
                  <p className="text-[10px] text-textSecondary">Up to {formatCurrency(l.maxAmount, countryCode)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
