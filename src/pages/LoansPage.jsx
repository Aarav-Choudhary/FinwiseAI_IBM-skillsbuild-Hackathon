import { useState } from "react";
import { Building2, Calculator, Sparkles, AlertCircle, Info, Download } from "lucide-react";
import LoanCard from "../components/LoanCard";
import { getLoansForCountry, formatCurrency } from "../lib/countries";
import { exportToPDF } from "../lib/pdfExport";

export default function LoansPage({ profile }) {
  const countryCode = profile?.country || "IN";
  const loans = getLoansForCountry(countryCode);

  const [principal, setPrincipal] = useState(250000);
  const [rate, setRate] = useState(8.5);
  const [tenureMonths, setTenureMonths] = useState(60);
  const [aiAssessment, setAiAssessment] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  // EMI Math: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = rate / 12 / 100;
  const emi =
    monthlyRate > 0
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1)
      : principal / tenureMonths;

  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;

  const handleSelectLoan = (loan) => {
    setPrincipal(loan.minAmount || 100000);
    setRate(loan.interestRate || 8);
    if (loan.tenure) setTenureMonths(loan.tenure);
  };

  const handleAssessLoan = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/finbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Assess student loan affordability: Loan amount ${formatCurrency(principal, countryCode)}, interest rate ${rate}%, tenure ${tenureMonths} months. Calculated monthly EMI is ${formatCurrency(emi, countryCode)}. Student's monthly income is ${formatCurrency(profile?.income || 0, countryCode)}. Is this EMI manageable after graduation?`,
          systemPrompt: "You are a student loan risk advisor. Give a 2-sentence clear assessment.",
        }),
      });
      const data = await res.json();
      setAiAssessment(data.reply || "Loan is manageable if EMI stays below 20% of your projected starting salary.");
    } catch {
      setAiAssessment(`At an EMI of ${formatCurrency(emi, countryCode)} per month, this loan will represent about ${Math.round((emi / (profile?.income || 15000)) * 100)}% of your current income. Ensure your expected post-graduation salary covers this comfortably.`);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" id="loans-report">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Student Loan Advisor</h1>
          <p className="text-xs text-textSecondary">
            Pre-loaded loan schemes for {profile?.countryData?.name} · EMI Calculator & Risk Assessment
          </p>
        </div>

        <button
          onClick={() => exportToPDF("loans-report", "Student-Loan-Plan", { title: "Student Loan Repayment Plan", studentName: profile?.name })}
          className="btn-ghost flex items-center gap-2 text-xs"
        >
          <Download size={14} />
          <span>Export Loan Summary</span>
        </button>
      </div>

      {/* EMI Calculator + AI Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calculator Form */}
        <div className="glass p-6 rounded-2xl border border-border space-y-4">
          <h2 className="text-sm font-semibold text-textPrimary flex items-center gap-2">
            <Calculator size={16} className="text-primary" /> EMI Repayment Calculator
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-textSecondary mb-1">
                Loan Amount: <span className="font-bold text-textPrimary">{formatCurrency(principal, countryCode)}</span>
              </label>
              <input
                type="range"
                min="10000"
                max="3000000"
                step="10000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <label className="block text-textSecondary mb-1">
                Interest Rate: <span className="font-bold text-primary">{rate}% p.a.</span>
              </label>
              <input
                type="range"
                min="1"
                max="18"
                step="0.25"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <label className="block text-textSecondary mb-1">
                Tenure: <span className="font-bold text-textPrimary">{tenureMonths / 12} years ({tenureMonths} months)</span>
              </label>
              <input
                type="range"
                min="12"
                max="180"
                step="12"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Calculation Output Cards */}
        <div className="glass p-6 rounded-2xl border border-border md:col-span-2 flex flex-col justify-between space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface border border-border text-center">
              <p className="text-[11px] text-textSecondary uppercase tracking-wider mb-1">Monthly EMI</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(Math.round(emi), countryCode)}</p>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-border text-center">
              <p className="text-[11px] text-textSecondary uppercase tracking-wider mb-1">Total Interest</p>
              <p className="text-xl font-bold text-warning">{formatCurrency(Math.round(totalInterest), countryCode)}</p>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-border text-center">
              <p className="text-[11px] text-textSecondary uppercase tracking-wider mb-1">Total Payable</p>
              <p className="text-xl font-bold text-accent">{formatCurrency(Math.round(totalPayment), countryCode)}</p>
            </div>
          </div>

          {/* IBM AI Assessment Callout */}
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                <Sparkles size={14} /> IBM watsonx Affordability Assessment
              </span>
              <button
                onClick={handleAssessLoan}
                disabled={loadingAi}
                className="btn-primary text-[11px] py-1 px-3"
              >
                {loadingAi ? "Evaluating..." : "Evaluate Risk"}
              </button>
            </div>
            <p className="text-xs text-textPrimary leading-relaxed">
              {aiAssessment || "Click 'Evaluate Risk' to run IBM Granite affordability analysis against your profile."}
            </p>
          </div>
        </div>
      </div>

      {/* Available Loan Schemes Grid */}
      <div>
        <h2 className="text-sm font-semibold text-textPrimary mb-4">
          Pre-Loaded Loan Schemes in {profile?.countryData?.name}
        </h2>

        {loans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                countryCode={countryCode}
                onSelect={handleSelectLoan}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-textSecondary">No pre-loaded loans for this country. You can calculate custom parameters above.</p>
        )}
      </div>
    </div>
  );
}
