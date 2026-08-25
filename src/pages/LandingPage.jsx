import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, ShieldCheck, GraduationCap, Building2, Receipt, PieChart, CheckCircle2 } from "lucide-react";

const TYPEWRITER_PHRASES = [
  "Can I afford this laptop?",
  "What loans am I eligible for?",
  "Find me scholarships in my field",
  "How can I cut my monthly expenses?",
  "Build me a personalised budget plan",
];

export default function LandingPage() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIdx];
    const speed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setText(currentPhrase.substring(0, text.length + 1));
        if (text === currentPhrase) {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        setText(currentPhrase.substring(0, text.length - 1));
        if (text === "") {
          setIsDeleting(false);
          setPhraseIdx((prev) => (prev + 1) % TYPEWRITER_PHRASES.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, phraseIdx]);

  return (
    <div className="min-h-screen bg-bg text-textPrimary flex flex-col selection:bg-primary selection:text-white">
      {/* ── Navbar ────────────────────────────────────────── */}
      <header className="px-6 py-4 border-b border-border/80 flex items-center justify-between sticky top-0 bg-bg/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-accent">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-lg gradient-text">FinWise AI</span>
            <span className="text-[10px] text-textSecondary block -mt-1">Built for Students</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="ibm-badge hidden sm:inline-flex">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="0" y="5" width="24" height="3" />
              <rect x="3" y="10.5" width="18" height="3" />
              <rect x="0" y="16" width="24" height="3" />
            </svg>
            IBM watsonx.ai
          </div>
          <Link to="/auth" className="btn-primary flex items-center gap-2">
            <span>Get Started</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* ── Hero Section ───────────────────────────────────── */}
      <section className="px-6 py-20 max-w-6xl mx-auto text-center flex flex-col items-center justify-center flex-1">
        <div className="badge badge-primary mb-6 py-1.5 px-4 text-xs">
          <Sparkles size={14} className="text-primary" /> Powered by IBM Granite LLM
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight max-w-4xl leading-tight mb-6">
          Your AI-Powered Money Mentor. <br />
          <span className="gradient-text">Built Exclusively for College Students.</span>
        </h1>

        <p className="text-lg sm:text-xl text-textSecondary max-w-2xl mb-10">
          Country-first financial guidance, loan matching, scholarship search, and budget tracking powered by real AI advisory.
        </p>

        {/* Typewriter Prompt Box */}
        <div className="w-full max-w-xl glass p-4 rounded-2xl border border-primary/30 shadow-2xl mb-10 text-left flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
            <Sparkles size={16} />
          </div>
          <div className="flex-1 font-mono text-sm sm:text-base text-textPrimary h-6 flex items-center">
            <span>{text}</span>
            <span className="w-2 h-4 bg-accent ml-1 animate-pulse" />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/auth" className="btn-primary text-base px-8 py-3.5 flex items-center gap-2">
            <span>Launch FinWise AI</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────── */}
      <section className="px-6 py-16 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-textPrimary mb-3">
            Everything a Student Needs to Thrive Financially
          </h2>
          <p className="text-textSecondary text-sm max-w-lg mx-auto">
            Customised to your country's currency, loan policies, and scholarship database.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass glass-hover p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <PieChart size={24} />
            </div>
            <h3 className="font-semibold text-lg text-textPrimary">Budget & Expense Analyzer</h3>
            <p className="text-sm text-textSecondary leading-relaxed">
              Track where your money goes with visual charts. Get instant IBM Granite insights on trimming overspending.
            </p>
          </div>

          <div className="glass glass-hover p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <GraduationCap size={24} />
            </div>
            <h3 className="font-semibold text-lg text-textPrimary">Country-Scoped Scholarships</h3>
            <p className="text-sm text-textSecondary leading-relaxed">
              Auto-matched to your country, field, and year. Never miss a deadline with automated browser notifications.
            </p>
          </div>

          <div className="glass glass-hover p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center text-warning">
              <Building2 size={24} />
            </div>
            <h3 className="font-semibold text-lg text-textPrimary">Student Loan Advisor</h3>
            <p className="text-sm text-textSecondary leading-relaxed">
              Explore national student loan schemes, calculate monthly EMIs, and check affordability before taking debt.
            </p>
          </div>
        </div>
      </section>

      {/* ── Testimonials / Trust ──────────────────────────── */}
      <section className="px-6 py-16 border-t border-border/60 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-5 rounded-2xl space-y-3">
            <div className="flex text-warning gap-1">
              {"★".repeat(5)}
            </div>
            <p className="text-xs text-textPrimary/90 italic">
              "FinBot explained my loan repayment options in simple terms. Saved me from taking a high-interest private loan."
            </p>
            <p className="text-xs font-semibold text-textSecondary">— Ananya S., CS Student (India)</p>
          </div>

          <div className="glass p-5 rounded-2xl space-y-3">
            <div className="flex text-warning gap-1">
              {"★".repeat(5)}
            </div>
            <p className="text-xs text-textPrimary/90 italic">
              "The scholarship finder matched me with a $7,500 grant I didn't even know existed. Game changer!"
            </p>
            <p className="text-xs font-semibold text-textSecondary">— Marcus T., Biology Major (USA)</p>
          </div>

          <div className="glass p-5 rounded-2xl space-y-3">
            <div className="flex text-warning gap-1">
              {"★".repeat(5)}
            </div>
            <p className="text-xs text-textPrimary/90 italic">
              "Finally an app that works in GBP and understands UK student loans. The AI expense analysis is spot on."
            </p>
            <p className="text-xs font-semibold text-textSecondary">— Oliver K., Economics (UK)</p>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="px-6 py-8 border-t border-border text-center text-xs text-textSecondary">
        <p className="mb-2">FinWise AI — Deployed for IBM SkillsBuild Hackathon 2026</p>
        <p className="text-[11px] text-textSecondary/60">Powered by IBM watsonx.ai (Granite-13b-chat-v2)</p>
      </footer>
    </div>
  );
}
