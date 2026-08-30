import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, ArrowLeft, Globe, User, DollarSign, Target, CheckCircle2 } from "lucide-react";
import { COUNTRIES, getCountryByCode } from "../lib/countries";
import { saveProfile } from "../lib/firebase";

const GOAL_OPTIONS = [
  "Save for travel / laptop",
  "Pay off student loans early",
  "Build emergency fund",
  "Graduate debt-free",
  "Master monthly budgeting",
  "Find merit scholarships",
];

export default function OnboardingPage({ user, setProfile }) {
  const [step, setStep] = useState(1);
  const [countryCode, setCountryCode] = useState("IN");
  const [name, setName] = useState(user?.displayName || "");
  const [university, setUniversity] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("2nd Year");
  const [income, setIncome] = useState("15000");
  const [selectedGoals, setSelectedGoals] = useState(["Save for travel / laptop", "Build emergency fund"]);
  const [aiWelcomeTip, setAiWelcomeTip] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const navigate = useNavigate();
  const selectedCountry = getCountryByCode(countryCode);

  function toggleGoal(goal) {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  }

  async function handleStep4Next() {
    setStep(5);
    setLoadingAi(true);

    // Call API for personalized welcome tip
    try {
      const res = await fetch("/api/finbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Generate a brief personalized welcome message (2 sentences) for student ${name || "Student"} in ${selectedCountry.name} studying ${course || "General"} at ${university || "University"} with monthly income of ${selectedCountry.symbol}${income || 15000}. Mention their goal of: ${selectedGoals.join(", ")}.`,
          systemPrompt: `You are FinBot, an encouraging financial advisor for college students in ${selectedCountry.name}. Give concise, inspiring financial welcome advice in ${selectedCountry.symbol}.`,
          studentContext: {
            currencySymbol: selectedCountry.symbol || "₹",
            income: Number(income) || 15000,
            countryName: selectedCountry.name || "India",
            course: course || "Student",
          },
        }),
      });
      if (!res.ok) throw new Error("Welcome API unavailable");
      const data = await res.json();
      setAiWelcomeTip(data.reply || `Welcome ${name || "Student"}! We're thrilled to help you master your finances in ${selectedCountry.name}.`);
    } catch {
      setAiWelcomeTip(`Welcome ${name || "Student"}! We're thrilled to help you navigate your finances in ${selectedCountry.name} and reach your goals of ${(selectedGoals || []).join(", ") || "financial growth"}.`);
    } finally {
      setLoadingAi(false);
    }
  }

  async function handleFinish() {
    const profileData = {
      country: countryCode,
      countryData: selectedCountry,
      name: name || "Student",
      university,
      course,
      year,
      income: Number(income) || 0,
      currency: selectedCountry.currency,
      goals: selectedGoals,
      onboarded: true,
    };

    const activeUid = user?.uid || "guest_user";
    await saveProfile(activeUid, profileData);
    if (setProfile) {
      setProfile(profileData);
    }
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-bg text-textPrimary flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-2">
            <Sparkles size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-textPrimary">Let's Personalise Your FinWise AI</h1>
          <p className="text-xs text-textSecondary">Step {step} of 5</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${(step / 5) * 100}%` }} />
        </div>

        {/* Form Box */}
        <div className="glass p-6 rounded-2xl border border-border space-y-6">
          {/* STEP 1: Country */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Globe size={18} />
                <span>Select Your Country</span>
              </div>
              <p className="text-xs text-textSecondary">
                This auto-configures your currency, available student loans, and eligible scholarships.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCountryCode(c.code)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      countryCode === c.code
                        ? "bg-primary/15 border-primary text-textPrimary glow-primary"
                        : "bg-surface border-border text-textSecondary hover:border-primary/40"
                    }`}
                  >
                    <span className="text-2xl">{c.flag}</span>
                    <div>
                      <p className="text-sm font-semibold text-textPrimary">{c.name}</p>
                      <p className="text-[11px] text-textSecondary">
                        {c.currency} ({c.symbol})
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Personal Details */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <User size={18} />
                <span>Student Information</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-textSecondary mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aarav Sharma"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs text-textSecondary mb-1">University / College</label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="IIT Bombay / Oxford / Harvard"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-textSecondary mb-1">Course / Major</label>
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="Computer Science"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-textSecondary mb-1">Year of Study</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="input-field"
                    >
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>Postgraduate</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Monthly Finances */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <DollarSign size={18} />
                <span>Monthly Income / Allowance</span>
              </div>
              <p className="text-xs text-textSecondary">
                Includes pocket money, part-time salary, stipend, or freelance income in {selectedCountry.name}.
              </p>

              <div className="space-y-2">
                <label className="block text-xs text-textSecondary">Monthly Total ({selectedCountry.currency})</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-textSecondary font-bold">{selectedCountry.symbol}</span>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="input-field pl-12 font-mono text-base"
                    placeholder="15000"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Goals */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Target size={18} />
                <span>What are your top financial goals?</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GOAL_OPTIONS.map((goal) => {
                  const active = selectedGoals.includes(goal);
                  return (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => toggleGoal(goal)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                        active
                          ? "bg-primary/15 border-primary text-textPrimary"
                          : "bg-surface border-border text-textSecondary hover:border-primary/40"
                      }`}
                    >
                      {active ? "✓ " : "+ "}{goal}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: AI Welcome */}
          {step === 5 && (
            <div className="space-y-4 animate-fade-in text-center py-2">
              <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center mx-auto text-accent">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-xl font-bold text-textPrimary">Your FinWise AI is Ready!</h2>

              <div className="p-4 rounded-xl glass border border-primary/30 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Sparkles size={14} />
                  <span>Grok AI First Financial Tip</span>
                </div>
                {loadingAi ? (
                  <div className="space-y-2 py-2">
                    <div className="shimmer h-4 w-full" />
                    <div className="shimmer h-4 w-4/5" />
                  </div>
                ) : (
                  <p className="text-xs text-textPrimary leading-relaxed">{aiWelcomeTip}</p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-border/60">
            {step > 1 && step < 5 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="btn-ghost flex items-center gap-1 text-xs"
              >
                <ArrowLeft size={14} /> Back
              </button>
            ) : <div />}

            {step < 4 && (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="btn-primary flex items-center gap-1.5 text-xs ml-auto"
              >
                Next <ArrowRight size={14} />
              </button>
            )}

            {step === 4 && (
              <button
                type="button"
                onClick={handleStep4Next}
                className="btn-primary flex items-center gap-1.5 text-xs ml-auto"
              >
                Generate AI Welcome <Sparkles size={14} />
              </button>
            )}

            {step === 5 && (
              <button
                type="button"
                onClick={handleFinish}
                className="btn-accent flex items-center gap-1.5 text-xs w-full justify-center"
              >
                Go to My Dashboard <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
